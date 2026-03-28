import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { apiInitiatePayment, API_BASE } from '../api/client';
import { formatTZS } from '../data/mockData';
import { isDemoMode } from '../data/demoData';
import { ArrowLeft, Smartphone, CreditCard, QrCode, Loader2, CheckCircle2, Shield, AlertCircle, RefreshCw, Banknote, Wallet } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const PAYMENT_METHODS = [
  { id: 'cash', label: 'Taslimu — Cash', icon: '💵', desc: 'Lipa unapopokea / Pay on pickup or delivery', color: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800', popular: true },
  { id: 'mpesa', label: 'M-Pesa', icon: '📱', desc: 'Vodacom M-Pesa', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  { id: 'airtel', label: 'Airtel Money', icon: '📱', desc: 'Airtel Money', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
  { id: 'tigo', label: 'Tigo Pesa', icon: '📱', desc: 'Mixx by Yas', color: 'bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800' },
  { id: 'card', label: 'Card', icon: '💳', desc: 'Visa / Mastercard', color: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' },
  { id: 'qr', label: 'QR Code', icon: '📷', desc: 'Scan & Pay', color: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const { cartShop, subtotal, deliveryFee, totalAmount, clearCart, orderId } = useCart();
  const { t } = useLanguage();
  const [method, setMethod] = useState('cash');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | processing | success | failed
  const [error, setError] = useState('');
  const [paymentRef, setPaymentRef] = useState(null);
  const [pollCount, setPollCount] = useState(0);

  // Poll payment status when processing
  useEffect(() => {
    if (status !== 'processing' || !paymentRef) return;

    const interval = setInterval(async () => {
      try {
        const token = localStorage.getItem('lc_token');
        const res = await fetch(`${API_BASE}/payments/status/${paymentRef}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();

        if (data.transaction?.status === 'completed') {
          setStatus('success');
          clearInterval(interval);
          setTimeout(() => {
            clearCart();
            navigate('/orders');
          }, 2500);
        } else if (data.transaction?.status === 'failed') {
          setStatus('failed');
          setError('Payment was declined. Please try again.');
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Poll error:', err);
      }

      setPollCount(prev => {
        if (prev >= 24) { // Stop after 2 minutes (24 * 5s)
          clearInterval(interval);
          setStatus('idle');
          setError('Payment timed out. If money was deducted, it will be refunded automatically.');
          return 0;
        }
        return prev + 1;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [status, paymentRef]);

  const handlePay = async () => {
    if (['mpesa', 'airtel', 'tigo'].includes(method) && !phone) {
      setError('Please enter your phone number');
      return;
    }

    setError('');
    setStatus('processing');

    // In demo mode, simulate successful payment after 3 seconds
    if (isDemoMode()) {
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          clearCart();
          navigate('/orders');
        }, 2500);
      }, 3000);
      return;
    }

    try {
      const data = await apiInitiatePayment({
        order_id: orderId,
        method: method,
        phone: phone,
      });

      setPaymentRef(data.payment.reference);
      setPollCount(0);

      // Cash payment — instantly confirmed, no polling needed
      if (method === 'cash') {
        setStatus('cash_success');
        setTimeout(() => {
          clearCart();
          navigate('/orders');
        }, 3000);
        return;
      }

      // If Snippe returns a checkout URL (for card/QR), redirect after validation
      if (data.payment.checkout_url) {
        try {
          const url = new URL(data.payment.checkout_url);
          if (!['https:', 'http:'].includes(url.protocol)) {
            throw new Error('Invalid checkout URL');
          }
          window.location.href = data.payment.checkout_url;
          return;
        } catch {
          setStatus('failed');
          setError('Invalid payment redirect URL. Please try again.');
          return;
        }
      }

      // For mobile money, we wait for webhook/polling
    } catch (err) {
      console.error('Payment error:', err);
      setStatus('failed');
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  const handleRetry = () => {
    setStatus('idle');
    setError('');
    setPaymentRef(null);
    setPollCount(0);
  };

  if (status === 'cash_success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in bg-white dark:bg-slate-900">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
          <CheckCircle2 size={40} className="text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display mb-2">{t('cashOrderConfirmed')}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-2">{t('cashOrderDesc')}</p>
        <p className="text-3xl font-bold text-green-600 dark:text-green-400 text-price mb-4">{formatTZS(totalAmount)}</p>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center max-w-xs">
          <p className="text-sm text-green-700 dark:text-green-300 font-medium">{t('cashPayLater')}</p>
        </div>
        <p className="text-sm text-slate-400 text-center mt-4">{t('redirectingToOrders')}</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in bg-white dark:bg-slate-900">
        <div className="w-20 h-20 bg-fresh-100 dark:bg-fresh-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
          <CheckCircle2 size={40} className="text-fresh-600 dark:text-fresh-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display mb-2">Malipo Yamekamilika!</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-2">Payment successful</p>
        <p className="text-3xl font-bold text-fresh-600 dark:text-fresh-400 text-price mb-6">{formatTZS(totalAmount)}</p>
        <p className="text-sm text-slate-400 text-center">Redirecting to your orders...</p>
      </div>
    );
  }

  if (status === 'processing') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in bg-white dark:bg-slate-900">
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
            <Smartphone size={36} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="absolute -top-1 -right-1">
            <Loader2 size={24} className="text-primary-600 dark:text-primary-400 animate-spin" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white font-display mb-2">Processing Payment</h2>
        <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-4">
          {['mpesa', 'airtel', 'tigo'].includes(method)
            ? 'Check your phone for the USSD prompt and enter your PIN to confirm.'
            : 'Completing your payment...'}
        </p>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Shield size={14} /> Secured by Snippe
        </div>
        {pollCount > 6 && (
          <button onClick={handleRetry} className="mt-6 text-sm text-primary-600 dark:text-primary-400 font-semibold hover:underline">
            Taking too long? Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white font-display">Payment</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Choose how to pay</p>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-4 pb-40">
        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
            <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
              {status === 'failed' && (
                <button onClick={handleRetry} className="mt-2 text-sm text-red-700 dark:text-red-300 font-semibold flex items-center gap-1 hover:underline">
                  <RefreshCw size={14} /> Try again
                </button>
              )}
            </div>
          </div>
        )}

        {/* Order summary */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-3">Order Summary</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Shop</span>
              <span className="font-medium text-slate-700 dark:text-slate-200">{cartShop?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
              <span className="font-medium text-slate-700 dark:text-slate-200 text-price">{formatTZS(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Delivery Fee</span>
              <span className="font-medium text-slate-700 dark:text-slate-200 text-price">{formatTZS(deliveryFee)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
              <span className="font-bold text-slate-800 dark:text-white">Total</span>
              <span className="font-bold text-primary-600 dark:text-primary-400 text-price text-lg">{formatTZS(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="card p-4">
          <h2 className="font-semibold text-slate-800 dark:text-white mb-3">{t('paymentMethodTitle')}</h2>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(pm => (
              <button
                key={pm.id}
                onClick={() => { setMethod(pm.id); setError(''); }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  method === pm.id
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30'
                    : `${pm.color} hover:opacity-80`
                }`}
              >
                <span className="text-2xl">{pm.icon}</span>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{pm.label}</p>
                    {pm.popular && <span className="text-[10px] px-1.5 py-0.5 bg-green-500 text-white rounded-full font-bold">{t('mostPopular')}</span>}
                  </div>
                  <p className="text-xs text-slate-400">{pm.desc}</p>
                </div>
                {method === pm.id && (
                  <CheckCircle2 size={18} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Cash payment info */}
        {method === 'cash' && (
          <div className="card p-4 border-2 border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
            <h2 className="font-semibold text-green-800 dark:text-green-300 mb-3 flex items-center gap-2">
              <Wallet size={16} /> {t('cashPaymentTitle')}
            </h2>
            <div className="space-y-2.5 text-sm text-green-700 dark:text-green-400">
              <div className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <p>{t('cashStep1')}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <p>{t('cashStep2')}</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <p>{t('cashStep3')}</p>
              </div>
            </div>
            <div className="mt-3 p-2.5 bg-white dark:bg-slate-800 rounded-lg">
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('cashNote')}</p>
            </div>
          </div>
        )}

        {/* Phone number for mobile money */}
        {['mpesa', 'airtel', 'tigo'].includes(method) && (
          <div className="card p-4">
            <h2 className="font-semibold text-slate-800 dark:text-white mb-3">
              <Smartphone size={16} className="inline mr-1" /> {t('phoneNumber')}
            </h2>
            <input
              type="tel"
              placeholder="0754 123 456"
              value={phone}
              onChange={e => { setPhone(e.target.value); setError(''); }}
              className="input-field"
            />
            <p className="text-xs text-slate-400 mt-2">
              {t('ussdPromptNote')}
            </p>
          </div>
        )}

        {/* Security note */}
        <div className="flex items-center gap-2 p-3 bg-fresh-50 dark:bg-fresh-900/20 border border-fresh-200 dark:border-fresh-800 rounded-xl">
          <Shield size={16} className="text-fresh-600 dark:text-fresh-400 flex-shrink-0" />
          <p className="text-xs text-fresh-700 dark:text-fresh-300">
            {method === 'cash' ? t('cashSecurityNote') : t('digitalSecurityNote')}
          </p>
        </div>
      </div>

      {/* Bottom pay button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 px-6 py-4 z-20">
        <button onClick={handlePay} disabled={status === 'processing'} className={`w-full py-4 text-base font-bold rounded-2xl disabled:opacity-50 transition-colors ${method === 'cash' ? 'bg-green-600 hover:bg-green-700 text-white' : 'btn-fresh'}`}>
          {status === 'processing' ? (
            <Loader2 className="animate-spin mx-auto" size={20} />
          ) : method === 'cash' ? (
            `${t('confirmCashOrder')} — ${formatTZS(totalAmount)}`
          ) : (
            `Lipa ${formatTZS(totalAmount)} — ${t('payNow')}`
          )}
        </button>
      </div>
    </div>
  );
}
