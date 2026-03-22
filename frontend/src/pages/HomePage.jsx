import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { apiGetShops } from '../api/client';
import { SERVICE_TYPES, formatTZS } from '../data/mockData';
import StarRating from '../components/StarRating';
import { ScrollReveal } from '../hooks/useScrollReveal';
import { Search, MapPin, Clock, ChevronRight, ShoppingBag, Sparkles, TrendingUp, Loader2, Star, Sun, Moon } from 'lucide-react';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Habari za asubuhi';
  if (hour < 17) return 'Habari za mchana';
  return 'Habari za jioni';
}

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (!search) {
      setSearchResults(null);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const data = await apiGetShops({ search });
        setSearchResults(data.shops);
      } catch (err) {
        console.error(err);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const displayShops = searchResults !== null ? searchResults : shops;
  const featuredShops = shops.filter(s => parseFloat(s.rating_avg) >= 4.7);
  const topRated = [...shops].sort((a, b) => parseFloat(b.rating_avg) - parseFloat(a.rating_avg));

  return (
    <div className="animate-fade-in">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 pt-12 pb-7 px-6 rounded-b-[28px] relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-fresh-500/10 rounded-full blur-xl" />

        <div className="relative flex items-center justify-between mb-5">
          <div>
            <p className="text-primary-200 dark:text-slate-400 text-sm font-medium">{getGreeting()}</p>
            <h1 className="text-xl font-bold text-white font-display mt-0.5">
              {user?.full_name?.split(' ')[0] || 'Guest'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 active:scale-90"
            >
              {isDark ? <Sun size={18} className="text-accent-400" /> : <Moon size={18} className="text-white" />}
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="relative w-11 h-11 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 active:scale-90"
            >
              <ShoppingBag size={20} className="text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-in ring-2 ring-primary-600 dark:ring-slate-800">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Tafuta duka la dobi... (Search shops)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-glass focus:outline-none focus:ring-2 focus:ring-white/50 dark:focus:ring-primary-500/50 transition-all duration-300"
          />
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Quick services */}
        <ScrollReveal>
          <div>
            <h2 className="section-title mb-4">Huduma — Services</h2>
            <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 stagger-children">
              {SERVICE_TYPES.map(service => (
                <button
                  key={service.id}
                  onClick={() => navigate('/shops')}
                  className="flex-shrink-0 flex flex-col items-center gap-2.5 w-[72px] group"
                >
                  <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-card flex items-center justify-center text-2xl group-hover:shadow-card-hover group-hover:-translate-y-1 transition-all duration-300 group-active:scale-90">
                    {service.icon}
                  </div>
                  <span className="text-[11px] text-slate-600 dark:text-slate-400 font-medium text-center leading-tight">{service.label}</span>
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-primary-100 dark:border-primary-800 border-t-primary-500 rounded-full animate-spin" />
            </div>
            <p className="text-sm text-slate-400">Finding shops near you...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>
        )}

        {/* Search results */}
        {search && searchResults !== null && (
          <div>
            <h2 className="section-title mb-4">
              <Search size={18} className="text-slate-400" /> Results for "{search}"
            </h2>
            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-slate-500 dark:text-slate-400 text-sm">No shops found. Try a different search.</p>
              </div>
            ) : (
              <div className="space-y-3 stagger-children">
                {searchResults.map(shop => (
                  <ShopCard key={shop.id} shop={shop} onClick={() => navigate(`/shop/${shop.id}`)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Featured & all shops */}
        {!search && !loading && (
          <>
            {featuredShops.length > 0 && (
              <ScrollReveal>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="section-title">
                      <Sparkles size={18} className="text-accent-500" /> Bora Zaidi
                    </h2>
                    <button onClick={() => navigate('/shops')} className="text-sm text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all duration-300">
                      View all <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2 stagger-children">
                    {featuredShops.map(shop => (
                      <FeaturedShopCard key={shop.id} shop={shop} onClick={() => navigate(`/shop/${shop.id}`)} />
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="section-title">
                    <TrendingUp size={18} className="text-fresh-500" /> Maduka Yote
                  </h2>
                </div>
                <div className="space-y-3 stagger-children">
                  {topRated.map(shop => (
                    <ShopCard key={shop.id} shop={shop} onClick={() => navigate(`/shop/${shop.id}`)} />
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </div>
  );
}

function FeaturedShopCard({ shop, onClick }) {
  return (
    <button onClick={onClick} className="flex-shrink-0 w-64 card-hover overflow-hidden text-left group">
      <div className="h-36 bg-gradient-to-br from-primary-100 to-fresh-100 dark:from-primary-900 dark:to-fresh-900 relative overflow-hidden">
        {shop.photos && shop.photos[0] && (
          <img src={shop.photos[0]} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-800 dark:text-white">
            <Star size={10} className="text-accent-500 fill-accent-500" />
            {parseFloat(shop.rating_avg).toFixed(1)}
          </span>
        </div>
      </div>
      <div className="p-3.5">
        <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">{shop.name}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
          <MapPin size={11} /> {shop.region}
        </p>
        <div className="flex items-center justify-between mt-2.5">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={11} /> {shop.operating_hours?.days || 'Mon-Sat'}
          </span>
          {shop.min_price && (
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 text-price">
              From {formatTZS(shop.min_price)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function ShopCard({ shop, onClick }) {
  return (
    <button onClick={onClick} className="card-hover w-full flex gap-3.5 p-3.5 text-left group">
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-fresh-100 dark:from-primary-900 dark:to-fresh-900 overflow-hidden flex-shrink-0">
        {shop.photos && shop.photos[0] ? (
          <img src={shop.photos[0]} alt={shop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl bg-gradient-to-br from-primary-50 to-fresh-50 dark:from-primary-900 dark:to-fresh-900">🧺</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">{shop.name}</h3>
          {parseFloat(shop.rating_avg) >= 4.7 && (
            <span className="badge-green text-[10px] flex-shrink-0 ml-2">Top</span>
          )}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
          <MapPin size={11} /> {shop.address}
        </p>
        <div className="flex items-center gap-3 mt-1.5">
          <StarRating rating={parseFloat(shop.rating_avg)} size={12} />
          <span className="text-xs text-slate-400">({shop.total_reviews})</span>
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-slate-400">{shop.total_orders} orders</span>
          {shop.min_price && (
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400 text-price">
              From {formatTZS(shop.min_price)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
