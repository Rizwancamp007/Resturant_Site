import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Clock, Heart, Award } from 'lucide-react';
import Scene3D from '../../components/three/Scene3D';

export default function Home() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-transparent">
      {/* Background Neon Glowing Orbs */}
      <div className="absolute top-1/4 left-1/10 w-[450px] h-[450px] bg-gold-400/10 rounded-full filter blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/10 w-[500px] h-[500px] bg-warm-400/10 rounded-full filter blur-[140px] animate-float [animation-delay:3s]" />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-gold-400/5 via-transparent to-transparent pointer-events-none" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Portrait Fine Dining Scene */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative h-[500px] md:h-[600px] overflow-hidden rounded-[32px] border-4 border-gold-400/20 shadow-glass group z-10"
          >
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?w=800"
              alt="Mughal culinary banquet"
              className="w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
            />
            {/* Absolute Dark Overlay for contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Anniversary Wreath Overlay */}
            <div className="absolute top-8 left-8 bg-midnight-950/80 backdrop-blur-md border border-gold-400/30 p-5 rounded-3xl flex flex-col items-center justify-center text-center shadow-lg">
              <Award className="w-8 h-8 text-gold-400 mb-1 animate-pulse" />
              <span className="block text-2xl font-display font-bold text-white">50th</span>
              <span className="block text-[8px] uppercase tracking-widest text-gold-300 font-bold">Anniversary</span>
            </div>
            
            {/* Bottom Overlay Label */}
            <div className="absolute bottom-6 left-6 right-6">
              <p className="text-xs uppercase tracking-wider text-gold-400 font-bold">Anarkali Lahore</p>
              <p className="text-lg font-display font-medium text-white">Est. 1976</p>
            </div>
          </motion.div>

          {/* Right Side: Editorial Typography & Custom CTA */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-12 text-left"
          >
            {/* Header copy */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-display font-bold leading-[1.15] text-midnight-50 text-left">
                Modern <span className="inline-flex items-center gap-1.5"><span className="text-2xl">🇵🇰</span> Lahori</span> dining <br />
                with <span className="italic font-serif font-light text-gold-400 lowercase">a timeless soul</span> – <br />
                elegant plates, warm light, <br />
                and flavors that linger.
              </h1>
              <p className="text-base md:text-lg text-midnight-100 font-light leading-relaxed max-w-xl">
                Experience the heritage of Lahore’s culinary courts reimagined with signature premium dining, local ingredients, and grand Shahi hospitality.
              </p>
            </div>

            {/* Premium Action Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-4 border-t border-midnight-700/10">
              
              {/* Badge Column */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gold-400/15 border border-gold-400/30 flex items-center justify-center text-gold-400">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gold-600 font-bold">Heritage Level</p>
                  <p className="text-xs font-bold text-midnight-50">Shahi attention</p>
                </div>
              </div>

              {/* Pill Button with rotating dish */}
              <div className="flex items-center gap-2">
                <Link
                  to="/reservations"
                  className="inline-flex items-center gap-3 bg-[#9E2A2B] hover:bg-[#800E13] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-red-900/20 active:scale-95"
                >
                  Reserve Table
                </Link>
                <div className="relative w-10 h-10 rounded-full border border-gold-400/30 overflow-hidden animate-spin-slow shadow-md flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=100"
                    alt="rotating gourmet item"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Chef Signature Column */}
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100"
                  alt="Executive Chef"
                  className="w-10 h-10 rounded-full object-cover border border-gold-400/30"
                />
                <div>
                  <p className="text-xs font-bold text-midnight-50">Shahi Chef</p>
                  <p className="font-serif italic text-[11px] text-gold-600">Executive Kitchen</p>
                </div>
              </div>

            </div>
          </motion.div>

        </div>
      </section>

      {/* Signature Specials Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/[0.08]">
        <div className="text-center mb-20 space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="section-title text-4xl md:text-6xl font-bold"
          >
            Lahore's Imperial Specials
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subtitle mx-auto text-midnight-200"
          >
            A curated selection of our signature creations, hand-crafted with rare seasonal spices and traditional recipes.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              name: 'Butt Karahi Mutton Special',
              desc: 'Fresh mutton slow-cooked in a traditional wok with fresh tomatoes, green chilies, ginger, and desi ghee.',
              price: 'Rs. 2,800',
              img: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600',
              rating: '5.0'
            },
            {
              name: 'Lahori Shahi Chicken Biryani',
              desc: 'Layered basmati rice and chicken cooked with authentic aromatic spices, saffron, mint, and plums.',
              price: 'Rs. 750',
              img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600',
              rating: '4.9'
            },
            {
              name: 'Lahori Kulfi Falooda',
              desc: 'Rich home-made saffron kulfi served with cornstarch vermicelli, sweet rabri milk, and red rose syrup.',
              price: 'Rs. 600',
              img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
              rating: '4.9'
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="glass-card-hover group overflow-hidden border border-white/[0.1] rounded-3xl"
            >
              <div className="relative h-72 overflow-hidden bg-midnight-950">
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-4 right-4 bg-midnight-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-gold-400 flex items-center gap-1.5 border border-white/[0.08] shadow-lg">
                  <Star className="w-4 h-4 fill-gold-400 text-gold-400" /> {item.rating}
                </div>
              </div>
              <div className="p-8 space-y-4 bg-gradient-to-b from-white/[0.02] to-transparent">
                <h3 className="text-2xl font-display font-bold text-white group-hover:text-gold-400 transition-colors duration-300">{item.name}</h3>
                <p className="text-sm text-midnight-200 line-clamp-3 leading-relaxed">{item.desc}</p>
                <div className="flex justify-between items-center pt-4 border-t border-white/[0.05]">
                  <span className="text-xl font-accent font-bold text-gold-400">{item.price}</span>
                  <Link to="/menu" className="text-xs font-bold uppercase tracking-wider text-white inline-flex items-center gap-1.5 group/btn hover:text-gold-400 transition-colors duration-300">
                    Order Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Features */}
      <section className="bg-gradient-to-b from-midnight-900 via-midnight-950 to-[#03000a] border-y border-white/[0.08] relative">
        <div className="absolute inset-0 bg-gold-400/[0.01] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 md:grid-cols-3 gap-16 text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-5 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-400 mb-2 shadow-gold/10">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">Real-Time Statuses</h3>
            <p className="text-sm text-midnight-200 max-w-xs leading-relaxed">
              Watch your meals travel from the hot kitchen to your doorstep with our automated WebSockets system.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-5 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-400 mb-2 shadow-gold/10">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">Desi Customizations</h3>
            <p className="text-sm text-midnight-200 max-w-xs leading-relaxed">
              Personalize spice levels, select ghee options, and custom-order sides built directly to your Lahori taste.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-5 flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-400 mb-2 shadow-gold/10">
              <Star className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-display font-bold text-white">Shahi E-Booking</h3>
            <p className="text-sm text-midnight-200 max-w-xs leading-relaxed">
              Book tables online. Automated reservation tracking verifies seating capacities for hassle-free slots.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
