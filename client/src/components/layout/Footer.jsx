import { Link } from 'react-router-dom';
import { UtensilsCrossed, Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative mt-20 border-t border-white/[0.05] bg-midnight-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center">
                <UtensilsCrossed className="w-5 h-5 text-midnight-800" />
              </div>
              <span className="text-xl font-display font-bold gold-text">Lahore Traditional</span>
            </Link>
            <p className="text-sm text-midnight-200 leading-relaxed">
              A traditional Lahori fine-dining experience where heritage culinary artistry meets royal hospitality. Every recipe carries the aroma of old Lahore.
            </p>
            <div className="flex gap-3 mt-6">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-midnight-200 hover:text-gold-400 hover:border-gold-400/30 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-midnight-50 uppercase tracking-wider mb-4">Explore</h4>
            <ul className="space-y-3">
              {[{ to: '/menu', label: 'Our Menu' }, { to: '/reservations', label: 'Reservations' }, { to: '/about', label: 'About Us' }, { to: '/orders', label: 'Track Order' }].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-midnight-200 hover:text-gold-400 transition-colors duration-300">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-sm font-semibold text-midnight-50 uppercase tracking-wider mb-4">Hours</h4>
            <ul className="space-y-3 text-sm text-midnight-200">
              <li className="flex justify-between"><span>Mon - Fri</span><span className="text-midnight-50">11:00 AM - 11:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday</span><span className="text-midnight-50">10:00 AM - 12:00 AM</span></li>
              <li className="flex justify-between"><span>Sunday</span><span className="text-midnight-50">10:00 AM - 11:00 PM</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-midnight-50 uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              {[
                { Icon: MapPin, text: 'Anarkali Food Street, Anarkali, Lahore' },
                { Icon: Phone, text: '+92 42 37321111' },
                { Icon: Mail, text: 'hello@lahoretraditional.pk' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-midnight-200">
                  <item.Icon className="w-4 h-4 mt-0.5 text-gold-400 shrink-0" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-midnight-200">© {new Date().getFullYear()} Lahore Traditional Restaurant. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-midnight-200 hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-midnight-200 hover:text-gold-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
