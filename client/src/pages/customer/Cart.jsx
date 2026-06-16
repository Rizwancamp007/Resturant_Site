import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Store } from 'lucide-react';
import useCartStore from '../../store/cartStore';

export default function Cart() {
  const { items, orderType, setOrderType, updateQuantity, removeItem, clearCart, getSubtotal, getTax, getDeliveryFee, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const tax = getTax();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center flex flex-col items-center justify-center gap-6">
        <div className="w-20 h-20 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-midnight-200">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display font-bold">Your Cart is Empty</h2>
          <p className="text-sm text-midnight-200">Add exquisite gourmet dishes to get started.</p>
        </div>
        <Link to="/menu" className="btn-primary w-full py-3.5 mt-2">
          Explore Our Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/[0.05]">
        <h1 className="text-4xl font-display font-bold">Your Selection</h1>
        <button onClick={clearCart} className="text-sm text-warm-400 hover:underline">
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center"
            >
              <div className="flex gap-4 items-center">
                {item.image && (
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl bg-midnight-900 shrink-0" />
                )}
                <div>
                  <h3 className="text-lg font-display font-bold text-midnight-50">{item.name}</h3>
                  {item.customizations?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.customizations.map((c) => (
                        <span key={c.name} className="text-[10px] bg-white/[0.05] border border-white/[0.08] text-midnight-200 px-2 py-0.5 rounded">
                          {c.name}: {c.selected}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gold-400 font-accent font-semibold mt-1">Rs. {(item.price + item.customizations.reduce((s, c) => s + (c.priceModifier || 0), 0)).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 border-white/[0.05] pt-4 sm:pt-0">
                {/* Quantity Controls */}
                <div className="flex items-center bg-white/[0.05] rounded-xl p-1 border border-white/[0.08]">
                  <button onClick={() => updateQuantity(idx, item.quantity - 1)} className="p-1.5 text-midnight-200 hover:text-white transition-colors">
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-accent font-semibold">{item.quantity}</span>
                  <button onClick={() => updateQuantity(idx, item.quantity + 1)} className="p-1.5 text-midnight-200 hover:text-white transition-colors">
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-base font-accent font-semibold text-midnight-50 min-w-[80px] text-right">Rs. {item.itemTotal.toLocaleString()}</span>
                  <button onClick={() => removeItem(idx)} className="p-2 rounded-xl bg-warm-400/10 hover:bg-warm-400/20 text-warm-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Order Summary & Settings */}
        <div className="space-y-6">
          {/* Order Type Toggle */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Order Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setOrderType('delivery')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${orderType === 'delivery' ? 'border-gold-400 bg-gold-400/10 text-gold-400' : 'border-white/[0.08] bg-white/[0.03] text-midnight-200 hover:text-white'}`}
              >
                <Truck className="w-5 h-5" />
                <span className="text-xs font-semibold">Delivery</span>
              </button>
              <button
                onClick={() => setOrderType('takeaway')}
                className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${orderType === 'takeaway' ? 'border-gold-400 bg-gold-400/10 text-gold-400' : 'border-white/[0.08] bg-white/[0.03] text-midnight-200 hover:text-white'}`}
              >
                <Store className="w-5 h-5" />
                <span className="text-xs font-semibold">Takeaway</span>
              </button>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400 mb-2">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-midnight-200">Subtotal</span>
                <span className="font-accent">Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-midnight-200">Sales Tax (16%)</span>
                <span className="font-accent">Rs. {tax.toLocaleString()}</span>
              </div>
              {orderType === 'delivery' && (
                <div className="flex justify-between">
                  <span className="text-midnight-200">Delivery Fee</span>
                  <span className="font-accent">Rs. {deliveryFee.toLocaleString()}</span>
                </div>
              )}
              <div className="pt-4 border-t border-white/[0.05] flex justify-between text-base font-bold text-midnight-50">
                <span>Total Amount</span>
                <span className="font-accent text-gold-400">Rs. {total.toLocaleString()}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-4">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
