import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import useAuthStore from './store/authStore';

// Pages
import Home from './pages/customer/Home';
import Menu from './pages/customer/Menu';
import About from './pages/customer/About';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import OrderHistory from './pages/customer/OrderHistory';
import Reservations from './pages/customer/Reservations';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Staff & Admin
import KitchenDashboard from './pages/staff/KitchenDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

export default function App() {
  const initAuth = useAuthStore((s) => s.initAuth);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <div className="flex flex-col min-h-screen bg-midnight-950 text-midnight-50 selection:bg-gold-400/30 selection:text-white relative overflow-hidden">
      {/* Background Grid & Dotted Layout Designs */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(45,28,22,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(45,28,22,0.015)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(45,28,22,0.03)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-midnight-100/10 to-transparent pointer-events-none" />
      <div className="absolute top-[60%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-midnight-100/10 to-transparent pointer-events-none" />

      {/* Cozy Dynamic Aurora Ambient Gradients */}
      <div className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-gold-400/12 filter blur-[130px] pointer-events-none animate-aurora-slow" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-warm-400/10 filter blur-[150px] pointer-events-none animate-aurora-medium" />
      <div className="absolute top-[35%] left-[55%] w-[45vw] h-[45vw] rounded-full bg-[#E29578]/10 filter blur-[110px] pointer-events-none animate-aurora-fast" />
      <div className="absolute bottom-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-gold-400/8 filter blur-[120px] pointer-events-none animate-aurora-slow" />

      <Navbar />
      <main className="flex-grow pt-20 relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
          <Route path="/reservations" element={<Reservations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />

          {/* Customer Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute roles={['customer']}>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={['customer', 'staff', 'admin']}>
                <OrderHistory />
              </ProtectedRoute>
            }
          />

          {/* Staff & Admin Routes */}
          <Route
            path="/kitchen"
            element={
              <ProtectedRoute roles={['staff', 'admin']}>
                <KitchenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
