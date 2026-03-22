import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetOrder } from '../api/client';
import { ORDER_STATUSES, formatTZS, getClothingLabel, getClothingIcon, getServiceLabel, getStatusInfo } from '../data/mockData';
import { ArrowLeft, Phone, MessageCircle, MapPin, Loader2, CheckCircle2 } from 'lucide-react';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const data = await apiGetOrder(id);
        setOrder(data.order);
      } catch (err) {
        setError('Order not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 border-3 border-primary-100 border-t-primary-500 rounded-full animate-spin" />
        <p className="text-sm text-slate-400">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Order not found</h2>
        <button onClick={() => navigate('/orders')} className="btn-primary mt-4">View All Orders</button>
      </div>
    );
  }

  const currentStatusIndex = ORDER_STATUSES.findIndex(s => s.id === order.status);
  const statusInfo = getStatusInfo(order.status);
  const isDelivered = order.status === 'delivered';

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      {/* Header */}
      <div className={`pt-12 pb-6 px-6 rounded-b-[28px] relative overflow-hidden ${
        isDelivered
          ? 'bg-gradient-to-br from-fresh-600 to-fresh-700'
          : 'bg-gradient-to-br from-primary-600 to-primary-700'
      }`}>
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-white/5 rounded-full" />

        <div className="relative flex items-center gap-3 mb-5">
          <button onClick={() => navigate('/orders')} className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white hover:bg-white/20 transition-all duration-300">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white font-display">Order {order.order_number}</h1>
            <p className="text-white/60 text-xs">
              {new Date(order.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-4 border border-white/10">
          <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center text-3xl">
            {statusInfo.icon}
          </div>
          <div>
            <p className="text-white/60 text-xs font-medium">Current Status</p>
            <p className="text-white font-bold text-lg">{statusInfo.label}</p>
            {order.status === 'washing' && (
              <p className="text-white/50 text-xs mt-0.5">Your clothes are being cleaned right now</p>
            )}
            {isDelivered && (
              <p className="text-fresh-200 text-xs mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={12} /> Completed successfully
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-4 stagger-children">
        {/* Status Timeline */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-800 mb-5">Maendeleo — Progress</h2>
          <div className="space-y-0">
            {ORDER_STATUSES.map((status, index) => {
              const isCurrent = status.id === order.status;
              const isPast = index < currentStatusIndex;
              const isFuture = index > currentStatusIndex;

              return (
                <div key={status.id} className="flex gap-3.5">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm flex-shrink-0 transition-all duration-500 ${
                      isCurrent
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100 shadow-glow-primary scale-110'
                        : isPast
                          ? 'bg-fresh-500 text-white'
                          : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isPast ? <CheckCircle2 size={16} /> : <span>{status.icon}</span>}
                    </div>
                    {index < ORDER_STATUSES.length - 1 && (
                      <div className={`w-0.5 h-9 rounded-full transition-all duration-500 ${
                        isPast ? 'bg-fresh-300' : isCurrent ? 'bg-primary-200' : 'bg-slate-200'
                      }`} />
                    )}
                  </div>
                  <div className="pb-5 pt-1.5">
                    <p className={`text-sm font-semibold transition-all duration-300 ${
                      isCurrent ? 'text-primary-600' : isPast ? 'text-slate-700' : 'text-slate-400'
                    }`}>
                      {status.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shop info */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Duka — Shop</h2>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-fresh-50 rounded-2xl flex items-center justify-center text-xl">🧺</div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-slate-800">{order.shop_name}</p>
              <p className="text-xs text-slate-500">{order.shop_address}</p>
            </div>
            <div className="flex gap-2">
              <a href={`tel:${order.shop_phone}`} className="w-10 h-10 bg-fresh-50 rounded-xl flex items-center justify-center text-fresh-600 hover:bg-fresh-100 transition-colors duration-200 active:scale-90">
                <Phone size={16} />
              </a>
              <button className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 hover:bg-primary-100 transition-colors duration-200 active:scale-90">
                <MessageCircle size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Order items */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Vitu — Items</h2>
          <div className="space-y-2.5">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{getClothingIcon(item.clothing_type)}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{getClothingLabel(item.clothing_type)}</p>
                    <p className="text-xs text-slate-400">{getServiceLabel(item.service_type)} x {item.quantity}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-slate-800 text-price">{formatTZS(item.total_price)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-100 mt-3 pt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-price">{formatTZS(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Delivery</span>
              <span className="text-price">{formatTZS(order.delivery_fee)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-slate-100">
              <span className="text-slate-800">Total</span>
              <span className="text-primary-600 text-price text-lg">{formatTZS(order.total_amount)}</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        {order.delivery_address && (
          <div className="card p-4">
            <h2 className="font-semibold text-slate-800 mb-2.5 flex items-center gap-2">
              <MapPin size={16} className="text-primary-600" /> Delivery Address
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">{order.delivery_address}</p>
          </div>
        )}

        {/* Payment info */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Payment Status</p>
              <p className="font-semibold text-sm text-slate-800 capitalize mt-0.5">{order.payment_status}</p>
            </div>
            <span className={`badge ${order.payment_status === 'paid' ? 'badge-green' : 'badge-amber'}`}>
              {order.payment_status === 'paid' ? '✓ Paid' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
