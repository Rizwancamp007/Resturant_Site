import { motion } from 'framer-motion';
import { Award, ShieldCheck, Heart, Sparkles, MapPin } from 'lucide-react';

export default function About() {
  return (
    <div className="relative overflow-hidden min-h-screen bg-transparent py-16">
      {/* Background decoration */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-gold-400/5 rounded-full filter blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-warm-400/5 rounded-full filter blur-[120px] animate-float [animation-delay:2s]" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-gold-400/10 border border-gold-400/20 rounded-full text-gold-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Sparkles className="w-3.5 h-3.5" /> Our Heritage
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-display font-bold text-white"
          >
            The Story of <span className="gold-text">Lahore Traditional</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-midnight-200 max-w-2xl mx-auto leading-relaxed"
          >
            Rooted in Lahore’s deep culinary legacy, Lahore Traditional marries the imperial spice routes of the Mughals with luxury modern fine-dining hospitality.
          </motion.p>
        </div>

        {/* History Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-display font-bold text-white">An Imperial Legacy Restored</h2>
            <p className="text-sm text-midnight-200 leading-relaxed">
              Founded on the heritage of Lahore’s legendary food streets, Lahore Traditional is a tribute to the royal chefs who served in the courts of the Mughal emperors. We preserve century-old recipes, utilizing authentic copper woks (karahis) and slow wood-fire roasting techniques.
            </p>
            <p className="text-sm text-midnight-200 leading-relaxed">
              Every dish is a sensory masterpiece, crafted with hand-ground spices sourced from the historic spice markets of old Lahore, blended meticulously with modern presentation styles.
            </p>
            <div className="flex gap-4 items-center pt-2">
              <MapPin className="w-5 h-5 text-gold-400" />
              <span className="text-xs font-semibold tracking-wider uppercase text-gold-400">Anarkali Food Street, Anarkali, Lahore, Pakistan</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-96 overflow-hidden rounded-3xl border-2 border-gold-400/30 shadow-gold bg-midnight-950 group"
          >
            <img
              src="src/store/minar-pak.png"
              alt="Minar-e-Pakistan, Lahore"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight-950 via-midnight-950/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-midnight-950/80 backdrop-blur-md border border-white/[0.08] p-4 rounded-2xl">
              <p className="text-xs font-bold text-gold-400">Symbol of Lahore's Pride</p>
              <p className="text-[10px] text-midnight-200">The majestic Minar-e-Pakistan, standing tall in Greater Iqbal Park.</p>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Award,
              title: 'Shahi Standards',
              desc: 'We procure only premium grade cuts of meat and organic seasonal ingredients, prepared under strict hygienic systems.'
            },
            {
              icon: ShieldCheck,
              title: 'Desi Authenticity',
              desc: 'From our hand-churned Desi Ghee to traditional wood-smoked clay tandoors, we do not compromise on heritage.'
            },
            {
              icon: Heart,
              title: 'Lahori Hospitality',
              desc: 'Experience the world-renowned warmth and generosity of Lahore’s cultural hospitality from reservation to plate.'
            }
          ].map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-6 space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-400/10 border border-gold-400/25 flex items-center justify-center text-gold-400">
                <val.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-display font-bold text-white">{val.title}</h3>
              <p className="text-xs text-midnight-200 leading-relaxed">{val.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
