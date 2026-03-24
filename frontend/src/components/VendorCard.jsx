import { useNavigate } from 'react-router-dom';
import { MapPin, Star, MessageCircle, ShoppingBag } from 'lucide-react';

const BADGE_STYLES = {
  available: { bg: '#D1FAE5', color: '#065F46', label: '✓ Available tonight' },
  sameday: { bg: '#DBEAFE', color: '#1E40AF', label: 'Same-day delivery' },
  delayed: { bg: '#FEF3C7', color: '#92400E', label: '⏰ Available in 2 days' },
  unavailable: { bg: '#FEE2E2', color: '#7F1D1D', label: '❌ Not available' },
};

function formatPrice(amount) {
  return `${amount.toLocaleString()} TSH`;
}

export default function VendorCard({ vendor, onChat, onBook }) {
  const navigate = useNavigate();

  // Derive top services (up to 3) for display
  const topServices = (vendor.services || []).slice(0, 3);

  // Determine badges
  const badges = [];
  if (vendor.availableTonight !== false) badges.push('available');
  if (vendor.sameDayDelivery) badges.push('sameday');

  // Calculate distance display
  const distanceText = vendor.distance
    ? vendor.distance < 1
      ? `${(vendor.distance * 1000).toFixed(0)}m away`
      : `${vendor.distance.toFixed(1)}km away`
    : null;

  // Primary service type
  const primaryService = vendor.primaryService || (topServices[0]?.service_type || '');

  function handleChat(e) {
    e.stopPropagation();
    if (onChat) onChat(vendor);
    else if (vendor.chatId) navigate(`/chat/${vendor.chatId}`);
  }

  function handleBook(e) {
    e.stopPropagation();
    if (onBook) onBook(vendor);
    else navigate(`/shop/${vendor.id}`);
  }

  return (
    <div
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-3 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer"
      style={{ boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)' }}
      onClick={() => navigate(`/shop/${vendor.id}`)}
    >
      {/* Header: Name + Rating */}
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-bold font-display text-slate-800 dark:text-white truncate pr-2">
          {vendor.name}
        </h3>
        <span
          className="flex items-center gap-1 px-2 py-1 rounded text-sm font-semibold flex-shrink-0"
          style={{ background: '#FFFBEB', color: '#FFD60A' }}
        >
          <Star size={12} className="fill-current" />
          {parseFloat(vendor.rating_avg || 0).toFixed(1)}
        </span>
      </div>

      {/* Distance + Type */}
      <div className="flex items-center gap-2 text-[13px] text-slate-500 dark:text-slate-400 mb-3">
        {distanceText && (
          <>
            <span className="flex items-center gap-1">
              <MapPin size={12} /> {distanceText}
            </span>
            <span>•</span>
          </>
        )}
        {vendor.region && (
          <>
            <span>{vendor.region}</span>
            {primaryService && <span>•</span>}
          </>
        )}
        {primaryService && <span className="capitalize">{primaryService.replace(/_/g, ' ')}</span>}
      </div>

      {/* Services */}
      {topServices.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-md p-2.5 mb-3 space-y-1.5">
          {topServices.map((svc, i) => {
            const label = svc.clothing_type
              ? `${svc.clothing_type.charAt(0).toUpperCase() + svc.clothing_type.slice(1)} — ${(svc.service_type || '').replace(/_/g, ' ')}`
              : svc.label || svc.name || 'Service';
            return (
              <div key={i} className="flex items-center justify-between text-[13px]">
                <span className="text-slate-700 dark:text-slate-300">{label}</span>
                <span className="font-bold font-display" style={{ color: '#0052CC' }}>
                  {formatPrice(svc.price)}
                  {svc.unit === 'kg' ? '/kg' : ''}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Availability Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {badges.map(key => {
            const badge = BADGE_STYLES[key];
            if (!badge) return null;
            return (
              <span
                key={key}
                className="text-xs font-medium px-2.5 py-1.5 rounded"
                style={{ background: badge.bg, color: badge.color }}
              >
                {badge.label}
              </span>
            );
          })}
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleChat}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[13px] font-semibold border transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-700 min-h-[44px]"
          style={{ borderColor: '#0052CC', color: '#0052CC' }}
        >
          <MessageCircle size={14} /> Chat
        </button>
        <button
          onClick={handleBook}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-md text-[13px] font-semibold text-white border-none transition-all duration-300 min-h-[44px]"
          style={{ background: '#0052CC' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#003d99'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0052CC'; }}
        >
          <ShoppingBag size={14} /> Book Now
        </button>
      </div>
    </div>
  );
}
