import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetOrder } from '../api/client';
import { ORDER_STATUSES, formatTZS, getClothingLabel, getClothingIcon, getServiceLabel, getStatusInfo } from '../data/mockData';
import { getDemoOrder } from '../data/demoData';
import { ArrowLeft, Star, MapPin, Loader2, CheckCircle2, Truck, Home } from 'lucide-react';

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
        console.error(err);
        const demoOrder = getDemoOrder(id);
        if (demoOrder) {
          setOrder(demoOrder);
        } else {
          setError('Order not found');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900">
        <Loader2 size={28} className="text-primary-500 animate-spin" />
        <p className="text-sm text-slate-400">Loading order...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white dark:bg-slate-900">
        <div className="text-5xl mb-4">📦</div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Order not found</h2>
        <button onClick={() => navigate('/orders')} className="btn-primary mt-4">View All Orders</button>
      </div>
    );
  }

  const currentStatusIndex = ORDER_STATUSES.findIndex(s => s.id === order.status);
  const statusInfo = getStatusInfo(order.status);
  const isDelivered = order.status === 'delivered';
  const shopRating = parseFloat(order.shop_rating) || 4.5;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 pt-12 pb-4">
        <button
          onClick={() => navigate('/orders')}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-slate-800 dark:text-white">Order Details</h1>
      </div>

      <div className="px-5 pb-8 space-y-5">
        {/* Order ID + Status */}
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-bold text-primary-700 dark:text-primary-400">
              Order ID: {order.order_number}
            </p>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              isDelivered
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
            }`}>
              {statusInfo.label}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {new Date(order.created_at).toLocaleDateString('en-GB', {
              weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
            })}
          </p>
        </div>

        {/* Progress Timeline */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Order Progress</h2>
          <div className="flex items-center gap-1">
            {ORDER_STATUSES.map((status, index) => {
              const isPast = index <= currentStatusIndex;
              return (
                <div key={status.id} className="flex-1 flex flex-col items-center gap-1.5">
                  <div className={`w-full h-1.5 rounded-full transition-all duration-500 ${
                    isPast ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'
                  }`} />
                  <span className={`text-[10px] font-medium text-center leading-tight ${
                    isPast ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'
                  }`}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shop info */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            🧺
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-slate-800 dark:text-white truncate">{order.shop_name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-primary-600 flex-shrink-0" />
              <span className="truncate">{order.shop_address || 'Dar es Salaam'}</span>
            </p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg flex-shrink-0">
            <Star size={12} className="text-amber-500 fill-amber-500" />
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{shopRating.toFixed(1)}</span>
          </div>
        </div>

        {/* Items table */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-3">Items</h2>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-2.5 bg-slate-100 dark:bg-slate-700/50 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              <span>Item</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Price</span>
            </div>
            {/* Table rows */}
            {order.items?.map((item, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-3 items-center ${
                  i < order.items.length - 1 ? 'border-b border-slate-100 dark:border-slate-700/50' : ''
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{getClothingIcon(item.clothing_type)}</span>
                  <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{getClothingLabel(item.clothing_type)}</p>
                    <p className="text-[11px] text-slate-400">{getServiceLabel(item.service_type)}</p>
                  </div>
                </div>
                <span className="text-sm text-slate-600 dark:text-slate-300 text-center tabular-nums min-w-[32px]">
                  x{item.quantity}
                </span>
                <span className="text-sm font-semibold text-slate-800 dark:text-white text-right tabular-nums text-price">
                  {formatTZS(item.total_price)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Price breakdown */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Sub Total</span>
            <span className="text-slate-700 dark:text-slate-200 font-medium tabular-nums text-price">{formatTZS(order.subtotal || order.total_amount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Delivery</span>
            <span className="text-slate-700 dark:text-slate-200 font-medium tabular-nums text-price">{formatTZS(order.delivery_fee || 0)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Discount</span>
              <span className="text-green-600 dark:text-green-400 font-medium tabular-nums text-price">-{formatTZS(order.discount)}</span>
            </div>
          )}
          <div className="border-t border-slate-200 dark:border-slate-600 pt-2.5 flex justify-between">
            <span className="text-sm font-bold text-slate-800 dark:text-white">Total</span>
            <span className="text-base font-bold text-primary-600 dark:text-primary-400 tabular-nums text-price">{formatTZS(order.total_amount)}</span>
          </div>
        </div>

        {/* Delivery address */}
        {order.delivery_address && (
          <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin size={16} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">Delivery Address</p>
              <p className="text-sm text-slate-700 dark:text-slate-200">{order.delivery_address}</p>
            </div>
          </div>
        )}

        {/* Payment badge */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
          <div>
            <p className="text-xs text-slate-400 font-medium">Payment</p>
            <p className="text-sm font-semibold text-slate-800 dark:text-white capitalize mt-0.5">{order.payment_status}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
            order.payment_status === 'paid'
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
          }`}>
            {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
          </span>
        </div>

        {/* Track Rider button */}
        {!isDelivered && order.status !== 'pending' && (
          <button
            onClick={() => navigate(`/orders/${id}/track`)}
            className="w-full py-4 bg-primary-600 dark:bg-primary-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Truck size={18} />
            Track Rider
          </button>
        )}

        {/* Back to Home */}
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center gap-1.5"
        >
          <Home size={14} />
          Back to Home
        </button>
      </div>
    </div>
  );
}
