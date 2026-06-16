import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ChefHat, Check, Flame, Truck, Play, Award, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

export default function KitchenDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveOrders();

    // Setup Socket
    const socket = io('/', {
      auth: { token: localStorage.getItem('lahore-traditional-auth') ? JSON.parse(localStorage.getItem('lahore-traditional-auth'))?.state?.accessToken : '' }
    });

    socket.on('connect', () => {
      console.log('Connected to Kitchen socket room');
    });

    socket.on('newOrder', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      playOrderChime();
      toast.success(`New order received: ${newOrder.orderNumber}! 🔔`);
    });

    socket.on('orderCancelled', (data) => {
      setOrders(prev => prev.filter(o => o._id !== data.orderId));
      toast.error(`Order ${data.orderId} was cancelled by customer.`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchActiveOrders = async () => {
    try {
      // Fetch orders that are not yet delivered/cancelled
      const statuses = ['placed', 'confirmed', 'preparing', 'ready', 'out_for_delivery'];
      let activeOrders = [];
      for (const status of statuses) {
        const { data } = await api.get(`/orders?status=${status}&limit=50`);
        activeOrders = [...activeOrders, ...data.data];
      }
      // Sort by creation date ascending (oldest first for FIFO queue)
      activeOrders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setOrders(activeOrders);
    } catch {
      toast.error('Could not load kitchen orders queue');
    } finally {
      setLoading(false);
    }
  };

  const playOrderChime = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5 note
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.log('Audio chime blocked or failed');
    }
  };

  const handleUpdateStatus = async (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'placed') nextStatus = 'confirmed';
    else if (currentStatus === 'confirmed') nextStatus = 'preparing';
    else if (currentStatus === 'preparing') nextStatus = 'ready';
    else if (currentStatus === 'ready') nextStatus = 'out_for_delivery';
    else if (currentStatus === 'out_for_delivery') nextStatus = 'delivered';

    if (!nextStatus) return;

    try {
      await api.put(`/orders/${orderId}/status`, { status: nextStatus });
      toast.success(`Order advanced to: ${nextStatus.replace(/_/g, ' ')}`);
      fetchActiveOrders();
    } catch {
      toast.error('Failed to progress order status');
    }
  };

  const getElapsedTime = (createdAt) => {
    const diff = Math.floor((new Date() - new Date(createdAt)) / 60000);
    return `${diff}m ago`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex justify-between items-center mb-10 pb-4 border-b border-white/[0.05]">
        <h1 className="text-4xl font-display font-bold flex items-center gap-3">
          <ChefHat className="w-8 h-8 text-gold-400" /> Kitchen Display Queue
        </h1>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gold-400" /> Pending</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-warm-400 animate-pulse" /> Cooking</span>
        </div>
      </div>

      {loading ? (
        <Loader text="Initializing KDS..." />
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-midnight-200">
          Kitchen display is empty. High standards are maintained!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {orders.map((order) => {
            const timeElapsed = getElapsedTime(order.createdAt);
            const isCooking = order.status === 'preparing';

            return (
              <div
                key={order._id}
                className={`glass-card p-6 flex flex-col justify-between border-t-4 ${
                  order.status === 'placed' ? 'border-t-gold-400/50' :
                  order.status === 'confirmed' ? 'border-t-gold-400' :
                  order.status === 'preparing' ? 'border-t-warm-400' :
                  order.status === 'ready' ? 'border-t-emerald-400' :
                  'border-t-blue-400'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-white">{order.orderNumber}</h3>
                      <p className="text-[10px] text-midnight-200 uppercase font-semibold">{order.orderType}</p>
                    </div>
                    <span className="text-xs text-gold-400 font-accent font-semibold">{timeElapsed}</span>
                  </div>

                  <div className="space-y-3 border-y border-white/[0.05] py-4 my-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs">
                        <div className="flex justify-between items-start font-semibold text-white">
                          <span>{item.name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                        {item.customizations?.length > 0 && (
                          <div className="text-[10px] text-midnight-200 space-y-0.5 mt-0.5">
                            {item.customizations.map(c => (
                              <p key={c.name}>• {c.name}: {c.selected}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-lg text-[10px] text-midnight-200 italic mb-4">
                      "{order.specialInstructions}"
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => handleUpdateStatus(order._id, order.status)}
                    className={`btn-primary w-full py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 capitalize ${
                      order.status === 'placed' ? 'from-gold-400 to-gold-500' :
                      order.status === 'confirmed' ? 'from-warm-400 to-warm-500' :
                      order.status === 'preparing' ? 'from-emerald-400 to-emerald-500' :
                      'from-blue-400 to-blue-500'
                    }`}
                  >
                    {order.status === 'placed' && <><Play className="w-3.5 h-3.5" /> Confirm Order</>}
                    {order.status === 'confirmed' && <><Flame className="w-3.5 h-3.5" /> Start Cooking</>}
                    {order.status === 'preparing' && <><Check className="w-3.5 h-3.5" /> Mark Ready</>}
                    {order.status === 'ready' && <><Truck className="w-3.5 h-3.5" /> Dispatch Out</>}
                    {order.status === 'out_for_delivery' && <><Check className="w-3.5 h-3.5" /> Mark Delivered</>}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
