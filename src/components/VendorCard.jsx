import { useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, MessageCircle, Package, CheckCircle2, Truck, AlertCircle, HeartHandshake } from 'lucide-react';
import { formatTZS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';
import { apiStartConversation, apiSendMessage } from '../api/client';

export default function VendorCard({ shop }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const rating = parseFloat(shop.rating_avg) || 0;
  const isOpen = getOpenStatus(shop.operating_hours);

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
      onClick={() => navigate(`/shop/${shop.id}`)}
    >
      {/* Vendor header: name + rating */}
      <div className="flex items-start justify-between mb-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-base text-slate-800 dark:text-white truncate flex items-center gap-1.5 font-display">
            {shop.name}
            {shop.is_approved && (
              <CheckCircle2 size={14} className="text-primary-500 flex-shrink-0" />
            )}
          </h3>
          <p className="text-[13px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
            <MapPin size={12} />
            <span>{shop.address || shop.region}</span>
            {shop.total_reviews > 0 && (
              <>
                <span className="text-slate-300 dark:text-slate-600">|</span>
                <span>{shop.total_orders} orders</span>
              </>
            )}
          </p>
        </div>
        {rating > 0 && (
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/30 rounded flex-shrink-0 ml-2">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-amber-700 dark:text-amber-400 tabular-nums">{rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Services with TSH prices */}
      {shop.services && shop.services.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-md p-3 mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">Services</p>
          <div className="space-y-1.5">
            {getTopServices(shop.services).map((svc, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[13px] text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="text-sm">{svc.icon}</span>
                  {svc.label}
                </span>
                <span className="text-[13px] font-bold text-primary-600 dark:text-primary-400 text-price tabular-nums">
                  {formatTZS(svc.price)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        {isOpen ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded">
            <CheckCircle2 size={11} /> Available tonight
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs font-medium rounded">
            <AlertCircle size={11} /> Opens tomorrow
          </span>
        )}
        {shop.delivery_zones && shop.delivery_zones.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-medium rounded">
            <Truck size={11} /> Delivery available
          </span>
        )}
        {shop.min_price && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded text-price">
            {t('startingFrom', formatTZS(shop.min_price))}
          </span>
        )}
      </div>

      {/* CTA buttons */}
      <div className="flex gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={async () => {
            try {
              const data = await apiStartConversation(shop.id);
              const msg = t('negotiateGreeting', shop.name);
              await apiSendMessage(data.conversation.id, msg);
              navigate(`/chat/${data.conversation.id}`);
            } catch (err) {
              navigate(`/shop/${shop.id}`);
            }
          }}
          className="flex-1 py-2.5 bg-white dark:bg-slate-700 border border-accent-500 text-accent-600 dark:text-accent-400 text-[13px] font-bold rounded-md hover:bg-accent-50 dark:hover:bg-accent-900/30 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <HeartHandshake size={14} />
          {t('negotiatePrice')}
        </button>
        <button
          onClick={() => navigate(`/shop/${shop.id}`)}
          className="flex-1 py-2.5 bg-primary-600 dark:bg-primary-500 text-white text-[13px] font-bold rounded-md hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-300 active:scale-[0.97] flex items-center justify-center gap-1.5 min-h-[44px]"
        >
          <Package size={14} />
          {t('bookNow')}
        </button>
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
  wash_only: 'Wash Only',
  wash_iron: 'Wash & Iron',
  iron_only: 'Iron & Press',
  dry_clean: 'Dry Cleaning',
  special: 'Special Care',
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
