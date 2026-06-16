import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Clock, Info, Check, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import Loader from '../../components/common/Loader';

export default function Reservations() {
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState(2);
  const [timeSlot, setTimeSlot] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Status lists
  const [slots, setSlots] = useState([]);
  const [myReservations, setMyReservations] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (user) {
      fetchMyReservations();
    } else {
      setLoadingHistory(false);
    }
  }, [user]);

  useEffect(() => {
    if (date) {
      fetchAvailability();
    }
  }, [date]);

  const fetchMyReservations = async () => {
    try {
      const { data } = await api.get('/reservations');
      setMyReservations(data.data);
    } catch {
      toast.error('Failed to load reservation history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchAvailability = async () => {
    setLoadingSlots(true);
    try {
      const { data } = await api.get(`/reservations/availability?date=${date}`);
      setSlots(data.data);
    } catch {
      toast.error('Could not fetch time slots availability');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please sign in to book a table');
    if (!date || !timeSlot || !guests || !contactPhone) {
      return toast.error('Please fill in all required fields');
    }

    try {
      await api.post('/reservations', {
        date,
        timeSlot,
        guests,
        specialRequests,
        contactPhone
      });
      toast.success('Table reservation request submitted! 🍽️');
      // Reset form
      setTimeSlot('');
      setSpecialRequests('');
      fetchMyReservations();
      if (date) fetchAvailability();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit reservation');
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await api.delete(`/reservations/${id}`);
      toast.success('Reservation cancelled');
      fetchMyReservations();
      if (date) fetchAvailability();
    } catch {
      toast.error('Could not cancel reservation');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-4xl font-display font-bold mb-10 pb-4 border-b border-white/[0.05]">Reservations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">
        {/* Booking Form */}
        <form onSubmit={handleBook} className="lg:col-span-3 space-y-6 glass-card p-6 md:p-8">
          <h2 className="text-2xl font-display font-bold text-gold-400">Book a Table</h2>
          <p className="text-xs text-midnight-200">Real-time seating checks automatically verify tables.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Selection */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Select Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-200" />
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="glass-input pl-12"
                  required
                />
              </div>
            </div>

            {/* Guests */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Guests Count</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight-200" />
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value))}
                  className="glass-input pl-12"
                  required
                />
              </div>
            </div>
          </div>

          {/* Time Slot Picker Grid */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-3">Available Time Slots</label>
            {!date ? (
              <div className="p-4 bg-white/[0.02] border border-white/[0.08] text-center text-xs text-midnight-200 rounded-xl">
                Please choose a date above to check available seating.
              </div>
            ) : loadingSlots ? (
              <div className="py-6 text-center text-xs text-midnight-200">Checking seat maps...</div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {slots.map((s) => (
                  <button
                    key={s.timeSlot}
                    type="button"
                    disabled={s.isFull}
                    onClick={() => setTimeSlot(s.timeSlot)}
                    className={`p-3 text-center rounded-xl text-xs font-semibold border transition-all ${timeSlot === s.timeSlot ? 'border-gold-400 bg-gold-400/10 text-gold-400' : s.isFull ? 'border-transparent bg-white/[0.01] text-midnight-200/30 cursor-not-allowed' : 'border-white/[0.08] bg-white/[0.03] text-midnight-200 hover:text-white'}`}
                  >
                    {s.timeSlot}
                    <span className="block text-[8px] font-normal text-midnight-200 mt-0.5">{s.available} left</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Contact Phone</label>
            <input
              type="tel"
              placeholder="03001234567"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="glass-input"
              required
            />
          </div>

          {/* Requests */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Special Requests (optional)</label>
            <textarea
              placeholder="E.g., Window seat, birthday celebration, high chair needed..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="glass-input h-24 resize-none"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2">
            Submit Booking Request <Check className="w-5 h-5" />
          </button>
        </form>

        {/* History list */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-display font-bold text-gold-400">My Reservations</h2>
          
          {loadingHistory ? (
            <Loader text="Loading reservations..." />
          ) : myReservations.length === 0 ? (
            <div className="p-6 bg-white/[0.02] border border-white/[0.08] text-center text-xs text-midnight-200 rounded-xl">
              No reservation bookings recorded yet.
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {myReservations.map((r) => (
                <div key={r._id} className="glass-card p-5 space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold">{new Date(r.date).toLocaleDateString()}</p>
                      <p className="text-xs text-midnight-200">{r.timeSlot} — {r.guests} Guests</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                      r.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                      r.status === 'cancelled' ? 'bg-warm-400/10 text-warm-400 border border-warm-400/20' :
                      'bg-gold-400/10 text-gold-400 border border-gold-400/20'
                    }`}>
                      {r.status}
                    </span>
                  </div>
                  {r.tableNumber && (
                    <p className="text-xs text-gold-400 font-semibold">Assigned Table: #{r.tableNumber}</p>
                  )}
                  {r.specialRequests && (
                    <p className="text-xs text-midnight-200 italic">"{r.specialRequests}"</p>
                  )}
                  {r.status === 'pending' && (
                    <button
                      onClick={() => handleCancel(r._id)}
                      className="absolute bottom-5 right-5 p-2 bg-warm-400/10 hover:bg-warm-400/20 text-warm-400 rounded-xl transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
