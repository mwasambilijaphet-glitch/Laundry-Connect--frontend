import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { apiGetShops } from '../api/client';
import { formatTZS } from '../data/mockData';
import { DEMO_SHOPS } from '../data/demoData';
import StarRating from '../components/StarRating';
import CitySwitcher from '../components/CitySwitcher';
import VendorCard from '../components/VendorCard';
import LanguageToggle from '../components/LanguageToggle';
import AreaPicker from '../components/AreaPicker';
import { ScrollReveal } from '../hooks/useScrollReveal';
import {
  Search, MapPin, Clock, ChevronRight, SlidersHorizontal,
  Star, Sun, Moon, Loader2, Phone, MessageSquare
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroBanner, setHeroBanner] = useState(0);
  const [selectedArea, setSelectedArea] = useState(() => {
    try {
      const saved = localStorage.getItem('lc_area');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  function handleAreaSelect(area) {
    setSelectedArea(area);
    if (!area.useGPS) {
      localStorage.setItem('lc_area', JSON.stringify(area));
    }
    // Re-fetch shops for the selected area
    fetchShopsForArea(area);
  }

  async function fetchShopsForArea(area) {
    try {
      setLoading(true);
      const params = {};
      if (area && !area.useGPS) {
        params.search = area.wardName;
        if (area.cityId) params.city = area.cityId;
      }
      const data = await apiGetShops(params);
      setShops(data.shops || []);
      setError('');
    } catch (err) {
      console.error(err);
      setShops(DEMO_SHOPS);
      setError('');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    async function fetchShops() {
      try {
        setLoading(true);
        const params = {};
        if (search) {
          params.search = search;
        } else if (selectedArea && !selectedArea.useGPS) {
          params.search = selectedArea.wardName;
          if (selectedArea.cityId) params.city = selectedArea.cityId;
        }
        const data = await apiGetShops(params);
        setShops(data.shops || []);
        setError('');
      } catch (err) {
        console.error(err);
        setShops(DEMO_SHOPS);
        setError('');
      } finally {
        setLoading(false);
      }
    }
    fetchShops();
  }, []);

  // Search with debounce
  const [searchResults, setSearchResults] = useState(null);
  useEffect(() => {
    if (!search) { setSearchResults(null); return; }
    const timer = setTimeout(async () => {
      try {
        const data = await apiGetShops({ search });
        setSearchResults(data.shops);
      } catch (err) { console.error(err); }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const HERO_BANNERS = useHeroBanners();

  // Auto-rotate hero banners
  useEffect(() => {
    const timer = setInterval(() => setHeroBanner(h => (h + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  const topRated = [...shops].sort((a, b) => parseFloat(b.rating_avg) - parseFloat(a.rating_avg));

  return (
    <div className="animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      {/* ── Top bar: greeting + actions ── */}
      <div className="px-5 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {new Date().getHours() < 12 ? t('goodMorning') : new Date().getHours() < 17 ? t('goodAfternoon') : t('goodEvening')}
            </p>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">
              {user?.full_name?.split(' ')[0] || t('welcome')}
            </h1>
          </div>
          <div className="flex items-center gap-1.5">
            <LanguageToggle variant="icon" />
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-xs font-bold">
                {user?.full_name?.[0]?.toUpperCase() || 'U'}
              </div>
            </button>
          </div>
        </div>
        <div className="mt-2">
          <AreaPicker onSelect={handleAreaSelect} currentArea={selectedArea} compact />
        </div>
      </div>

      {/* ── Hero banner carousel ── */}
      <div className="px-5 mb-5">
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 dark:bg-slate-800 min-h-[160px]">
          {HERO_BANNERS.map((banner, i) => (
            <div
              key={i}
              className={`absolute inset-0 p-6 flex flex-col justify-center transition-opacity duration-500 ${
                heroBanner === i ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                      <span className="text-lg">{banner.icon}</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-white font-display leading-tight mb-1">
                    {banner.title}
                  </h2>
                  <p className="text-white/60 text-sm mb-4">{banner.subtitle}</p>
                  <button
                    onClick={() => navigate('/shops')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-bold rounded-full hover:bg-primary-700 transition-colors active:scale-95"
                  >
                    {t('bookNow')}
                  </button>
                </div>
                <span className="text-5xl ml-4 opacity-80">{banner.emoji}</span>
              </div>
            </div>
          ))}
          {/* Dot indicators */}
          <div className="absolute bottom-3 left-6 flex gap-1.5">
            {HERO_BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroBanner(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  heroBanner === i ? 'w-6 bg-primary-500' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="px-5 mb-5">
        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>
      </div>

      {/* ── Search results ── */}
      {search && searchResults !== null && (
        <div className="px-5 mb-5">
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3">
            {t('resultsFor', search)}
          </h2>
          {searchResults.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-sm">{t('noShopsFound')}</p>
          ) : (
            <div className="space-y-3">
              {searchResults.map(shop => (
                <ShopListItem key={shop.id} shop={shop} onClick={() => navigate(`/shop/${shop.id}`)} t={t} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Main content (when not searching) ── */}
      {!search && (
        <div className="px-5 space-y-6 pb-6">

          {/* Laundry shops close to you */}
          <ScrollReveal>
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-white mb-3">
                {t('shopsCloseToYou')}
              </h2>

              {loading ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <Loader2 size={24} className="text-primary-500 animate-spin" />
                  <p className="text-sm text-slate-400">{t('findingShops')}</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">{error}</div>
              ) : topRated.length === 0 ? (
                <div className="text-center py-10">
                  <span className="text-4xl block mb-3">🧺</span>
                  <p className="text-slate-400 text-sm">{t('noShopsInArea')}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topRated.slice(0, 5).map(shop => (
                    <ShopListItem key={shop.id} shop={shop} onClick={() => navigate(`/shop/${shop.id}`)} t={t} />
                  ))}
                  {topRated.length > 5 && (
                    <button
                      onClick={() => navigate('/shops')}
                      className="w-full py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center gap-1"
                    >
                      {t('viewAllShops', topRated.length)} <ChevronRight size={14} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* City Switcher */}
          <CitySwitcher />

          {/* Top Vendors (VendorCard style) */}
          {!loading && topRated.length > 0 && (
            <ScrollReveal>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Star size={16} className="text-amber-500" /> {t('topRatedVendors')}
                  </h2>
                  <button
                    onClick={() => navigate('/shops')}
                    className="text-sm text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-0.5"
                  >
                    {t('all')} <ChevronRight size={14} />
                  </button>
                </div>
                <div className="space-y-3">
                  {topRated.slice(0, 3).map(shop => (
                    <VendorCard key={shop.id} shop={shop} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          )}
        </div>
      )}
    </div>
  );
}

// ── Hero banner data ──────────────────────────────────────
function useHeroBanners() {
  const { t } = useLanguage();
  return [
    { title: t('heroBanner1Title'), subtitle: t('heroBanner1Subtitle'), icon: '🧺', emoji: '👔' },
    { title: t('heroBanner2Title'), subtitle: t('heroBanner2Subtitle'), icon: '🚀', emoji: '🛵' },
    { title: t('heroBanner3Title'), subtitle: t('heroBanner3Subtitle'), icon: '💎', emoji: '✨' },
  ];
}

// ── Shop list item (Tim Designer style) ───────────────────
function ShopListItem({ shop, onClick, t }) {
  const rating = parseFloat(shop.rating_avg) || 0;
  const hours = shop.operating_hours;
  const hoursText = hours ? `Open ${hours.open || '8am'} - ${hours.close || '8pm'}` : 'Open 8am - 8pm';

  return (
    <button
      onClick={onClick}
      className="w-full flex gap-3.5 p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
    >
      {/* Photo */}
      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 dark:bg-slate-700">
        {shop.photos && shop.photos[0] ? (
          <img src={shop.photos[0]} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-fresh-100 dark:from-primary-900/40 dark:to-fresh-900/40">
              <span className="text-2xl font-bold text-primary-600/40 dark:text-primary-400/40">{shop.name?.[0] || 'L'}</span>
            </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 py-0.5">
        <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">{shop.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1 truncate">
          <MapPin size={11} className="text-primary-600 flex-shrink-0" />
          {shop.address || shop.region}
        </p>
        <div className="flex items-center gap-1 mt-1.5">
          <StarRating rating={rating} size={11} showNumber={false} />
          <span className="text-xs text-slate-500 ml-0.5">{rating.toFixed(1)}</span>
        </div>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-1 font-medium">{hoursText}</p>
        {shop.phone && (
          <div className="flex items-center gap-2 mt-2">
            <a href={`tel:${shop.phone}`} onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 px-2.5 py-1 bg-fresh-50 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400 rounded-lg text-xs font-semibold hover:bg-fresh-100 transition-colors">
              <Phone size={10} /> {t ? t('call') : 'Call'}
            </a>
            <a href={`sms:${shop.phone}`} onClick={e => e.stopPropagation()} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-semibold hover:bg-primary-100 transition-colors">
              <MessageSquare size={10} /> {t ? t('sms') : 'SMS'}
            </a>
          </div>
        )}
      </div>
    </button>
  );
}
