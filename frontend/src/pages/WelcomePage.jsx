import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, ArrowRight, Shield, Truck, Smartphone, Star, Clock, Sun, Moon, Zap, Users, MapPin } from 'lucide-react';
import { ScrollReveal } from '../hooks/useScrollReveal';
import Footer from '../components/Footer';

function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration]);

  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function WelcomePage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex flex-col overflow-hidden">
      {/* Theme toggle */}
      <div className="absolute top-12 right-6 z-20">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
        >
          {isDark ? <Sun size={18} className="text-accent-400" /> : <Moon size={18} className="text-white" />}
        </button>
      </div>

      {/* Animated decorative orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-6 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float" />
        <div className="absolute top-32 right-4 w-28 h-28 bg-fresh-400/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-16 w-48 h-48 bg-accent-400/8 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-64 right-10 w-24 h-24 bg-white/5 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/20 dark:bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Logo & brand */}
        <div className="mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white dark:bg-slate-800 rounded-3xl shadow-elevated mb-5 animate-bounce-in">
            <Sparkles className="w-10 h-10 text-primary-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-display">
            Laundry<span className="text-fresh-400">Connect</span>
          </h1>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full">
            <Star size={12} className="text-accent-400 fill-accent-400" />
            <span className="text-xs text-white/80 font-medium">Tanzania's #1 Laundry App</span>
          </div>
        </div>

        {/* Tagline with text reveal animation */}
        <div className="animate-slide-up mb-12">
          <p className="text-2xl text-white font-semibold leading-snug mb-3">
            Fresh laundry,<br />delivered to your door.
          </p>
          <p className="text-primary-200/90 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Connect with trusted local laundry shops. Quality care, fair prices, right from your phone.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {[
            { icon: Shield, label: 'Verified Shops' },
            { icon: Smartphone, label: 'M-Pesa Pay' },
            { icon: Truck, label: 'Door Delivery' },
            { icon: Clock, label: 'Track Live' },
          ].map(({ icon: Icon, label }, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/15 magnetic-hover"
            >
              <Icon size={16} className="text-fresh-400" />
              <span className="text-sm text-white font-medium">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="w-full max-w-sm space-y-3 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <button
            onClick={() => navigate('/auth')}
            className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-accent-400 text-primary-700 dark:text-slate-900 font-bold text-lg rounded-2xl shadow-elevated hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
          >
            Anza Sasa — Get Started
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-3 text-white/80 hover:text-white font-medium transition-colors duration-300"
          >
            Tayari una akaunti? <span className="underline underline-offset-4 decoration-white/40 hover:decoration-white/80 font-semibold">Ingia</span>
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-10 flex items-center gap-6 text-white/40 text-xs animate-fade-in" style={{ animationDelay: '600ms' }}>
          <span className="flex items-center gap-1"><Shield size={12} /> Secure</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>500+ Orders</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>5 Cities</span>
        </div>
      </div>

      {/* Stats section — scroll reveal */}
      <div className="relative bg-white/5 dark:bg-white/[0.02] backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <ScrollReveal>
            <h2 className="text-center text-xs font-bold uppercase tracking-widest text-white/40 mb-8">
              Our Capabilities
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 99.9, suffix: '%', label: 'Uptime Reliability', icon: Zap },
              { value: 500, suffix: '+', label: 'Orders Completed', icon: Star },
              { value: 5, suffix: '', label: 'Cities Covered', icon: MapPin },
              { value: 200, suffix: '+', label: 'Happy Customers', icon: Users },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center">
                  <stat.icon size={20} className="text-accent-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white text-price">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-white/50 mt-1">{stat.label}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Capabilities section */}
      <div className="relative bg-gradient-to-b from-primary-800/50 to-primary-900/80 dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-accent-400/10 border border-accent-400/20 rounded-full text-accent-400 text-xs font-bold uppercase tracking-widest mb-4">
                Our Capabilities
              </span>
              <h2 className="text-3xl font-bold text-white font-display mb-3">
                Powerful tools for <span className="text-accent-400">modern laundry</span>
              </h2>
              <p className="text-primary-200/70 dark:text-slate-400 max-w-md mx-auto">
                Everything you need to manage your laundry with enterprise-grade reliability.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Smartphone, title: 'Mobile Payments', desc: 'M-Pesa, Airtel Money, Tigo Pesa, Card & QR payments. Only 0.5% platform fee.', color: 'text-primary-400' },
              { icon: Truck, title: 'Door-to-Door', desc: 'Pickup and delivery tracking in real-time. Know exactly where your clothes are.', color: 'text-fresh-400' },
              { icon: Shield, title: 'Verified & Secure', desc: 'All shops are verified. Your payments are encrypted and secure via Snippe.', color: 'text-accent-400' },
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 magnetic-hover">
                  <feature.icon size={28} className={`${feature.color} mb-4`} />
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
