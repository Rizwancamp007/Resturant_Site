import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, Star, ShoppingBag, Plus, Minus, Info, X, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useCartStore from '../../store/cartStore';
import useAuthStore from '../../store/authStore';
import Loader from '../../components/common/Loader';

const categories = ['all', 'appetizer', 'main', 'dessert', 'drink', 'special'];
const dietaryOptions = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'spicy', label: 'Spicy' },
  { value: 'halal', label: 'Halal' }
];

export default function Menu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDietaries, setSelectedDietaries] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Modal Customization State
  const [qty, setQty] = useState(1);
  const [customSelections, setCustomSelections] = useState({});

  const user = useAuthStore((s) => s.user);
  const addItemToCart = useCartStore((s) => s.addItem);

  useEffect(() => {
    fetchMenu();
  }, [activeCategory, selectedDietaries]);

  const fetchMenu = async () => {
    setLoading(true);
    try {
      let url = '/menu?';
      if (activeCategory !== 'all') url += `category=${activeCategory}&`;
      if (selectedDietaries.length > 0) url += `dietary=${selectedDietaries.join(',')}&`;
      
      const { data } = await api.get(url);
      setItems(data.data);
    } catch (error) {
      toast.error('Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.get(`/menu?search=${search}`);
      setItems(data.data);
    } catch {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleDietary = (tag) => {
    setSelectedDietaries((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Open customization modal
  const openModal = (item) => {
    setSelectedItem(item);
    setQty(1);
    // Initialize default customizations
    const initial = {};
    if (item.customizations) {
      item.customizations.forEach((c) => {
        initial[c.name] = c.options[0];
      });
    }
    setCustomSelections(initial);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const handleCustomOptionChange = (custName, option) => {
    setCustomSelections((prev) => ({ ...prev, [custName]: option }));
  };

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }

    const priceModifiers = Object.values(customSelections).reduce((sum, opt) => sum + (opt.priceModifier || 0), 0);
    const finalPrice = selectedItem.price + priceModifiers;

    const cartItem = {
      menuItem: selectedItem._id,
      name: selectedItem.name,
      price: selectedItem.price,
      quantity: qty,
      image: selectedItem.image,
      customizations: Object.entries(customSelections).map(([name, opt]) => ({
        name,
        selected: opt.label,
        priceModifier: opt.priceModifier
      }))
    };

    addItemToCart(cartItem);
    toast.success(`${qty}x ${selectedItem.name} added to cart! 🛍️`);
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-display font-bold">Discover Culinary Art</h1>
          <p className="text-sm text-midnight-200">Fresh organic components, crafted to order.</p>
        </div>

        {/* Search & Filter Trigger */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <form onSubmit={handleSearch} className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-200" />
            <input
              type="text"
              placeholder="Search dishes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glass-input pl-10 pr-4 py-2 text-sm w-full md:w-64"
            />
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-xl border flex items-center justify-center transition-all ${showFilters ? 'bg-gold-400/20 border-gold-400 text-gold-400' : 'bg-white/[0.05] border-white/[0.08] text-midnight-50'}`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dietary Filters Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 mb-10 flex flex-wrap gap-3 items-center"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-400 mr-2">Dietary Filters:</span>
            {dietaryOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleDietary(opt.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${selectedDietaries.includes(opt.value) ? 'bg-gold-400 text-midnight-900 border-gold-400' : 'bg-white/[0.05] border-white/[0.08] text-midnight-50/70 hover:text-white'}`}
              >
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Tabs */}
      <div className="flex overflow-x-auto gap-2 pb-6 mb-10 border-b border-white/[0.05] scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2.5 rounded-xl text-sm font-medium capitalize shrink-0 transition-all ${activeCategory === cat ? 'bg-gold-400 text-midnight-900 font-semibold' : 'bg-white/[0.03] text-midnight-50/60 hover:bg-white/[0.05]'}`}
          >
            {cat === 'all' ? 'All Dishes' : cat}
          </button>
        ))}
      </div>

      {/* Grid Menu Content */}
      {loading ? (
        <Loader text="Curating dishes..." />
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-midnight-200">No dishes match your current filter.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card-hover group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden rounded-t-2xl bg-midnight-900">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-midnight-200">No Image</div>
                  )}
                  {item.rating > 0 && (
                    <div className="absolute top-4 right-4 bg-midnight-800/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-gold-400 flex items-center gap-1 border border-white/[0.05]">
                      <Star className="w-3.5 h-3.5 fill-gold-400" /> {item.rating}
                    </div>
                  )}
                  {item.dietaryTags?.includes('spicy') && (
                    <div className="absolute top-4 left-4 bg-warm-400/20 backdrop-blur-md p-1.5 rounded-full text-warm-400 border border-warm-400/20">
                      <Flame className="w-4 h-4 fill-warm-400" />
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-display font-bold text-midnight-50 group-hover:text-gold-400 transition-colors">{item.name}</h3>
                  </div>
                  <p className="text-sm text-midnight-200 line-clamp-2 leading-relaxed">{item.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.dietaryTags?.map((tag) => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-midnight-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 pt-0 flex justify-between items-center">
                <span className="text-lg font-accent font-semibold text-gold-400">Rs. {item.price.toLocaleString()}</span>
                <button
                  onClick={() => openModal(item)}
                  disabled={!item.isAvailable}
                  className="p-3 bg-white/[0.05] hover:bg-gold-400 hover:text-midnight-900 border border-white/[0.08] hover:border-gold-400 rounded-xl text-gold-400 transition-all"
                >
                  <ShoppingBag className="w-4.5 h-4.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Gourmet Customization Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-midnight-900/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-midnight-800 border border-white/[0.08] rounded-3xl shadow-glass overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Close Button */}
              <button onClick={closeModal} className="absolute right-6 top-6 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-midnight-200 hover:text-white transition-all z-10">
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto flex-grow">
                <div className="h-64 relative bg-midnight-900">
                  <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight-800 to-transparent" />
                </div>

                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="text-3xl font-display font-bold mb-2">{selectedItem.name}</h2>
                    <p className="text-sm text-midnight-200 leading-relaxed">{selectedItem.description}</p>
                  </div>

                  {/* Customization Options */}
                  {selectedItem.customizations?.length > 0 && (
                    <div className="space-y-6 pt-4 border-t border-white/[0.05]">
                      {selectedItem.customizations.map((cust) => (
                        <div key={cust.name} className="space-y-3">
                          <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">{cust.name}</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {cust.options.map((opt) => (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => handleCustomOptionChange(cust.name, opt)}
                                className={`p-3 text-left rounded-xl text-sm border flex justify-between items-center transition-all ${customSelections[cust.name]?.label === opt.label ? 'border-gold-400 bg-gold-400/10 text-gold-400' : 'border-white/[0.08] bg-white/[0.03] text-midnight-50/70 hover:text-white'}`}
                              >
                                <span>{opt.label}</span>
                                {opt.priceModifier > 0 && <span className="text-xs text-gold-400">+Rs. {opt.priceModifier}</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Quantity and Order Button */}
                  <div className="flex items-center justify-between pt-6 border-t border-white/[0.05] gap-4">
                    <div className="flex items-center bg-white/[0.05] rounded-xl p-1.5 border border-white/[0.08]">
                      <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2 text-midnight-200 hover:text-white transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-accent font-semibold">{qty}</span>
                      <button onClick={() => setQty(qty + 1)} className="p-2 text-midnight-200 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button onClick={handleAddToCart} className="btn-primary flex-grow py-3.5 flex items-center justify-center gap-2">
                      Add to Cart — Rs. {((selectedItem.price + Object.values(customSelections).reduce((sum, opt) => sum + (opt.priceModifier || 0), 0)) * qty).toLocaleString()}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
