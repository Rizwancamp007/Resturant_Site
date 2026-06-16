import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from 'socket.io-client';
import { Check, Clock, ShieldAlert, Truck, ChevronRight, Ban, Award, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import Loader from '../../components/common/Loader';

const stages = [
  { key: 'placed', label: 'Placed', icon: Clock },
  { key: 'confirmed', label: 'Confirmed', icon: Check },
  { key: 'preparing', label: 'In Kitchen', icon: Award },
  { key: 'ready', label: 'Ready', icon: Check },
  { key: 'out_for_delivery', label: 'On the Way', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Check }
];

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!selectedOrder) return;

    // Connect to sockets for tracking updates
    const socket = io('/', {
      auth: { token: localStorage.getItem('lahore-traditional-auth') ? JSON.parse(localStorage.getItem('lahore-traditional-auth'))?.state?.accessToken : '' }
    });

    socket.emit('joinOrderRoom', selectedOrder._id);

    socket.on('orderStatusUpdate', (data) => {
      if (data.orderId === selectedOrder._id) {
        setSelectedOrder(prev => ({ ...prev, status: data.status, statusHistory: data.statusHistory }));
        toast.success(`Order status updated to ${data.status.replace('_', ' ')}! 🛎️`);
        fetchOrders();
      }
    });

    socket.on('paymentUpdate', (data) => {
      if (data.orderId === selectedOrder._id) {
        setSelectedOrder(prev => ({ ...prev, paymentStatus: data.paymentStatus, status: data.orderStatus }));
        toast.success(`Payment verified! Order status is now ${data.orderStatus}`);
        fetchOrders();
      }
    });

    return () => {
      socket.emit('leaveOrderRoom', selectedOrder._id);
      socket.disconnect();
    };
  }, [selectedOrder?._id]);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders');
      setOrders(data.data);
      if (selectedOrder) {
        const refreshed = data.data.find(o => o._id === selectedOrder._id);
        if (refreshed) setSelectedOrder(refreshed);
      }
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const activeStageIndex = stages.findIndex(s => s.key === selectedOrder?.status);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-display font-bold mb-10 pb-4 border-b border-white/[0.05]">Order Hub</h1>

      {loading ? (
        <Loader text="Gathering past orders..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-midnight-200">You haven't placed any orders yet.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
          {/* Orders List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400 mb-4">Past & Active Orders</h3>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {orders.map((order) => (
                <div
                  key={order._id}
                  onClick={() => setSelectedOrder(order)}
                  className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${selectedOrder?._id === order._id ? 'border-gold-400 bg-gold-400/10' : 'border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.05]'}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm font-semibold">{order.orderNumber}</p>
                      <p className="text-xs text-midnight-200">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      order.status === 'delivered' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      order.status === 'cancelled' ? 'bg-warm-400/10 text-warm-400 border border-warm-400/20' :
                      'bg-gold-400/10 text-gold-400 border border-gold-400/20'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-midnight-200">{order.items.length} item(s)</span>
                    <span className="font-accent font-bold text-white">Rs. {order.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Detail Panel */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                <motion.div
                  key={selectedOrder._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="glass-card p-8 space-y-8"
                >
                  {/* Title & Cancel */}
                  <div className="flex justify-between items-start border-b border-white/[0.05] pb-5">
                    <div>
                      <h2 className="text-2xl font-display font-bold text-gold-400">{selectedOrder.orderNumber}</h2>
                      <p className="text-xs text-midnight-200">Ordered: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>
                    {selectedOrder.status === 'placed' && (
                      <button
                        onClick={() => handleCancelOrder(selectedOrder._id)}
                        className="px-3.5 py-2 bg-warm-400/10 hover:bg-warm-400/20 border border-warm-400/20 text-warm-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                      >
                        <Ban className="w-3.5 h-3.5" /> Cancel Order
                      </button>
                    )}
                  </div>

                  {/* Real-time Stage Tracker */}
                  {selectedOrder.status !== 'cancelled' ? (
                    <div className="space-y-6">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-gold-400">Preparation Journey</h3>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        {stages.map((stage, idx) => {
                          const isCompleted = idx <= activeStageIndex;
                          const isActive = idx === activeStageIndex;
                          const Icon = stage.icon;

                          return (
                            <div key={stage.key} className="flex flex-col items-center text-center space-y-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                                isCompleted ? 'bg-gold-400 text-midnight-900 border-gold-400 shadow-gold' : 'bg-white/[0.02] border-white/[0.08] text-midnight-200'
                              } ${isActive ? 'animate-pulse scale-105' : ''}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <span className={`text-[10px] font-semibold tracking-wide ${isCompleted ? 'text-gold-400' : 'text-midnight-200'}`}>{stage.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-warm-400/10 border border-warm-400/20 rounded-2xl p-5 flex items-center gap-3 text-warm-400">
                      <ShieldAlert className="w-5 h-5" />
                      <span className="text-sm font-semibold">This order has been cancelled.</span>
                    </div>
                  )}

                  {/* Payment Details */}
                  <div className="bg-white/[0.02] border border-white/[0.08] p-5 rounded-2xl space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">Payment Summary</h4>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-midnight-200">Method</p>
                        <p className="font-semibold capitalize">{selectedOrder.paymentMethod.replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <p className="text-midnight-200">Status</p>
                        <p className={`font-semibold capitalize ${selectedOrder.paymentStatus === 'verified' ? 'text-emerald-400' : 'text-gold-400'}`}>{selectedOrder.paymentStatus}</p>
                      </div>
                      {selectedOrder.transactionId && (
                        <div className="col-span-2">
                          <p className="text-midnight-200">Transaction ID</p>
                          <p className="font-accent font-semibold">{selectedOrder.transactionId}</p>
                        </div>
                      )}
                      {selectedOrder.paymentScreenshot && (
                        <div className="col-span-2 pt-2">
                          <a href={selectedOrder.paymentScreenshot} target="_blank" rel="noreferrer" className="text-gold-400 flex items-center gap-1 hover:underline">
                            View Payment Receipt Screenshot <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-gold-400">Selected Specialties</h4>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div>
                            <span className="font-semibold text-white">{item.name}</span>
                            <span className="text-midnight-200 text-xs ml-2">x{item.quantity}</span>
                            {item.customizations?.length > 0 && (
                              <div className="flex gap-2 mt-0.5">
                                {item.customizations.map(c => (
                                  <span key={c.name} className="text-[10px] text-midnight-200 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.05]">
                                    {c.name}: {c.selected}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="font-accent font-semibold text-midnight-50">Rs. {item.itemTotal.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subtotal, tax, grand total */}
                  <div className="border-t border-white/[0.05] pt-5 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-midnight-200">Subtotal</span>
                      <span className="font-accent">Rs. {selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-midnight-200">GST (16%)</span>
                      <span className="font-accent">Rs. {selectedOrder.tax.toLocaleString()}</span>
                    </div>
                    {selectedOrder.orderType === 'delivery' && (
                      <div className="flex justify-between">
                        <span className="text-midnight-200">Delivery Fee</span>
                        <span className="font-accent">Rs. {selectedOrder.deliveryFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold text-gold-400 pt-2 border-t border-white/[0.05]">
                      <span>Total Paid</span>
                      <span className="font-accent">Rs. {selectedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="glass-card p-10 text-center text-midnight-200">
                  Select an order from the list to view real-time tracking details.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
