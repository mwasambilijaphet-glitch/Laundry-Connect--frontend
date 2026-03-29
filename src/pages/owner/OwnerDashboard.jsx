import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiOwnerGetDashboard } from '../../api/client';
import { formatTZS, getStatusInfo, getClothingIcon } from '../../data/mockData';
import { ShoppingBag, TrendingUp, DollarSign, Clock, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

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
    return (
      <div className="p-6">
        <div className="card p-8 text-center">
          <AlertCircle size={40} className="text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Shop Found</h2>
          <p className="text-slate-500 mb-4">You haven't registered a shop yet.</p>
        </div>
      </div>
    );
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