import { MapPin, Phone, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-600/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-fresh-600/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-6 pt-12 pb-8">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold font-display mb-3">
              Laundry<span className="text-fresh-400">Connect</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Tanzania's premier laundry marketplace. Connecting you with trusted local laundry shops for quality care at fair prices.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs text-slate-300">
                <span className="w-2 h-2 bg-fresh-400 rounded-full animate-pulse" />
                Available Now
              </span>
            </div>
          </div>

          {/* Office */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Office</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-slate-300">
                <MapPin size={16} className="text-primary-400 mt-0.5 flex-shrink-0" />
                <span>
                  Mwanza Avenue, Near Iyumbu Junction<br />
                  Dodoma, Tanzania
                </span>
              </li>
              <li>
                <a href="tel:+255768188065" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                  <Phone size={16} className="text-primary-400 flex-shrink-0" />
                  +255 768 188 065
                </a>
              </li>
              <li>
                <a href="mailto:support@laundryconnect.co.tz" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                  <Mail size={16} className="text-primary-400 flex-shrink-0" />
                  support@laundryconnect.co.tz
                </a>
              </li>
              <li>
                <a href="https://wa.me/255768188065" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-slate-300 hover:text-white transition-colors">
                  <MessageCircle size={16} className="text-fresh-400 flex-shrink-0" />
                  WhatsApp — Tupige Story!
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Pricing', href: '#' },
                { label: 'Privacy Policy', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Contact Us', href: '#' },
                { label: 'Help Center', href: '#' },
              ].map(link => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 group">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            &copy; {currentYear} Laundry Connect. Designed & Built in Dodoma, Tanzania.
          </p>
          <div className="flex items-center gap-6 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors uppercase tracking-wider font-medium">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors uppercase tracking-wider font-medium">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors uppercase tracking-wider font-medium">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
