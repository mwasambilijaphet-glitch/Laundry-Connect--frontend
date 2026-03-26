import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetShops } from '../api/client';
import { formatTZS } from '../data/mockData';
import { DEMO_SHOPS } from '../data/demoData';
import StarRating from '../components/StarRating';
import { Search, MapPin, Clock, Loader2 } from 'lucide-react';

export default function ShopListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchShops() {
      try {
        setLoading(true);
        const data = await apiGetShops({ search: search || undefined, sort: sortBy });
        setShops(data.shops || []);
      } catch (err) {
        console.error('Failed to load shops:', err);
        setShops(DEMO_SHOPS);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchShops, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, sortBy]);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 pt-12 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-display mb-4">Tafuta Duka — Find Shops</h1>

        <div className="relative mb-3">
          <Search size={18} className="absolute left-4 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or area..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        <div className="flex gap-2">
          {[
            { value: 'rating', label: '⭐ Top Rated' },
            { value: 'price', label: '💰 Cheapest' },
            { value: 'orders', label: '🔥 Popular' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortBy === opt.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="text-primary-500 animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-3">{shops.length} shops found</p>
            <div className="space-y-3">
              {shops.map((shop, i) => (
                <button
                  key={shop.id}
                  onClick={() => navigate(`/shop/${shop.id}`)}
                  className="card-hover w-full flex gap-4 p-4 text-left animate-slide-up"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-primary-100 to-fresh-100 overflow-hidden flex-shrink-0">
                    {shop.photos && shop.photos[0] ? (
                      <img src={shop.photos[0]} alt={shop.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🧺</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-slate-800 truncate">{shop.name}</h3>
                      {parseFloat(shop.rating_avg) >= 4.7 && <span className="badge-green text-[10px] flex-shrink-0">Top ⭐</span>}
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={11} /> {shop.address}
                    </p>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {shop.operating_hours?.open || '07:00'} – {shop.operating_hours?.close || '20:00'} • {shop.operating_hours?.days || 'Mon-Sat'}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <StarRating rating={parseFloat(shop.rating_avg)} size={12} />
                      <span className="text-xs text-slate-400">({shop.total_reviews} reviews)</span>
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-slate-400">{shop.total_orders} orders completed</span>
                      {shop.min_price && (
                        <span className="text-sm font-bold text-primary-600 text-price">
                          {formatTZS(shop.min_price)}+
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
