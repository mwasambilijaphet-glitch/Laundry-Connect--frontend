import { useState, useEffect } from 'react';
import { apiOwnerGetOrders, apiOwnerUpdateOrderStatus } from '../../api/client';
import { formatTZS, getStatusInfo, getClothingLabel, getClothingIcon, getServiceLabel, ORDER_STATUSES } from '../../data/mockData';
import { Loader2, Phone, ChevronDown, Check, CheckCircle2, X, MapPin } from 'lucide-react';

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'placed', label: '📋 New' },
  { value: 'confirmed', label: '✅ Confirmed' },
  { value: 'picked_up', label: '🚗 Picked Up' },
  { value: 'washing', label: '🫧 Washing' },
  { value: 'ready', label: '✨ Ready' },
  { value: 'out_for_delivery', label: '🛵 Delivering' },
  { value: 'delivered', label: '🎉 Delivered' },
];

const NEXT_STATUS = {
  placed: 'confirmed',
  confirmed: 'picked_up',
  picked_up: 'washing',
  washing: 'ready',
  ready: 'out_for_delivery',
  out_for_delivery: 'delivered',
};

export default function OwnerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiOwnerGetOrders(filter || undefined);
      setOrders(data.orders);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdating(orderId);
      await apiOwnerUpdateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) { alert('Failed to update: ' + err.message); }
    finally { setUpdating(null); }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Orders</h1>
        <p className="text-slate-500 text-sm">Manage incoming and active orders</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-6 px-6">
        {STATUS_FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.value ? 'bg-primary-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="text-primary-500 animate-spin" /></div>
      ) : orders.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">📭</p>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No orders found</h3>
          <p className="text-slate-500 text-sm">{filter ? 'Try a different filter' : 'Orders will appear here when customers place them'}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} updating={updating === order.id} onUpdateStatus={handleUpdateStatus} />
          ))}
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, updating, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = getStatusInfo(order.status);
  const nextStatus = NEXT_STATUS[order.status];
  const nextStatusInfo = nextStatus ? getStatusInfo(nextStatus) : null;
  const isNew = order.status === 'placed';

  const badgeClass = {
    blue: 'badge-blue', amber: 'badge-amber', green: 'badge-green', red: 'badge-red', gray: 'badge-gray',
  }[statusInfo.color] || 'badge-gray';

  return (
    <div className={`card overflow-hidden ${isNew ? 'ring-2 ring-amber-300' : ''}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left">
        <div className="flex gap-0.5">
          {order.items?.slice(0, 3).map((item, i) => (
            <span key={i} className="text-lg">{getClothingIcon(item.clothing_type)}</span>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-slate-800">{order.order_number}</p>
            {isNew && <span className="badge-amber text-[10px]">NEW</span>}
          </div>
          <p className="text-xs text-slate-500">{order.customer_name || 'Customer'} • {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-price">{formatTZS(order.total_amount)}</p>
          <span className={`${badgeClass} text-[10px]`}>{statusInfo.icon} {statusInfo.label}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="border-t border-slate-100 animate-slide-up">
          <div className="p-4 space-y-2">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">
                  {getClothingIcon(item.clothing_type)} {getClothingLabel(item.clothing_type)} — {getServiceLabel(item.service_type)} × {item.quantity}
                </span>
                <span className="font-semibold text-price">{formatTZS(item.total_price)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-bold">
              <span>Total</span>
              <span className="text-primary-600 text-price">{formatTZS(order.total_amount)}</span>
            </div>
          </div>

          {/* Order Progress Steps */}
          <div className="px-4 pb-3">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Progress</p>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {ORDER_STATUSES.map((s, i) => {
                const ci = ORDER_STATUSES.findIndex(st => st.id === order.status);
                const isPast = i <= ci;
                const isCurrent = i === ci;
                return (
                  <div key={s.id} className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap flex-shrink-0 border ${
                    isCurrent ? 'bg-primary-600 text-white border-primary-600' : isPast ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}>
                    {isPast && !isCurrent ? <CheckCircle2 size={10} /> : <span>{s.icon}</span>}
                    {s.label}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-4 pb-3 flex items-center gap-4 text-xs text-slate-500">
            {order.delivery_address && (
              <span className="flex items-center gap-1"><MapPin size={12} /> {order.delivery_address}</span>
            )}
            {order.customer_phone && (
              <a href={`tel:${order.customer_phone}`} className="flex items-center gap-1 text-primary-600 font-medium">
                <Phone size={12} /> {order.customer_phone}
              </a>
            )}
          </div>

          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              {isNew && (
                <button onClick={() => onUpdateStatus(order.id, 'cancelled')} disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm">
                  <X size={16} /> Decline
                </button>
              )}
              {nextStatus && (
                <button onClick={() => onUpdateStatus(order.id, nextStatus)} disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors text-sm">
                  {updating ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> {isNew ? 'Accept Order' : `Mark as ${nextStatusInfo?.label}`}</>}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}