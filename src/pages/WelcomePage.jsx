import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  ArrowRight, Shield, Truck, Smartphone, Star, Clock, Sun, Moon,
  Zap, Users, MapPin, ChevronRight, Building2, Globe, CheckCircle2,
  MessageCircle, CreditCard, Package, Heart, Phone, Sparkles,
  Timer, BadgeCheck, TrendingUp, Banknote, UserPlus, Search, ShoppingBag
} from 'lucide-react';
import { LogoIcon, LogoFull } from '../components/Logo';
import { ScrollReveal } from '../hooks/useScrollReveal';
import LanguageToggle from '../components/LanguageToggle';
import Footer from '../components/Footer';

// ── Stats counter ─────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
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
      }
    }, { threshold: 0.3 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Testimonial data ──────────────────────────────────────
const TESTIMONIALS = [
  {
    name: 'Amina Hassan',
    role: 'Customer, Dar es Salaam',
    text: 'Nimepata duka la dobi bora karibu na nyumbani. Nguo zangu zinapikwa vizuri na kupelekwa mlangoni. Rahisi sana!',
    rating: 5,
    avatar: 'AH',
  },
  {
    name: 'Joseph Mwakasege',
    role: 'Shop Owner, Dodoma',
    text: 'Tangu nijisajili LaundryConnect, wateja wangu wameongezeka mara tatu. Mfumo wa malipo ni rahisi na salama.',
    rating: 5,
    avatar: 'JM',
  },
  {
    name: 'Fatma Kibwana',
    role: 'Customer, Arusha',
    text: 'Napenda sana kupata SMS kila hatua ya oda yangu. Ninalipa kwa M-Pesa au taslimu — rahisi!',
    rating: 5,
    avatar: 'FK',
  },
];

// ── Main WelcomePage ───────────────────────────────────────
export default function WelcomePage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          NAVBAR — Clean, minimal, Snippe-style
         ══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoIcon size={32} />
            <span className="text-lg font-bold text-slate-800 dark:text-white font-display">
              Laundry<span className="text-fresh-500">Connect</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors font-medium">{t('howItWorks')}</a>
            <a href="#features" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors font-medium">{t('whyLaundryConnect')}</a>
            <a href="#testimonials" className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors font-medium">{t('testimonialsNav')}</a>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle variant="header" />
            <button
              onClick={toggleTheme}
              className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-slate-500" />}
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="hidden sm:flex px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all active:scale-95"
            >
              {t('getStarted')}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════
          HERO — Big, clean, confident
         ══════════════════════════════════════════════════════ */}
      <section className="relative bg-gradient-to-b from-white via-primary-50/30 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 dark:bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-fresh-200/30 dark:bg-fresh-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 rounded-full mb-8">
              <Sparkles size={14} className="text-primary-600 dark:text-primary-400" />
              <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">{t('heroTagline')}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={50}>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display leading-[1.1] mb-6">
              {t('heroMainTitle')}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
              {t('heroMainDesc')}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={150}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button
                onClick={() => navigate('/auth')}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
              >
                {t('getStarted')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-lg rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
              >
                {t('signIn')}
              </button>
            </div>
          </ScrollReveal>

          {/* Trust bar */}
          <ScrollReveal delay={200}>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 dark:text-slate-500">
              <span className="flex items-center gap-1.5"><Shield size={14} className="text-primary-500" /> {t('securePayments')}</span>
              <span className="hidden sm:block w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
              <span className="flex items-center gap-1.5"><BadgeCheck size={14} className="text-fresh-500" /> {t('verifiedShops')}</span>
              <span className="hidden sm:block w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
              <span className="flex items-center gap-1.5"><MapPin size={14} className="text-amber-500" /> {t('threeRegions')}</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS BAR — Social proof numbers
         ══════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 dark:bg-slate-800/50 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 500, suffix: '+', label: t('ordersCompleted'), icon: Package },
              { value: 200, suffix: '+', label: t('happyCustomers'), icon: Users },
              { value: 3, suffix: '', label: t('citiesCovered'), icon: MapPin },
              { value: 99.9, suffix: '%', label: t('uptimeReliability'), icon: Zap },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl mb-3">
                  <stat.icon size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <p className="text-3xl font-bold text-slate-900 dark:text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-slate-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS — 3 simple steps (Snippe-style)
         ══════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-4">
                {t('howItWorksTitle')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-lg">
                {t('howItWorksDesc')}
              </p>
            </div>
          </ScrollReveal>

          {/* Customer steps */}
          <ScrollReveal delay={50}>
            <p className="text-xs font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-6 text-center">{t('forCustomers')}</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { step: '01', icon: Search, title: t('step1Title'), desc: t('step1Desc'), color: 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' },
              { step: '02', icon: ShoppingBag, title: t('step2Title'), desc: t('step2Desc'), color: 'bg-fresh-50 dark:bg-fresh-900/20 text-fresh-600 dark:text-fresh-400' },
              { step: '03', icon: Truck, title: t('step3Title'), desc: t('step3Desc'), color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${item.color} rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Shop owner steps */}
          <ScrollReveal delay={50}>
            <p className="text-xs font-bold uppercase tracking-widest text-fresh-600 dark:text-fresh-400 mb-6 text-center">{t('forShopOwners')}</p>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: UserPlus, title: t('ownerStep1Title'), desc: t('ownerStep1Desc'), color: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400' },
              { step: '02', icon: BadgeCheck, title: t('ownerStep2Title'), desc: t('ownerStep2Desc'), color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
              { step: '03', icon: TrendingUp, title: t('ownerStep3Title'), desc: t('ownerStep3Desc'), color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center group">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${item.color} rounded-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    <item.icon size={28} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FEATURES GRID — Snippe-style feature cards
         ══════════════════════════════════════════════════════ */}
      <section id="features" className="bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center mb-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-4">
                {t('featuresTitle')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-lg">
                {t('featuresDesc')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {[
              { icon: Smartphone, title: t('featureMpesa'), desc: t('featureMpesaDesc'), color: 'text-primary-600 dark:text-primary-400' },
              { icon: Shield, title: t('featureVerified'), desc: t('featureVerifiedDesc'), color: 'text-fresh-600 dark:text-fresh-400' },
              { icon: Banknote, title: t('featureCash'), desc: t('featureCashDesc'), color: 'text-amber-600 dark:text-amber-400' },
              { icon: Clock, title: t('featureTracking'), desc: t('featureTrackingDesc'), color: 'text-blue-600 dark:text-blue-400' },
              { icon: MessageCircle, title: t('featureWhatsApp'), desc: t('featureWhatsAppDesc'), color: 'text-green-600 dark:text-green-400' },
              { icon: Star, title: t('featureReviews'), desc: t('featureReviewsDesc'), color: 'text-purple-600 dark:text-purple-400' },
            ].map((feature, i) => (
              <ScrollReveal key={i} delay={i * 80}>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-lg transition-all duration-300 h-full">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-slate-50 dark:bg-slate-700/50 rounded-xl mb-4`}>
                    <feature.icon size={22} className={feature.color} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PAYMENT METHODS — Trust signal
         ══════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-6 py-14 text-center">
          <ScrollReveal>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-8">{t('paymentPartnersTitle')}</h3>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[
                { name: 'M-Pesa', color: 'text-green-600 dark:text-green-400' },
                { name: 'Airtel Money', color: 'text-red-500 dark:text-red-400' },
                { name: 'Tigo Pesa', color: 'text-blue-600 dark:text-blue-400' },
                { name: 'Halopesa', color: 'text-orange-500 dark:text-orange-400' },
                { name: 'Visa / Card', color: 'text-indigo-600 dark:text-indigo-400' },
                { name: 'Cash', color: 'text-slate-600 dark:text-slate-400' },
              ].map((method, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CreditCard size={18} className={method.color} />
                  <span className={`text-sm font-semibold ${method.color}`}>{method.name}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-6">{t('poweredBySnipe')}</p>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS — Social proof
         ══════════════════════════════════════════════════════ */}
      <section id="testimonials" className="bg-slate-50 dark:bg-slate-800/30">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-4">
                {t('testimonialsTitle')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-lg">
                {t('testimonialsDesc')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: item.rating }).map((_, j) => (
                      <Star key={j} size={16} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-1 mb-5">"{item.text}"</p>
                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-fresh-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{item.avatar}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{item.name}</p>
                      <p className="text-xs text-slate-400">{item.role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CITIES — Where we operate
         ══════════════════════════════════════════════════════ */}
      <section className="bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-fresh-50 dark:bg-fresh-900/20 border border-fresh-100 dark:border-fresh-800 rounded-full text-fresh-600 dark:text-fresh-400 text-xs font-bold uppercase tracking-widest mb-4">
                <MapPin size={12} /> {t('nationwideCoverage')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white font-display mb-4">
                {t('availableInCities', 3)}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                {t('citiesDescShort')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Dar es Salaam', icon: '🌊', population: '5.4M', region: t('eastern'), desc: t('darDesc'), color: 'from-primary-500 to-primary-600' },
              { name: 'Arusha', icon: '🏔️', population: '615K', region: t('northern'), desc: t('arushaDesc'), color: 'from-green-500 to-emerald-500' },
              { name: 'Dodoma', icon: '🏛️', population: '410K', region: t('central'), desc: t('dodomaDesc'), color: 'from-amber-500 to-orange-500' },
            ].map((city, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 hover:shadow-lg transition-all duration-300 group">
                  <div className={`w-14 h-14 bg-gradient-to-br ${city.color} rounded-2xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    {city.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{city.name}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-semibold text-slate-400">{city.region}</span>
                    <span className="text-xs text-slate-300 dark:text-slate-600">|</span>
                    <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">{city.population}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{city.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={200}>
            <div className="text-center mt-8">
              <p className="text-sm text-slate-400 dark:text-slate-500">{t('moreCitiesSoon')}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA — Big, clean call to action
         ══════════════════════════════════════════════════════ */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-slate-800 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-60 h-60 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-fresh-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <LogoIcon size={40} />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mb-4">
              {t('ctaTitle')}
            </h2>
            <p className="text-lg text-white/70 max-w-lg mx-auto mb-10 leading-relaxed">
              {t('ctaDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigate('/auth')}
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white dark:bg-accent-400 text-primary-700 dark:text-slate-900 font-bold text-lg rounded-2xl shadow-elevated hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97]"
              >
                {t('getStartedFree')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://wa.me/255768188065"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-2xl border border-white/20 hover:bg-white/20 transition-all"
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
            </div>
            <p className="text-sm text-white/40 mt-8">{t('ctaFootnote')}</p>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
