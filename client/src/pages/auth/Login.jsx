import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}! 🍽️`);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'staff') navigate('/kitchen');
      else navigate('/menu');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/5 rounded-full filter blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-warm-400/5 rounded-full filter blur-[100px] animate-float [animation-delay:2s]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass-card p-8 md:p-10 relative z-10"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-bold mb-2">Welcome Back</h2>
          <p className="text-sm text-midnight-200">Indulge your senses once more.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-200/50" />
              <input
                type="email"
                placeholder="chef@eleve.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input pl-12"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gold-400 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-midnight-200/50" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input pl-12"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm"
          >
            {isLoading ? (
              <span className="w-5 h-5 border-2 border-midnight-800 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Sign In <LogIn className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/[0.05] text-center text-sm">
          <span className="text-midnight-200">New to Lahore Traditional? </span>
          <Link to="/register" className="text-gold-400 font-semibold inline-flex items-center gap-1 hover:underline">
            Create an account <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
