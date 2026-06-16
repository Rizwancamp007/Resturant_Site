import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      orderType: 'delivery',

      addItem: (item) => {
        const { items } = get();
        const existingIndex = items.findIndex(i => i.menuItem === item.menuItem && JSON.stringify(i.customizations) === JSON.stringify(item.customizations));
        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex].quantity += item.quantity;
          updated[existingIndex].itemTotal = updated[existingIndex].quantity * (updated[existingIndex].price + (updated[existingIndex].customizations?.reduce((s, c) => s + (c.priceModifier || 0), 0) || 0));
          set({ items: updated });
        } else {
          const priceWithCustom = item.price + (item.customizations?.reduce((s, c) => s + (c.priceModifier || 0), 0) || 0);
          set({ items: [...items, { ...item, itemTotal: item.quantity * priceWithCustom }] });
        }
      },

      removeItem: (index) => {
        const { items } = get();
        set({ items: items.filter((_, i) => i !== index) });
      },

      updateQuantity: (index, quantity) => {
        if (quantity < 1) return;
        const { items } = get();
        const updated = [...items];
        updated[index].quantity = quantity;
        const priceWithCustom = updated[index].price + (updated[index].customizations?.reduce((s, c) => s + (c.priceModifier || 0), 0) || 0);
        updated[index].itemTotal = quantity * priceWithCustom;
        set({ items: updated });
      },

      setOrderType: (type) => set({ orderType: type }),

      clearCart: () => set({ items: [], orderType: 'delivery' }),

      get subtotal() { return get().items.reduce((sum, item) => sum + item.itemTotal, 0); },
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.itemTotal, 0),
      getTax: () => Math.round(get().getSubtotal() * 0.16),
      getDeliveryFee: () => get().orderType === 'delivery' ? 250 : 0,
      getTotal: () => get().getSubtotal() + get().getTax() + get().getDeliveryFee(),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    { name: 'lahore-traditional-cart' }
  )
);

export default useCartStore;
