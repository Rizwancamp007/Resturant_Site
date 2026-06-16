import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, Utensils, Calendar, CreditCard, ChevronRight, Check, X, Ban, Trash2, Edit, Plus, Upload, CheckCircle2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

const sidebarLinks = [
  { path: '', label: 'Overview', icon: LayoutDashboard },
  { path: 'menu', label: 'Menu Management', icon: Utensils },
  { path: 'payments', label: 'Payment Approvals', icon: CreditCard },
  { path: 'reservations', label: 'Reservations', icon: Calendar }
];

export default function AdminDashboard() {
  const location = useLocation();
  const currentPath = location.pathname.split('/').pop();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
          <h2 className="text-xl font-display font-bold text-gold-400 mb-6">Management</h2>
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentPath === 'admin' && link.path === '' || currentPath === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-gold-400 text-midnight-800 font-semibold' : 'bg-white/[0.03] text-midnight-200 hover:bg-white/[0.05]'}`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Dashboard Panels */}
        <div className="lg:col-span-4">
          <Routes>
            <Route path="" element={<OverviewPanel />} />
            <Route path="menu" element={<MenuManagementPanel />} />
            <Route path="payments" element={<PaymentApprovalsPanel />} />
            <Route path="reservations" element={<ReservationsPanel />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

/* 1. OVERVIEW PANEL */
function OverviewPanel() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get('/orders/analytics');
      setData(data.data);
    } catch {
      toast.error('Failed to load analytical data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader text="Assembling analytics charts..." />;

  const COLORS = ['#d4a853', '#e8734a', '#10b981', '#ef4444', '#3b82f6'];

  return (
    <div className="space-y-10">
      {/* Overview Stat Counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 space-y-2">
          <p className="text-xs text-midnight-200 uppercase tracking-wider font-semibold">Total Revenue</p>
          <p className="text-3xl font-accent font-bold text-gold-400">Rs. {data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="glass-card p-6 space-y-2">
          <p className="text-xs text-midnight-200 uppercase tracking-wider font-semibold">Total Orders</p>
          <p className="text-3xl font-accent font-bold text-white">{data.totalOrders}</p>
        </div>
        <div className="glass-card p-6 space-y-2">
          <p className="text-xs text-midnight-200 uppercase tracking-wider font-semibold">Average Order Value</p>
          <p className="text-3xl font-accent font-bold text-white">
            Rs. {data.totalOrders > 0 ? Math.round(data.totalRevenue / data.totalOrders).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Revenue Charts */}
      {data.revenueByDay?.length > 0 && (
        <div className="glass-card p-6 space-y-6">
          <h3 className="text-lg font-display font-bold">Revenue Timeline (Last 30 Days)</h3>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="_id" stroke="#888" style={{ fontSize: '10px' }} />
                <YAxis stroke="#888" style={{ fontSize: '10px' }} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1525', border: '1px solid #333' }} />
                <Line type="monotone" dataKey="revenue" stroke="#d4a853" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Best Sellers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.topItems?.length > 0 && (
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-display font-bold">Best Selling Dishes</h3>
            <div className="space-y-4">
              {data.topItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                    <span>{item._id}</span>
                  </div>
                  <span className="text-gold-400 font-semibold">{item.totalOrdered} ordered</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders Pie Chart */}
        {data.ordersByStatus?.length > 0 && (
          <div className="glass-card p-6 space-y-4 flex flex-col justify-between">
            <h3 className="text-lg font-display font-bold">Order Breakdown</h3>
            <div className="w-full h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.ordersByStatus} dataKey="count" nameKey="_id" cx="50%" cy="50%" outerRadius={70} fill="#8884d8" label>
                    {data.ordersByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-4 justify-center text-[10px]">
              {data.ordersByStatus.map((entry, index) => (
                <span key={entry._id} className="flex items-center gap-1.5 capitalize">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} /> {entry._id}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 2. MENU MANAGEMENT PANEL */
function MenuManagementPanel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editorItem, setEditorItem] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('appetizer');
  const [dietaryTags, setDietaryTags] = useState([]);
  const [isAvailable, setIsAvailable] = useState(true);
  const [preparationTime, setPreparationTime] = useState(15);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const { data } = await api.get('/menu?limit=100');
      setItems(data.data);
    } catch {
      toast.error('Failed to load menu list');
    } finally {
      setLoading(false);
    }
  };

  const openEditor = (item = null) => {
    if (item) {
      setEditorItem(item);
      setName(item.name);
      setDescription(item.description);
      setPrice(item.price);
      setCategory(item.category);
      setDietaryTags(item.dietaryTags || []);
      setIsAvailable(item.isAvailable);
      setPreparationTime(item.preparationTime || 15);
    } else {
      setEditorItem({ isNew: true });
      setName('');
      setDescription('');
      setPrice('');
      setCategory('appetizer');
      setDietaryTags([]);
      setIsAvailable(true);
      setPreparationTime(15);
    }
    setSelectedFile(null);
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    const payload = { name, description, price: parseFloat(price), category, dietaryTags, isAvailable, preparationTime };

    try {
      let savedItem;
      if (editorItem.isNew) {
        const { data } = await api.post('/menu', payload);
        savedItem = data.data;
        toast.success('Gourmet dish added to menu!');
      } else {
        const { data } = await api.put(`/menu/${editorItem._id}`, payload);
        savedItem = data.data;
        toast.success('Dish updated successfully');
      }

      // Handle Image Upload if file selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        await api.post(`/menu/${savedItem._id}/image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setEditorItem(null);
      fetchMenu();
    } catch (err) {
      toast.error('Failed to save menu item');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Delete this dish permanently from menu?')) return;
    try {
      await api.delete(`/menu/${id}`);
      toast.success('Dish deleted from menu');
      fetchMenu();
    } catch {
      toast.error('Could not delete dish');
    }
  };

  const toggleDietaryTag = (tag) => {
    setDietaryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  if (loading) return <Loader text="Curating master food list..." />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-display font-bold">Menu Manager</h3>
        <button onClick={() => openEditor()} className="btn-primary py-2 text-xs flex items-center gap-1">
          <Plus className="w-3.5 h-3.5" /> Add New Dish
        </button>
      </div>

      {/* Item List Table */}
      {!editorItem ? (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.02] text-midnight-200">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Dish</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Category</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Price</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg bg-midnight-950" />}
                      <div>
                        <p className="font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-midnight-200 line-clamp-1">{item.description}</p>
                      </div>
                    </td>
                    <td className="p-4 capitalize text-xs text-midnight-200">{item.category}</td>
                    <td className="p-4 font-accent font-semibold text-white">Rs. {item.price.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.isAvailable ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/[0.03] text-midnight-200 border border-white/[0.05]'}`}>
                        {item.isAvailable ? 'Available' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button onClick={() => openEditor(item)} className="p-2 bg-white/[0.05] hover:bg-gold-400 hover:text-midnight-900 border border-white/[0.08] hover:border-gold-400 rounded-xl transition-all">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDeleteItem(item._id)} className="p-2 bg-warm-400/10 hover:bg-warm-400/20 text-warm-400 rounded-xl transition-all">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Edit or Add view */
        <form onSubmit={handleSaveItem} className="glass-card p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-center border-b border-white/[0.05] pb-4">
            <h4 className="text-lg font-display font-bold text-gold-400">{editorItem.isNew ? 'Create Dish' : 'Edit Dish'}</h4>
            <button type="button" onClick={() => setEditorItem(null)} className="p-2 bg-white/[0.05] rounded-xl"><X className="w-4 h-4" /></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Dish Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="glass-input" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Price (PKR)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="glass-input" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="glass-input bg-midnight-800">
                {['appetizer', 'main', 'dessert', 'drink', 'special'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Prep Time (minutes)</label>
              <input type="number" value={preparationTime} onChange={(e) => setPreparationTime(parseInt(e.target.value))} className="glass-input" required />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="glass-input h-20 resize-none" required />
          </div>

          {/* Image Upload Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Dish Image</label>
            <div className="relative border border-dashed border-white/[0.08] hover:border-gold-400/40 rounded-xl p-4 text-center cursor-pointer transition-all bg-white/[0.02]">
              <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="absolute inset-0 opacity-0 cursor-pointer" />
              {selectedFile ? (
                <p className="text-xs text-gold-400 font-semibold flex items-center justify-center gap-1"><Upload className="w-3.5 h-3.5" /> Selected: {selectedFile.name}</p>
              ) : (
                <p className="text-xs text-midnight-200">Click to upload photo screenshot or AI asset image</p>
              )}
            </div>
          </div>

          {/* Dietary Tags checkbox-style selectors */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-3">Dietary Tags</label>
            <div className="flex flex-wrap gap-2">
              {['vegan', 'vegetarian', 'gluten-free', 'spicy', 'halal', 'dairy-free'].map(tag => {
                const checked = dietaryTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleDietaryTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${checked ? 'border-gold-400 bg-gold-400/15 text-gold-400' : 'border-white/[0.08] bg-white/[0.02] text-midnight-200 hover:text-white'}`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-4 border-t border-white/[0.05]">
            <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="accent-gold-400 w-4 h-4 rounded border-white/[0.08]" id="isAvailable" />
            <label htmlFor="isAvailable" className="text-sm text-white select-none">Mark item as available in menu list</label>
          </div>

          <button type="submit" className="btn-primary w-full py-3.5 font-bold">Save Changes</button>
        </form>
      )}
    </div>
  );
}

/* 3. PAYMENT APPROVALS PANEL */
function PaymentApprovalsPanel() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingPayments();
  }, []);

  const fetchPendingPayments = async () => {
    try {
      const { data } = await api.get('/orders?limit=100');
      // Show only online transfer orders whose paymentStatus is submitted (pending manual verification)
      const pending = data.data.filter(o => o.paymentStatus === 'submitted');
      setOrders(pending);
    } catch {
      toast.error('Could not load payment queue');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (orderId, action) => {
    try {
      await api.put(`/payments/${orderId}/verify`, { action });
      toast.success(action === 'verify' ? 'Payment approved and verified!' : 'Payment rejected');
      fetchPendingPayments();
    } catch {
      toast.error('Failed to change payment status');
    }
  };

  if (loading) return <Loader text="Syncing pending bank transfers..." />;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display font-bold">Manual Payment Approvals</h3>
      
      {orders.length === 0 ? (
        <div className="p-6 bg-white/[0.02] border border-white/[0.08] text-center text-xs text-midnight-200 rounded-xl">
          No manual payment approvals pending verification.
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="glass-card p-6 grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
              <div className="md:col-span-2 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">{order.orderNumber}</span>
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase bg-gold-400/10 text-gold-400 border border-gold-400/20">{order.paymentMethod.replace(/_/g, ' ')}</span>
                </div>
                <p className="text-xs text-midnight-200">Customer: {order.user.name} ({order.user.phone})</p>
                {order.transactionId && (
                  <p className="text-xs font-accent text-white">Trans ID: <span className="font-bold text-gold-400">{order.transactionId}</span></p>
                )}
                {order.paymentScreenshot && (
                  <a href={order.paymentScreenshot} target="_blank" rel="noreferrer" className="text-xs text-gold-400 font-semibold flex items-center gap-1 hover:underline">
                    View Screenshot receipt <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <div className="text-xs font-accent">
                <p className="text-midnight-200">Amount Due</p>
                <p className="text-base font-bold text-white">Rs. {order.total.toLocaleString()}</p>
              </div>
              <div className="flex md:justify-end gap-2">
                <button onClick={() => handleVerify(order._id, 'verify')} className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-midnight-950 border border-emerald-500/20 rounded-xl transition-all">
                  <Check className="w-4 h-4" />
                </button>
                <button onClick={() => handleVerify(order._id, 'reject')} className="p-2 bg-warm-400/10 hover:bg-warm-400 text-warm-400 hover:text-midnight-950 border border-warm-400/20 rounded-xl transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* 4. RESERVATIONS PANEL */
function ReservationsPanel() {
  const [resList, setResList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const { data } = await api.get('/reservations');
      setResList(data.data);
    } catch {
      toast.error('Failed to load reservations list');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}`, { status });
      toast.success(`Reservation status set to: ${status}`);
      fetchReservations();
    } catch {
      toast.error('Failed to update reservation');
    }
  };

  if (loading) return <Loader text="Re-synchronizing table logs..." />;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-display font-bold">Reservation Oversights</h3>

      {resList.length === 0 ? (
        <div className="p-6 bg-white/[0.02] border border-white/[0.08] text-center text-xs text-midnight-200 rounded-xl">
          No table reservations booked yet.
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/[0.05] bg-white/[0.02] text-midnight-200">
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Customer</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Date & Time</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Guests</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Table #</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                  <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Confirm / Action</th>
                </tr>
              </thead>
              <tbody>
                {resList.map((r) => (
                  <tr key={r._id} className="border-b border-white/[0.03] hover:bg-white/[0.01] transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-white">{r.user.name}</p>
                      <p className="text-xs text-midnight-200">{r.contactPhone || r.user.phone}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold">{new Date(r.date).toLocaleDateString()}</p>
                      <p className="text-xs text-midnight-200">{r.timeSlot}</p>
                    </td>
                    <td className="p-4 font-accent font-semibold text-white">{r.guests} guests</td>
                    <td className="p-4 text-xs font-semibold text-gold-400">#{r.tableNumber || 'Auto'}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        r.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        r.status === 'cancelled' ? 'bg-warm-400/10 text-warm-400 border border-warm-400/20' :
                        'bg-gold-400/10 text-gold-400 border border-gold-400/20'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => handleUpdateStatus(r._id, 'confirmed')} className="p-2 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-midnight-950 border border-emerald-500/20 rounded-xl transition-all">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => handleUpdateStatus(r._id, 'cancelled')} className="p-2 bg-warm-400/10 hover:bg-warm-400 text-warm-400 hover:text-midnight-950 border border-warm-400/20 rounded-xl transition-all">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                      {r.status === 'confirmed' && (
                        <button onClick={() => handleUpdateStatus(r._id, 'completed')} className="p-2 bg-white/[0.05] hover:bg-gold-400 hover:text-midnight-900 border border-white/[0.08] hover:border-gold-400 rounded-xl text-gold-400 transition-all text-xs font-semibold">
                          Complete Seat
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
