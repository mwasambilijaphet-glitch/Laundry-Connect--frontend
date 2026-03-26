import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { apiGetShops } from '../api/client';
import { formatTZS } from '../data/mockData';
import StarRating from '../components/StarRating';
import CitySwitcher from '../components/CitySwitcher';
import VendorCard from '../components/VendorCard';
import { ScrollReveal } from '../hooks/useScrollReveal';
import {
  Search, MapPin, Clock, ChevronRight, SlidersHorizontal,
  Star, Sun, Moon, Loader2
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroBanner, setHeroBanner] = useState(0);

  useEffect(() => {
    async function fetchShops() {
      try {
        setLoading(true);
        const data = await apiGetShops({ search: search || undefined });
        setShops(data.shops);
        setError('');
      } catch (err) {
        setError('Failed to load shops');
        console.error(err);
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

  // Auto-rotate hero banners
  useEffect(() => {
    const timer = setInterval(() => setHeroBanner(h => (h + 1) % HERO_BANNERS.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const topRated = [...shops].sort((a, b) => parseFloat(b.rating_avg) - parseFloat(a.rating_avg));

  return (
    <div className="animate-fade-in bg-white dark:bg-slate-900 min-h-screen">
      {/* ── Top bar: location + theme toggle ── */}
      <div className="flex items-center justify-between px-5 pt-12 pb-3">
        <button className="flex items-center gap-1.5 text-sm font-semibold text-slate-800 dark:text-white">
          <MapPin size={16} className="text-primary-600" />
          <span>Select location</span>
          <ChevronRight size={14} className="text-slate-400 rotate-90" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            onClick={() => navigate('/shops')}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <SlidersHorizontal size={18} />
          </button>
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
                    Book now
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
            placeholder="Search laundry shops..."
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
            Results for "{search}"
          </h2>
          {searchResults.length === 0 ? (
            <p className="text-center py-8 text-slate-400 text-sm">No shops found.</p>
          ) : (
            <div className="space-y-3">
              {searchResults.map(shop => (
                <ShopListItem key={shop.id} shop={shop} onClick={() => navigate(`/shop/${shop.id}`)} />
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
                Laundry shops close to you
              </h2>

              {loading ? (
                <div className="flex flex-col items-center py-10 gap-3">
                  <Loader2 size={24} className="text-primary-500 animate-spin" />
                  <p className="text-sm text-slate-400">Finding shops near you...</p>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400 text-sm">{error}</div>
              ) : topRated.length === 0 ? (
                <div className="text-center py-10">
                  <span className="text-4xl block mb-3">🧺</span>
                  <p className="text-slate-400 text-sm">No shops found in your area yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {topRated.slice(0, 5).map(shop => (
                    <ShopListItem key={shop.id} shop={shop} onClick={() => navigate(`/shop/${shop.id}`)} />
                  ))}
                  {topRated.length > 5 && (
                    <button
                      onClick={() => navigate('/shops')}
                      className="w-full py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center gap-1"
                    >
                      View all {topRated.length} shops <ChevronRight size={14} />
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
                    <Star size={16} className="text-amber-500" /> Top rated vendors
                  </h2>
                  <button
                    onClick={() => navigate('/shops')}
                    className="text-sm text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-0.5"
                  >
                    All <ChevronRight size={14} />
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
const HERO_BANNERS = [
  { title: 'Your Clothes, Our Care!', subtitle: 'Drop your clothes, we handle the rest.', icon: '🧺', emoji: '👔' },
  { title: 'Same-Day Delivery', subtitle: 'Get your clothes back within 6 hours.', icon: '🚀', emoji: '🛵' },
  { title: '20% Off This Week', subtitle: 'Premium dry cleaning at amazing prices.', icon: '💎', emoji: '✨' },
];

// ── Shop list item (Tim Designer style) ───────────────────
function ShopListItem({ shop, onClick }) {
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
          <div className="w-full h-full flex items-center justify-center text-3xl bg-primary-50 dark:bg-primary-900/30">🧺</div>
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
      </div>

      {/* View details */}
      <div className="flex items-end flex-shrink-0 pb-1">
        <span className="text-xs text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-0.5 whitespace-nowrap">
          View details <ChevronRight size={12} />
        </span>
      </div>
    </button>
  );
}
