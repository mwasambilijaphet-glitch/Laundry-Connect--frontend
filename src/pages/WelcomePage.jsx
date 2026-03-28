import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Shield, Truck, Smartphone, Star, Clock, Sun, Moon, Zap, Users, MapPin, ChevronRight, Building2, Globe } from 'lucide-react';
import { LogoIcon, LogoFull } from '../components/Logo';
import { ScrollReveal } from '../hooks/useScrollReveal';
import LanguageToggle from '../components/LanguageToggle';
import Footer from '../components/Footer';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── Major Tanzanian Cities ─────────────────────────────────
const TANZANIAN_CITIES = [
  { id: 'dar', name: 'Dar es Salaam', lat: -6.7924, lng: 39.2083, icon: '🌊', population: '5.4M', desc: 'Commercial capital & largest city. Major business hub on the Indian Ocean coast.', region: 'Eastern', color: 'from-primary-500 to-primary-600' },
  { id: 'arusha', name: 'Arusha', lat: -3.3869, lng: 36.6830, icon: '🏔️', population: '615K', desc: 'Gateway to Kilimanjaro & Serengeti. Tourism capital of East Africa.', region: 'Northern', color: 'from-green-500 to-emerald-500' },
  { id: 'dodoma', name: 'Dodoma', lat: -6.1630, lng: 35.7516, icon: '🏛️', population: '410K', desc: 'Official capital of Tanzania. Growing political & administrative center.', region: 'Central', color: 'from-amber-500 to-orange-500' },
];

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

// ── Interactive Tanzania Map Component ─────────────────────
function TanzaniaMap({ cities, isDark }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    {
      const map = L.map(mapRef.current, {
        center: [-6.0, 34.5],
        zoom: 5.5,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        attributionControl: false,
      });

      const tileUrl = isDark
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      L.tileLayer(tileUrl, {
        maxZoom: 18,
      }).addTo(map);

      // Add attribution manually
      L.control.attribution({ position: 'bottomright', prefix: false })
        .addAttribution('&copy; <a href="https://www.openstreetmap.org">OSM</a> &copy; <a href="https://carto.com">CARTO</a>')
        .addTo(map);

      // Custom icon for city markers
      cities.forEach((city) => {
        const markerHtml = `
          <div style="
            width: 28px; height: 28px;
            background: linear-gradient(135deg, #16a34a, #22c55e);
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
            font-size: 12px; cursor: pointer;
            transition: transform 0.2s;
          " onmouseover="this.style.transform='scale(1.3)'" onmouseout="this.style.transform='scale(1)'">
            <span style="filter: none;">${city.icon}</span>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: '',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -18],
        });

        const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);

        marker.bindPopup(`
          <div style="min-width: 180px; font-family: system-ui, sans-serif;">
            <div style="font-size: 18px; margin-bottom: 4px;">${city.icon}</div>
            <strong style="font-size: 14px; color: #1e293b;">${city.name}</strong>
            <p style="font-size: 11px; color: #64748b; margin: 4px 0; line-height: 1.4;">${city.desc}</p>
            <div style="display: flex; gap: 8px; margin-top: 6px;">
              <span style="font-size: 10px; color: #16a34a; font-weight: 600;">Pop: ${city.population}
              <span style="font-size: 10px; color: #10b981; font-weight: 600;">${city.region}</span>
            </div>
          </div>
        `, { closeButton: false, maxWidth: 220 });
      });

      mapInstanceRef.current = map;
      setLoaded(true);

      // Force resize after render
      setTimeout(() => map.invalidateSize(), 100);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-elevated border border-white/10">
      <div ref={mapRef} style={{ height: '420px', width: '100%' }} />
      {!loaded && (
        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
          <div className="text-center">
            <Globe size={32} className="text-primary-400 mx-auto mb-2 animate-spin" />
            <p className="text-sm text-white/60">Loading map...</p>
          </div>
        </div>
      )}
      {/* Map overlay label */}
      <div className="absolute top-3 left-3 z-[1000] px-3 py-1.5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg shadow-sm">
        <p className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
          <MapPin size={12} className="text-primary-600" />
          {cities.length} Cities Across Tanzania
        </p>
      </div>
    </div>
  );
}

// ── City Card Component ────────────────────────────────────
function CityCard({ city, index }) {
  return (
    <ScrollReveal delay={index * 60}>
      <div className="group p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-white/25 hover:bg-white/10 transition-all duration-300">
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 bg-gradient-to-br ${city.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            {city.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-white text-sm truncate">{city.name}</h4>
              <span className="text-[10px] font-semibold text-white/40 bg-white/5 px-2 py-0.5 rounded-full flex-shrink-0 ml-2">
                {city.population}
              </span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">{city.region} Region</p>
            <p className="text-xs text-white/40 mt-1.5 leading-relaxed line-clamp-2">{city.desc}</p>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}

// ── Main WelcomePage ───────────────────────────────────────
export default function WelcomePage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-6 pt-12 pb-4">
        <LogoFull size="sm" />
        <div className="flex items-center gap-2">
          <LanguageToggle variant="header" />
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
          >
            {isDark ? <Sun size={18} className="text-accent-400" /> : <Moon size={18} className="text-white" />}
          </button>
        </div>
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
        {/* Logo icon — large hero */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/10 dark:bg-white/5 backdrop-blur-md rounded-[28px] shadow-elevated mb-6 animate-bounce-in ring-1 ring-white/20">
            <LogoIcon size={56} />
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tight font-display">
            Laundry<span className="text-fresh-400">Connect</span>
          </h1>
          <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/10">
            <Star size={12} className="text-accent-400 fill-accent-400" />
            <span className="text-xs text-white/80 font-medium">{t('heroTagline')}</span>
          </div>
        </div>

        {/* Tagline */}
        <div className="animate-slide-up mb-8">
          <p className="text-2xl text-white font-semibold leading-snug mb-3">
            {t('heroTitle1')}<br />{t('heroTitle2')}
          </p>
          <p className="text-primary-200/90 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            {t('heroDescription', TANZANIAN_CITIES.length)}
          </p>
        </div>

        {/* City ticker */}
        <div className="animate-slide-up mb-8 w-full max-w-md" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 -mx-6 px-6">
            {TANZANIAN_CITIES.slice(0, 8).map((city, i) => (
              <div
                key={city.id}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-white/8 backdrop-blur-sm rounded-full border border-white/10 text-xs text-white/70 font-medium hover:bg-white/15 transition-all"
              >
                <span>{city.icon}</span> {city.name}
              </div>
            ))}
            <div className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-fresh-500/20 backdrop-blur-sm rounded-full border border-fresh-500/30 text-xs text-fresh-300 font-semibold">
              +{TANZANIAN_CITIES.length - 8} more
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 animate-slide-up" style={{ animationDelay: '200ms' }}>
          {[
            { icon: Shield, label: t('verifiedShops') },
            { icon: Smartphone, label: t('mpesaPay') },
            { icon: Truck, label: t('doorDelivery') },
            { icon: Clock, label: t('trackLive') },
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
            {t('getStarted')}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button
            onClick={() => navigate('/auth')}
            className="w-full py-3 text-white/80 hover:text-white font-medium transition-colors duration-300"
          >
            {t('alreadyHaveAccount')} <span className="underline underline-offset-4 decoration-white/40 hover:decoration-white/80 font-semibold">{t('signIn')}</span>
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex items-center gap-6 text-white/40 text-xs animate-fade-in" style={{ animationDelay: '600ms' }}>
          <span className="flex items-center gap-1"><Shield size={12} /> Secure</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>500+ Orders</span>
          <span className="w-1 h-1 bg-white/20 rounded-full" />
          <span>{TANZANIAN_CITIES.length} Cities</span>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          CITIES WE SERVE — Interactive Map Section
         ════════════════════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-b from-primary-900/80 to-slate-900 dark:from-slate-900 dark:to-slate-950">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-60 h-60 bg-fresh-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <ScrollReveal>
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-fresh-500/10 border border-fresh-500/20 rounded-full text-fresh-400 text-xs font-bold uppercase tracking-widest mb-4">
                <MapPin size={12} /> {t('nationwideCoverage')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-display mb-3">
                {t('availableInCities', TANZANIAN_CITIES.length)}
              </h2>
              <p className="text-white/50 max-w-lg mx-auto leading-relaxed">
                {t('citiesDescription')}
              </p>
            </div>
          </ScrollReveal>

          {/* Interactive Map */}
          <ScrollReveal delay={100}>
            <TanzaniaMap cities={TANZANIAN_CITIES} isDark={isDark} />
          </ScrollReveal>

          {/* City grid */}
          <div className="mt-10">
            <ScrollReveal>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Building2 size={18} className="text-fresh-400" />
                  {t('allCities')}
                </h3>
                <span className="text-xs text-white/40 font-medium">
                  {TANZANIAN_CITIES.length} {t('locations')}
                </span>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TANZANIAN_CITIES.map((city, i) => (
                <CityCard key={city.id} city={city} index={i} />
              ))}
            </div>
          </div>

          {/* CTA below cities */}
          <ScrollReveal delay={200}>
            <div className="mt-12 text-center">
              <div className="inline-flex flex-col items-center gap-4 p-8 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/10">
                <div className="w-16 h-16 bg-gradient-to-br from-fresh-500 to-primary-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <MapPin size={28} className="text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">{t('yourCityYourLaundry')}</h3>
                  <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
                    {t('yourCityDescription')}
                  </p>
                </div>
                <button
                  onClick={() => navigate('/auth')}
                  className="group flex items-center gap-2 px-6 py-3 bg-fresh-500 hover:bg-fresh-600 text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                >
                  {t('findShopsNearYou')}
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Stats section */}
      <div className="relative bg-white/5 dark:bg-white/[0.02] backdrop-blur-sm border-t border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <ScrollReveal>
            <h2 className="text-center text-xs font-bold uppercase tracking-widest text-white/40 mb-8">
              {t('ourImpact')}
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: 99.9, suffix: '%', label: t('uptimeReliability'), icon: Zap },
              { value: 500, suffix: '+', label: t('ordersCompleted'), icon: Star },
              { value: TANZANIAN_CITIES.length, suffix: '', label: t('citiesCovered'), icon: MapPin },
              { value: 200, suffix: '+', label: t('happyCustomers'), icon: Users },
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
                {t('ourCapabilities')}
              </span>
              <h2 className="text-3xl font-bold text-white font-display mb-3">
                {t('capabilitiesTitle')}
              </h2>
              <p className="text-primary-200/70 dark:text-slate-400 max-w-md mx-auto">
                {t('capabilitiesDescription')}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Smartphone, title: t('mobilePayments'), desc: t('mobilePaymentsDesc'), color: 'text-primary-400' },
              { icon: Truck, title: t('doorToDoor'), desc: t('doorToDoorDesc'), color: 'text-fresh-400' },
              { icon: Shield, title: t('verifiedSecure'), desc: t('verifiedSecureDesc'), color: 'text-accent-400' },
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
