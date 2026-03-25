import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { apiGetShops } from '../api/client';
import { SERVICE_TYPES, formatTZS } from '../data/mockData';
import StarRating from '../components/StarRating';
import { ScrollReveal } from '../hooks/useScrollReveal';
import {
  Search, MapPin, Clock, ChevronRight, ShoppingBag, TrendingUp,
  Loader2, Star, Sun, Moon, Navigation, Phone, Gift, Percent,
  Sparkles, Shield, Truck, MessageCircle, Zap
} from 'lucide-react';
import { LogoIcon } from '../components/Logo';
import CitySwitcher from '../components/CitySwitcher';
import VendorCard from '../components/VendorCard';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Habari za asubuhi';
  if (hour < 17) return 'Habari za mchana';
  return 'Habari za jioni';
}

// ── Nearby Dry Cleaners Hook (Overpass API) ────────────────
function useNearbyPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userPos, setUserPos] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude });
        try {
          const query = `
            [out:json][timeout:15];
            (
              node["shop"="laundry"](around:5000,${latitude},${longitude});
              node["shop"="dry_cleaning"](around:5000,${latitude},${longitude});
              node["amenity"="laundry"](around:5000,${latitude},${longitude});
              way["shop"="laundry"](around:5000,${latitude},${longitude});
              way["shop"="dry_cleaning"](around:5000,${latitude},${longitude});
            );
            out center body;
          `;
          const res = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
          if (res.ok) {
            const data = await res.json();
            const results = data.elements
              .map(el => {
                const lat = el.lat || el.center?.lat;
                const lng = el.lon || el.center?.lon;
                if (!lat || !lng) return null;
                const tags = el.tags || {};
                const R = 6371000;
                const dLat = ((lat - latitude) * Math.PI) / 180;
                const dLon = ((lng - longitude) * Math.PI) / 180;
                const a = Math.sin(dLat / 2) ** 2 + Math.cos(latitude * Math.PI / 180) * Math.cos(lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
                const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                return {
                  id: el.id,
                  name: tags.name || tags['name:en'] || 'Dry Cleaner',
                  lat, lng, distance,
                  phone: tags.phone || tags['contact:phone'] || null,
                  address: tags['addr:street'] ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}`.trim() : null,
                  opening_hours: tags.opening_hours || null,
                };
              })
              .filter(Boolean)
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 6);
            setPlaces(results);
          }
        } catch (err) {
          console.error('Nearby search error:', err);
        } finally {
          setLoading(false);
        }
      },
      () => setLoading(false),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }, []);

  return { places, loading, userPos };
}

function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

// ── Promotional Banners ────────────────────────────────────
const PROMOS = [
  { id: 1, title: 'First Order Free Delivery!', desc: 'Use code KARIBU for free delivery on your first order', icon: Gift, color: 'from-violet-500 to-purple-600', textColor: 'text-violet-100' },
  { id: 2, title: '20% Off Dry Cleaning', desc: 'Premium dry cleaning at amazing prices this week', icon: Percent, color: 'from-accent-500 to-orange-600', textColor: 'text-orange-100' },
  { id: 3, title: 'Same-Day Service', desc: 'Get your clothes washed & delivered within 6 hours', icon: Zap, color: 'from-fresh-500 to-emerald-600', textColor: 'text-emerald-100' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [search, setSearch] = useState('');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { places: nearbyPlaces, loading: nearbyLoading } = useNearbyPlaces();

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

  const featuredShops = shops.filter(s => parseFloat(s.rating_avg) >= 4.7);
  const topRated = [...shops].sort((a, b) => parseFloat(b.rating_avg) - parseFloat(a.rating_avg));

  return (
    <div className="animate-fade-in">
      {/* Header with gradient */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 pt-12 pb-7 px-6 rounded-b-[28px] relative overflow-hidden">
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
              onClick={() => navigate('/chats')}
              className="w-11 h-11 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 active:scale-90"
            >
              <MessageCircle size={20} className="text-white" />
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

        {/* Promotional banners */}
        <ScrollReveal>
          <div className="flex gap-4 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
            {PROMOS.map(promo => (
              <button
                key={promo.id}
                onClick={() => navigate('/shops')}
                className="flex-shrink-0 w-72 p-4 rounded-2xl bg-gradient-to-br shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-0.5 text-left"
                style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
              >
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${promo.color}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <promo.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{promo.title}</h3>
                      <p className={`text-xs ${promo.textColor} mt-1 leading-relaxed`}>{promo.desc}</p>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* ═══════ NEARBY DRY CLEANERS ═══════ */}
        <ScrollReveal>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="section-title">
                <Navigation size={16} className="text-fresh-500" /> Nearby Dry Cleaners
              </h2>
              <button
                onClick={() => navigate('/nearby')}
                className="text-sm text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all duration-300"
              >
                View map <ChevronRight size={14} />
              </button>
            </div>

            {nearbyLoading ? (
              <div className="flex items-center gap-3 py-6 justify-center">
                <Loader2 size={18} className="text-primary-500 animate-spin" />
                <p className="text-sm text-slate-400">Finding dry cleaners near you...</p>
              </div>
            ) : nearbyPlaces.length === 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-center">
                <MapPin size={24} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <p className="text-sm text-slate-500 dark:text-slate-400">No dry cleaners found nearby</p>
                <button
                  onClick={() => navigate('/nearby')}
                  className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                >
                  Search a wider area
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {nearbyPlaces.map(place => (
                  <div key={place.id} className="card-hover flex items-center gap-3.5 p-3.5">
                    <div className="w-12 h-12 bg-fresh-50 dark:bg-fresh-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🧺</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">{place.name}</h3>
                      {place.address && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                          <MapPin size={10} /> {place.address}
                        </p>
                      )}
                      {place.opening_hours && (
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Clock size={10} /> {place.opening_hours}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                        {formatDistance(place.distance)}
                      </span>
                      <div className="flex gap-1.5">
                        {place.phone && (
                          <a
                            href={`tel:${place.phone}`}
                            className="w-8 h-8 bg-fresh-50 dark:bg-fresh-900/30 rounded-lg flex items-center justify-center hover:bg-fresh-100 transition-colors"
                            onClick={e => e.stopPropagation()}
                          >
                            <Phone size={14} className="text-fresh-600 dark:text-fresh-400" />
                          </a>
                        )}
                        <a
                          href={`https://www.openstreetmap.org/directions?to=${place.lat},${place.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center hover:bg-primary-100 transition-colors"
                          onClick={e => e.stopPropagation()}
                        >
                          <Navigation size={14} className="text-primary-600 dark:text-primary-400" />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollReveal>

        {/* Why Choose Us — trust builders */}
        <ScrollReveal>
          <div>
            <h2 className="section-title mb-4">
              <Sparkles size={16} className="text-accent-500" /> Kwa Nini Sisi — Why Us
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, label: 'Verified Shops', desc: 'All shops verified & trusted', color: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' },
                { icon: Truck, label: 'Door Delivery', desc: 'Pickup & deliver to your door', color: 'bg-fresh-50 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400' },
                { icon: MessageCircle, label: 'Live Chat', desc: 'Chat with shop owners', color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400' },
                { icon: Zap, label: 'Fast Service', desc: 'Same-day wash available', color: 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' },
              ].map(({ icon: Icon, label, desc, color }, i) => (
                <div key={i} className="card p-3.5 flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} flex-shrink-0`}>
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-white">{label}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* ═══════ CITY SWITCHER ═══════ */}
        <CitySwitcher onCityChange={(cityId) => {
          navigate(`/shops?city=${cityId}`);
        }} />

        {/* ═══════ TOP VENDORS ═══════ */}
        {!loading && topRated.length > 0 && !search && (
          <ScrollReveal>
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-title">
                  <Star size={16} className="text-accent-500" /> Wachuuzi Bora — Top Vendors
                </h2>
                <button
                  onClick={() => navigate('/shops')}
                  className="text-sm text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all duration-300"
                >
                  All <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 stagger-children">
                {topRated.slice(0, 3).map(shop => (
                  <VendorCard key={shop.id} shop={shop} />
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

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
                      <LogoIcon size={18} /> Bora Zaidi
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
