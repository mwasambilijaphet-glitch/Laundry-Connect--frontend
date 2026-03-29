import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiOwnerGetDashboard, apiCreateShop } from '../../api/client';
import { formatTZS, getStatusInfo, getClothingIcon } from '../../data/mockData';
import { ShoppingBag, TrendingUp, DollarSign, Clock, ChevronRight, Loader2, Store, MapPin, Phone, FileText, Check } from 'lucide-react';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await apiOwnerGetDashboard();
        setData(res.dashboard);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  if (!data?.has_shop) {
    return <RegisterShopForm onSuccess={() => { setLoading(true); apiOwnerGetDashboard().then(res => setData(res.dashboard)).finally(() => setLoading(false)); }} />;
  }

  const pendingOrders = data.status_counts.find(s => s.status === 'placed');
  const activeOrders = data.status_counts.filter(s => !['delivered', 'cancelled'].includes(s.status));
  const totalActive = activeOrders.reduce((sum, s) => sum + parseInt(s.count), 0);

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Dashboard</h1>
        <p className="text-slate-500 text-sm">Karibu! Here's your shop overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ShoppingBag} label="Today's Orders" value={data.today.orders} color="primary" />
        <StatCard icon={DollarSign} label="Today's Revenue" value={formatTZS(data.today.revenue)} color="fresh" />
        <StatCard icon={Clock} label="Active Orders" value={totalActive} color="amber" />
        <StatCard icon={TrendingUp} label="Total Earnings" value={formatTZS(data.total.earnings)} color="primary" />
      </div>

      {pendingOrders && parseInt(pendingOrders.count) > 0 && (
        <button onClick={() => navigate('/owner/orders')} className="w-full mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-between hover:bg-amber-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center text-lg">📋</div>
            <div className="text-left">
              <p className="font-bold text-amber-800">{pendingOrders.count} new order{parseInt(pendingOrders.count) > 1 ? 's' : ''} waiting</p>
              <p className="text-xs text-amber-600">Tap to review and accept</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-amber-500" />
        </button>
      )}

      {data.status_counts.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-slate-800 mb-3">Order Status</h2>
          <div className="flex flex-wrap gap-2">
            {data.status_counts.map(({ status, count }) => {
              const info = getStatusInfo(status);
              return (
                <div key={status} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                  <span className="text-sm">{info.icon}</span>
                  <span className="text-xs font-medium text-slate-700">{info.label}</span>
                  <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded-lg">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent Orders</h2>
          <button onClick={() => navigate('/owner/orders')} className="text-sm text-primary-600 font-semibold flex items-center gap-0.5 hover:underline">
            View All <ChevronRight size={14} />
          </button>
        </div>
        {data.recent_orders.length === 0 ? (
          <p className="p-5 text-slate-500 text-sm">No orders yet.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {data.recent_orders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-0.5">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-lg">{getClothingIcon(item.clothing_type)}</span>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{order.order_number}</p>
                    <p className="text-xs text-slate-400">{order.customer_name || 'Customer'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800 text-price">{formatTZS(order.total_amount)}</p>
                    <span className={`badge text-[10px] ${statusInfo.color === 'green' ? 'badge-green' : statusInfo.color === 'amber' ? 'badge-amber' : 'badge-blue'}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function RegisterShopForm({ onSuccess }) {
  const [step, setStep] = useState('intro'); // 'intro' | 'form'
  const [form, setForm] = useState({ name: '', address: '', region: '', phone: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const regions = ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Mbeya', 'Morogoro', 'Tanga', 'Zanzibar', 'Iringa', 'Kilimanjaro'];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.address || !form.region || !form.phone) {
      setError('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await apiCreateShop(form);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to register shop');
    } finally {
      setSubmitting(false);
    }
  }

  if (step === 'intro') {
    return (
      <div className="p-6 animate-fade-in flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-slate-800 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Store size={36} className="text-fresh-400" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display mb-2">Set Up Your Shop</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Register your laundry shop to start receiving orders from customers in your area. It only takes a minute!
          </p>
          <button
            onClick={() => setStep('form')}
            className="w-full py-3.5 bg-fresh-500 hover:bg-fresh-600 text-white font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Store size={18} />
            Register Your Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 font-display">Register Your Shop</h1>
          <p className="text-slate-500 text-sm">Fill in your shop details to get started</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="card p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <Store size={14} className="inline mr-1.5 text-slate-400" />Shop Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Clean & Fresh Laundry"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <MapPin size={14} className="inline mr-1.5 text-slate-400" />Address *
              </label>
              <input
                type="text"
                value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="e.g. Sinza, Kijitonyama"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <MapPin size={14} className="inline mr-1.5 text-slate-400" />Region *
              </label>
              <select
                value={form.region}
                onChange={e => setForm({ ...form, region: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              >
                <option value="">Select region</option>
                {regions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <Phone size={14} className="inline mr-1.5 text-slate-400" />Shop Phone *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="e.g. 0712345678"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                <FileText size={14} className="inline mr-1.5 text-slate-400" />Description
              </label>
              <textarea
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Tell customers about your services..."
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-fresh-500 hover:bg-fresh-600 disabled:bg-slate-300 text-white font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
            {submitting ? 'Registering...' : 'Submit for Approval'}
          </button>

          <p className="text-xs text-slate-400 text-center">
            Your shop will be reviewed by admin before going live.
          </p>
        </form>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    fresh: 'bg-fresh-50 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}><Icon size={18} /></div>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}