import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, MessageCircle, CalendarCheck, CheckCircle2 } from 'lucide-react';
import { formatTZS } from '../data/mockData';

export default function VendorCard({ shop }) {
  const navigate = useNavigate();
  const rating = parseFloat(shop.rating_avg) || 0;
  const isTopRated = rating >= 4.7;
  const isOpen = getOpenStatus(shop.operating_hours);

  return (
    <div className="card-hover overflow-hidden group">
      {/* Header with image */}
      <div className="relative h-32 bg-gradient-to-br from-primary-100 to-fresh-100 dark:from-primary-900 dark:to-fresh-900 overflow-hidden">
        {shop.photos && shop.photos[0] ? (
          <img
            src={shop.photos[0]}
            alt={shop.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">🧺</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg text-xs font-bold text-slate-800 dark:text-white">
            <Star size={11} className="text-accent-500 fill-accent-500" />
            {rating.toFixed(1)}
          </span>
          {isTopRated && (
            <span className="badge-green text-[10px]">Top Rated</span>
          )}
        </div>

        {/* Availability badge */}
        <div className="absolute top-2.5 right-2.5">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm ${
            isOpen
              ? 'bg-fresh-500/90 text-white'
              : 'bg-slate-500/80 text-white'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOpen ? 'bg-white animate-pulse-soft' : 'bg-slate-300'}`} />
            {isOpen ? 'Open Now' : 'Closed'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate flex items-center gap-1.5">
              {shop.name}
              {shop.is_approved && (
                <CheckCircle2 size={13} className="text-primary-500 flex-shrink-0" />
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5 truncate">
              <MapPin size={11} /> {shop.address || shop.region}
            </p>
          </div>
          <span className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0 mt-0.5">
            <Clock size={11} /> {shop.operating_hours?.days || 'Mon-Sat'}
          </span>
        </div>

        {/* Services with TSH prices */}
        {shop.services && shop.services.length > 0 && (
          <div className="flex gap-1.5 mt-3 overflow-x-auto no-scrollbar -mx-0.5 px-0.5">
            {getTopServices(shop.services).map((svc, i) => (
              <span
                key={i}
                className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] font-medium text-slate-600 dark:text-slate-300"
              >
                <span>{svc.icon}</span>
                {svc.label} — <span className="font-bold text-primary-600 dark:text-primary-400 text-price">{formatTZS(svc.price)}</span>
              </span>
            ))}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-400">
          <span>{shop.total_orders || 0} orders</span>
          <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
          <span>{shop.total_reviews || 0} reviews</span>
          {shop.min_price && (
            <>
              <span className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full" />
              <span className="font-bold text-primary-600 dark:text-primary-400 text-price">From {formatTZS(shop.min_price)}</span>
            </>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2 mt-3.5">
          <button
            onClick={() => navigate(`/shop/${shop.id}`)}
            className="flex-1 py-2.5 bg-primary-600 dark:bg-primary-500 text-white text-xs font-bold rounded-xl hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-1.5"
          >
            <CalendarCheck size={14} />
            Book Now
          </button>
          <button
            onClick={() => navigate(`/shop/${shop.id}`)}
            className="py-2.5 px-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-1.5"
          >
            <MessageCircle size={14} />
            Chat
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────
const SERVICE_ICONS = {
  wash_only: '🫧',
  wash_iron: '✨',
  iron_only: '♨️',
  dry_clean: '🧼',
  special: '💎',
};

const SERVICE_LABELS = {
  wash_only: 'Wash',
  wash_iron: 'Wash+Iron',
  iron_only: 'Iron',
  dry_clean: 'Dry Clean',
  special: 'Special',
};

function getTopServices(services) {
  const seen = new Set();
  const top = [];
  for (const svc of services) {
    if (!seen.has(svc.service_type) && top.length < 3) {
      seen.add(svc.service_type);
      top.push({
        icon: SERVICE_ICONS[svc.service_type] || '👕',
        label: SERVICE_LABELS[svc.service_type] || svc.service_type,
        price: svc.price,
      });
    }
  }
  return top;
}

function getOpenStatus(hours) {
  if (!hours) return true;
  try {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const [openH, openM] = (hours.open || '07:00').split(':').map(Number);
    const [closeH, closeM] = (hours.close || '20:00').split(':').map(Number);
    const nowMins = currentHour * 60 + currentMin;
    const openMins = openH * 60 + (openM || 0);
    const closeMins = closeH * 60 + (closeM || 0);
    return nowMins >= openMins && nowMins <= closeMins;
  } catch {
    return true;
  }
}
