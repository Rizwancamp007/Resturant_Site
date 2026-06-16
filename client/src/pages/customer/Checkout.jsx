import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clipboard, CreditCard, MapPin, Sparkles, Upload, Phone, User, Landmark } from 'lucide-react';
import toast from 'react-hot-toast';
import useCartStore from '../../store/cartStore';
import api from '../../services/api';
import Loader from '../../components/common/Loader';

export default function Checkout() {
  const { items, orderType, getSubtotal, getTax, getDeliveryFee, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();

  // Settings
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);

  // Form Fields
  const [paymentMethod, setPaymentMethod] = useState('jazzcash');
  const [address, setAddress] = useState({ street: '', city: 'Lahore', state: 'Punjab', zipCode: '54000' });
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Post-order Payment Proof
  const [placedOrder, setPlacedOrder] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [screenshotPreview, setScreenshotPreview] = useState(null);

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      const { data } = await api.get('/payments/details');
      setPaymentDetails(data.data);
    } catch {
      toast.error('Could not load merchant payment details');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Account number copied!');
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (orderType === 'delivery' && !address.street) {
      return toast.error('Please provide a delivery street address');
    }

    setLoading(true);
    const orderPayload = {
      items: items.map(i => ({
        menuItem: i.menuItem,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        customizations: i.customizations,
        itemTotal: i.itemTotal
      })),
      subtotal: getSubtotal(),
      tax: getTax(),
      deliveryFee: getDeliveryFee(),
      total: getTotal(),
      paymentMethod,
      orderType,
      deliveryAddress: orderType === 'delivery' ? address : undefined,
      specialInstructions
    };

    try {
      const { data } = await api.post('/orders', orderPayload);
      setPlacedOrder(data.data);
      toast.success('Order placed successfully! 🎉');
      
      // If Cash on Delivery, clear cart and go to tracker right away
      if (paymentMethod === 'cash_on_delivery') {
        clearCart();
        navigate('/orders');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();
    if (!transactionId && !paymentScreenshot) {
      return toast.error('Please enter a Transaction ID or upload a payment screenshot');
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('orderId', placedOrder._id);
    formData.append('transactionId', transactionId);
    if (paymentScreenshot) {
      formData.append('screenshot', paymentScreenshot);
    }

    try {
      await api.post('/payments/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Payment proof submitted! Awaiting staff verification.');
      clearCart();
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to submit proof. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !placedOrder) return <Loader text="Processing gourmet request..." />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <AnimatePresence mode="wait">
        {!placedOrder ? (
          /* STEP 1: Address & Method */
          <motion.div
            key="checkout-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="grid grid-cols-1 md:grid-cols-5 gap-10"
          >
            {/* Form Fields */}
            <form onSubmit={handlePlaceOrder} className="md:col-span-3 space-y-8">
              {orderType === 'delivery' && (
                <div className="glass-card p-6 space-y-4">
                  <h3 className="text-lg font-display font-bold flex items-center gap-2 text-gold-400">
                    <MapPin className="w-5 h-5" /> Delivery Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Street Address</label>
                      <input
                        type="text"
                        placeholder="House No., Street Name, Area"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">City</label>
                        <input type="text" value={address.city} readOnly className="glass-input opacity-70" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-midnight-200 mb-2">Zip Code</label>
                        <input type="text" value={address.zipCode} readOnly className="glass-input opacity-70" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="text-lg font-display font-bold flex items-center gap-2 text-gold-400">
                  <CreditCard className="w-5 h-5" /> Payment Method
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'jazzcash', label: 'JazzCash', icon: Sparkles },
                    { id: 'easypaisa', label: 'Easypaisa', icon: Sparkles },
                    { id: 'bank_transfer', label: 'Bank Transfer', icon: Landmark },
                    { id: 'cash_on_delivery', label: 'Cash on Delivery', icon: Landmark }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === m.id ? 'border-gold-400 bg-gold-400/10 text-gold-400' : 'border-white/[0.08] bg-white/[0.03] text-midnight-200 hover:text-white'}`}
                    >
                      <m.icon className="w-5 h-5" />
                      <span className="text-xs font-semibold">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">Special Chef Instructions</label>
                <textarea
                  placeholder="Tell us about food allergies, spice preferences, or delivery drop-off directions..."
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="glass-input h-28 resize-none"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2">
                Order & Proceed to Payment <Check className="w-5 h-5" />
              </button>
            </form>

            {/* Sticky Order Breakdown */}
            <div className="md:col-span-2 space-y-6">
              <div className="glass-card p-6 space-y-4 sticky top-28">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gold-400">Order Totals</h3>
                <div className="space-y-3 text-sm border-b border-white/[0.05] pb-4">
                  <div className="flex justify-between">
                    <span className="text-midnight-200">Subtotal</span>
                    <span className="font-accent">Rs. {getSubtotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-midnight-200">Tax (16%)</span>
                    <span className="font-accent">Rs. {getTax().toLocaleString()}</span>
                  </div>
                  {orderType === 'delivery' && (
                    <div className="flex justify-between">
                      <span className="text-midnight-200">Delivery Fee</span>
                      <span className="font-accent">Rs. {getDeliveryFee().toLocaleString()}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-between text-base font-bold text-gold-400">
                  <span>Grand Total</span>
                  <span className="font-accent">Rs. {getTotal().toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* STEP 2: Payment Verification */
          <motion.div
            key="payment-proof"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 md:p-10 space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-display font-bold text-gold-400">Transfer & Confirm</h2>
              <p className="text-sm text-midnight-200">Please send Rs. {placedOrder.total.toLocaleString()} using the details below:</p>
            </div>

            {/* Dynamic account detail cards based on selected method */}
            {paymentDetails && (
              <div className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl space-y-4 max-w-md mx-auto">
                {paymentMethod === 'jazzcash' && (
                  <>
                    <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">JazzCash Account</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-midnight-200">Account Name</p>
                        <p className="text-sm font-semibold">{paymentDetails.jazzcash.accountName}</p>
                      </div>
                      <button onClick={() => copyToClipboard(paymentDetails.jazzcash.accountNumber)} className="p-2 bg-white/[0.05] rounded-xl hover:bg-white/[0.1] text-midnight-200 hover:text-white transition-colors">
                        <Clipboard className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-midnight-200">Account Number</p>
                      <p className="text-base font-accent font-bold text-white">{paymentDetails.jazzcash.accountNumber}</p>
                    </div>
                  </>
                )}
                {paymentMethod === 'easypaisa' && (
                  <>
                    <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">Easypaisa Account</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-midnight-200">Account Name</p>
                        <p className="text-sm font-semibold">{paymentDetails.easypaisa.accountName}</p>
                      </div>
                      <button onClick={() => copyToClipboard(paymentDetails.easypaisa.accountNumber)} className="p-2 bg-white/[0.05] rounded-xl hover:bg-white/[0.1] text-midnight-200 hover:text-white transition-colors">
                        <Clipboard className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-midnight-200">Account Number</p>
                      <p className="text-base font-accent font-bold text-white">{paymentDetails.easypaisa.accountNumber}</p>
                    </div>
                  </>
                )}
                {paymentMethod === 'bank_transfer' && (
                  <>
                    <h4 className="text-sm font-bold text-gold-400 uppercase tracking-wider">Bank Account</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-midnight-200">Bank Name</p>
                        <p className="text-sm font-semibold">{paymentDetails.bankTransfer.bankName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-midnight-200">Account Title</p>
                        <p className="text-sm font-semibold">{paymentDetails.bankTransfer.accountTitle}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-midnight-200">Account Number</p>
                          <p className="text-sm font-semibold">{paymentDetails.bankTransfer.accountNumber}</p>
                        </div>
                        <button onClick={() => copyToClipboard(paymentDetails.bankTransfer.accountNumber)} className="p-2 bg-white/[0.05] rounded-xl hover:bg-white/[0.1] text-midnight-200 hover:text-white transition-colors">
                          <Clipboard className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-midnight-200">IBAN</p>
                          <p className="text-sm font-semibold">{paymentDetails.bankTransfer.iban}</p>
                        </div>
                        <button onClick={() => copyToClipboard(paymentDetails.bankTransfer.iban)} className="p-2 bg-white/[0.05] rounded-xl hover:bg-white/[0.1] text-midnight-200 hover:text-white transition-colors">
                          <Clipboard className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Proof Submission form */}
            <form onSubmit={handleSubmitProof} className="max-w-md mx-auto space-y-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">Transaction ID (optional)</label>
                <input
                  type="text"
                  placeholder="Enter 12-digit ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">Payment Receipt Screenshot</label>
                <div className="relative border-2 border-dashed border-white/[0.08] hover:border-gold-400/40 rounded-2xl p-6 text-center cursor-pointer transition-all bg-white/[0.02]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleScreenshotChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {screenshotPreview ? (
                    <img src={screenshotPreview} alt="Receipt preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                  ) : (
                    <div className="space-y-2 text-midnight-200">
                      <Upload className="w-8 h-8 mx-auto" />
                      <p className="text-sm font-medium">Upload Receipt Screenshot</p>
                      <p className="text-xs text-midnight-200/50">PNG, JPG, or WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-base font-bold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-midnight-800 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Confirm Payment Proof <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
