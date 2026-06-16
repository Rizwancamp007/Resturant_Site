import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, ChefHat, LayoutDashboard, LogOut, UtensilsCrossed } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/reservations', label: 'Reservations' },
  { to: '/about', label: 'About' }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsOpen(false); setProfileOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-midnight-800/80 backdrop-blur-2xl border-b border-white/[0.05] shadow-glass' : 'bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center group-hover:shadow-gold transition-shadow duration-300">
              <UtensilsCrossed className="w-5 h-5 text-midnight-800" />
            </div>
            <span className="text-xl md:text-2xl font-display font-bold tracking-wide gold-text">Lahore Traditional</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to}
                className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${location.pathname === link.to ? 'text-gold-400' : 'text-midnight-50/70 hover:text-midnight-50 hover:bg-white/[0.05]'}`}>
                {link.label}
                {location.pathname === link.to && (
                  <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-0.5 bg-gold-400 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/cart" className="relative p-2.5 rounded-xl hover:bg-white/[0.05] transition-all duration-300 group" id="cart-button">
              <ShoppingBag className="w-5 h-5 text-midnight-50/70 group-hover:text-gold-400 transition-colors" />
              {itemCount > 0 && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 w-5 h-5 bg-warm-400 text-midnight-900 text-xs font-bold rounded-full flex items-center justify-center">
                  {itemCount}
                </motion.span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-2 rounded-xl hover:bg-white/[0.05] transition-all" id="profile-button">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center text-midnight-800 text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-56 glass-card p-2 z-50">
                      <div className="px-3 py-2 border-b border-white/[0.05] mb-1">
                        <p className="text-sm font-medium text-midnight-50">{user.name}</p>
                        <p className="text-xs text-midnight-200">{user.email}</p>
                      </div>
                      <Link to="/orders" className="flex items-center gap-2 px-3 py-2 text-sm text-midnight-50/70 hover:text-midnight-50 hover:bg-white/[0.05] rounded-lg transition-all">
                        <ShoppingBag className="w-4 h-4" /> My Orders
                      </Link>
                      {(user.role === 'staff' || user.role === 'admin') && (
                        <Link to="/kitchen" className="flex items-center gap-2 px-3 py-2 text-sm text-midnight-50/70 hover:text-midnight-50 hover:bg-white/[0.05] rounded-lg transition-all">
                          <ChefHat className="w-4 h-4" /> Kitchen
                        </Link>
                      )}
                      {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-2 px-3 py-2 text-sm text-midnight-50/70 hover:text-midnight-50 hover:bg-white/[0.05] rounded-lg transition-all">
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-warm-400 hover:bg-warm-400/10 rounded-lg transition-all mt-1">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm" id="login-button">Sign In</Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <Link to="/cart" className="relative p-2 rounded-lg" id="mobile-cart-button">
              <ShoppingBag className="w-5 h-5 text-midnight-50/70" />
              {itemCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-warm-400 text-midnight-900 text-[10px] font-bold rounded-full flex items-center justify-center">{itemCount}</span>}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-lg hover:bg-white/[0.05]" id="mobile-menu-toggle">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-midnight-800/95 backdrop-blur-2xl border-t border-white/[0.05]">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.to} to={link.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${location.pathname === link.to ? 'text-gold-400 bg-gold-400/10' : 'text-midnight-50/70 hover:text-midnight-50 hover:bg-white/[0.05]'}`}>
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link to="/orders" className="block px-4 py-3 text-sm text-midnight-50/70 hover:text-midnight-50 hover:bg-white/[0.05] rounded-xl">My Orders</Link>
                  {user.role === 'admin' && <Link to="/admin" className="block px-4 py-3 text-sm text-midnight-50/70 hover:text-midnight-50 hover:bg-white/[0.05] rounded-xl">Dashboard</Link>}
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-sm text-warm-400 hover:bg-warm-400/10 rounded-xl">Logout</button>
                </>
              ) : (
                <Link to="/login" className="block text-center btn-primary text-sm mt-2">Sign In</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
