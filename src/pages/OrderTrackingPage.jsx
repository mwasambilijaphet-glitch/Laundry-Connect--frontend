import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiGetOrder, apiSubmitReview } from '../api/client';
import { ORDER_STATUSES, formatTZS, getClothingLabel, getClothingIcon, getServiceLabel, getStatusInfo } from '../data/mockData';
import { getDemoOrder } from '../data/demoData';
import { ArrowLeft, Star, MapPin, Loader2, CheckCircle2, Phone, Home, Download, Share2, Copy, MessageCircle } from 'lucide-react';

export default function OrderTrackingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        if (!order) setLoading(true);
        const data = await apiGetOrder(id);
        setOrder(data.order);
      } catch (err) {
        if (!order) {
          console.error(err);
          const demoOrder = getDemoOrder(id);
          if (demoOrder) {
            setOrder(demoOrder);
          } else {
            setError('Order not found');
          }
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
    // Poll for real-time updates every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
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

  function generateReceiptText() {
    const lines = [
      '=== LAUNDRY CONNECT RECEIPT ===',
      '',
      `Order: ${order.order_number}`,
      `Date: ${new Date(order.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}`,
      `Shop: ${order.shop_name}`,
      '',
      '--- Items ---',
      ...(order.items || []).map(item => `${getClothingLabel(item.clothing_type)} (${getServiceLabel(item.service_type)}) x${item.quantity} — ${formatTZS(item.total_price)}`),
      '',
      `Subtotal: ${formatTZS(order.subtotal || order.total_amount)}`,
      `Delivery: ${formatTZS(order.delivery_fee || 0)}`,
      ...(order.discount > 0 ? [`Discount: -${formatTZS(order.discount)}`] : []),
      `Total: ${formatTZS(order.total_amount)}`,
      '',
      `Payment: ${order.payment_status === 'paid' ? 'Paid' : 'Pending'}`,
      '',
      '=== Thank you! ===',
    ];
    return lines.join('\n');
  }

  async function handleSubmitReview() {
    if (reviewRating === 0) return;
    setSubmittingReview(true);
    try {
      await apiSubmitReview(order.id || order.order_number, { rating: reviewRating, comment: reviewComment });
      setReviewSubmitted(true);
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  }

  async function handleShareReceipt() {
    const text = generateReceiptText();
    if (navigator.share) {
      try {
        await navigator.share({ title: `Receipt — ${order.order_number}`, text });
        return;
      } catch {
        // user cancelled or Share API failed, fall through to WhatsApp
      }
    }
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }

  function handleCopyReceipt() {
    const text = generateReceiptText();
    navigator.clipboard.writeText(text).catch(() => {});
  }

  function handleWhatsAppShare() {
    const text = generateReceiptText();
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  }

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
        <button
          onClick={() => navigate('/home')}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Home size={20} />
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

        {/* Progress Steps — All Procedures */}
        <div>
          <h2 className="text-sm font-bold text-slate-800 dark:text-white mb-4">Order Progress</h2>

          {/* Horizontal pill bar (like screenshot) */}
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-3 -mx-1 px-1">
            {ORDER_STATUSES.map((status, index) => {
              const isPast = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              return (
                <div
                  key={status.id}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex-shrink-0 border transition-all duration-300 ${
                    isCurrent
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md shadow-primary-500/30 scale-105'
                      : isPast
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <span className="text-sm">{status.icon}</span>
                  {status.label}
                </div>
              );
            })}
          </div>

          {/* Vertical timeline with details */}
          <div className="mt-4 space-y-0">
            {ORDER_STATUSES.map((status, index) => {
              const isPast = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const isLast = index === ORDER_STATUSES.length - 1;

              return (
                <div key={status.id} className="flex gap-3">
                  {/* Timeline line + circle */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${
                      isCurrent
                        ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/30 animate-pulse'
                        : isPast
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300'
                    }`}>
                      {isPast && !isCurrent ? (
                        <CheckCircle2 size={16} />
                      ) : (
                        <span className="text-sm">{status.icon}</span>
                      )}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-8 transition-all duration-500 ${
                        isPast && index < currentStatusIndex ? 'bg-green-400' : 'bg-slate-200 dark:bg-slate-700'
                      }`} />
                    )}
                  </div>
                  {/* Label */}
                  <div className={`pt-1 pb-3 ${isCurrent ? '' : ''}`}>
                    <p className={`text-sm font-semibold ${
                      isCurrent ? 'text-primary-600 dark:text-primary-400' : isPast ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'
                    }`}>
                      {status.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-primary-500 dark:text-primary-400 mt-0.5 animate-fade-in">
                        Current status
                      </p>
                    )}
                    {isPast && !isCurrent && (
                      <p className="text-[11px] text-slate-400 mt-0.5">Completed</p>
                    )}
                  </div>
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

        {/* Download Receipt */}
        <button
          onClick={() => setShowReceipt(true)}
          className="w-full py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <Download size={16} />
          Download Receipt
        </button>

        {/* Receipt Modal */}
        {showReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5 animate-fade-in" onClick={() => setShowReceipt(false)}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto p-5 space-y-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white text-center">Receipt</h3>

              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 space-y-2 text-sm font-mono text-slate-700 dark:text-slate-200">
                <p className="text-center font-bold text-base">LAUNDRY CONNECT</p>
                <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-2" />
                <p><span className="text-slate-500">Order:</span> {order.order_number}</p>
                <p><span className="text-slate-500">Date:</span> {new Date(order.created_at).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p><span className="text-slate-500">Shop:</span> {order.shop_name}</p>
                <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-2" />
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span>{getClothingLabel(item.clothing_type)} x{item.quantity}</span>
                    <span>{formatTZS(item.total_price)}</span>
                  </div>
                ))}
                <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-2" />
                <div className="flex justify-between"><span>Subtotal</span><span>{formatTZS(order.subtotal || order.total_amount)}</span></div>
                <div className="flex justify-between"><span>Delivery</span><span>{formatTZS(order.delivery_fee || 0)}</span></div>
                {order.discount > 0 && (
                  <div className="flex justify-between"><span>Discount</span><span className="text-green-600">-{formatTZS(order.discount)}</span></div>
                )}
                <div className="border-t border-slate-300 dark:border-slate-600 my-2" />
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>{formatTZS(order.total_amount)}</span></div>
                <div className="border-t border-dashed border-slate-300 dark:border-slate-600 my-2" />
                <p className="text-center">Payment: <span className="font-semibold">{order.payment_status === 'paid' ? 'Paid' : 'Pending'}</span></p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button onClick={handleShareReceipt} className="flex flex-col items-center gap-1.5 py-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
                  <Share2 size={18} className="text-primary-600 dark:text-primary-400" />
                  <span className="text-[11px] font-semibold text-primary-700 dark:text-primary-400">Share</span>
                </button>
                <button onClick={handleWhatsAppShare} className="flex flex-col items-center gap-1.5 py-3 bg-green-50 dark:bg-green-900/20 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <MessageCircle size={18} className="text-green-600 dark:text-green-400" />
                  <span className="text-[11px] font-semibold text-green-700 dark:text-green-400">WhatsApp</span>
                </button>
                <button onClick={handleCopyReceipt} className="flex flex-col items-center gap-1.5 py-3 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                  <Copy size={18} className="text-slate-600 dark:text-slate-300" />
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Copy</span>
                </button>
              </div>

              <button onClick={() => setShowReceipt(false)} className="w-full py-3 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                Close
              </button>
            </div>
          </div>
        )}

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

        {/* Contact Shop */}
        {order.shop_phone && (
          <a
            href={`tel:${order.shop_phone}`}
            className="w-full py-4 bg-fresh-600 dark:bg-fresh-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px]"
          >
            <Phone size={18} />
            Call Shop
          </a>
        )}

        {/* Review Section (after delivery) */}
        {isDelivered && (
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-4">
            <h2 className="text-sm font-bold text-slate-800 dark:text-white">Rate Your Experience</h2>
            {reviewSubmitted ? (
              <div className="space-y-2">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      size={20}
                      className={star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}
                    />
                  ))}
                  <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-200">{reviewRating}/5</span>
                </div>
                {reviewComment && (
                  <p className="text-sm text-slate-600 dark:text-slate-300 italic">"{reviewComment}"</p>
                )}
                <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                  <CheckCircle2 size={14} />
                  <span className="text-xs font-semibold">Review submitted — Asante!</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        size={28}
                        className={star <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-slate-300'}
                      />
                    </button>
                  ))}
                </div>
                <textarea
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Add a comment (optional)..."
                  rows={3}
                  className="w-full px-3 py-2.5 text-sm bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
                <button
                  onClick={handleSubmitReview}
                  disabled={reviewRating === 0 || submittingReview}
                  className="w-full py-3 bg-primary-600 dark:bg-primary-500 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md flex items-center justify-center gap-2"
                >
                  {submittingReview ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Star size={16} />
                  )}
                  {submittingReview ? 'Submitting...' : 'Tuma Maoni \u2014 Submit Review'}
                </button>
              </div>
            )}
          </div>
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
