import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiAdminGetDashboard } from '../../api/client';
import { formatTZS } from '../../data/mockData';
import { Users, Store, ShoppingBag, DollarSign, Wallet, Loader2, ChevronRight } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await apiAdminGetDashboard();
        setData(res.dashboard);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  if (!data) {
    return <div className="p-6"><div className="card p-8 text-center"><p className="text-slate-500">Failed to load dashboard</p></div></div>;
  }

  // Parse user counts by role
  const userCounts = {};
  data.users.forEach(u => { userCounts[u.role] = parseInt(u.total); });
  const totalUsers = Object.values(userCounts).reduce((a, b) => a + b, 0);

  // Parse shop counts
  const shopCounts = {};
  data.shops.forEach(s => { shopCounts[s.is_approved ? 'approved' : 'pending'] = parseInt(s.total); });
  const totalShops = Object.values(shopCounts).reduce((a, b) => a + b, 0);

  // Parse order counts
  const orderCounts = {};
  data.orders.forEach(o => { orderCounts[o.status] = parseInt(o.total); });
  const totalOrders = Object.values(orderCounts).reduce((a, b) => a + b, 0);

  const revenue = data.revenue;

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">Platform-wide overview</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Users" value={totalUsers} sub={`${userCounts.customer || 0} customers, ${userCounts.owner || 0} owners`} color="primary" />
        <StatCard icon={Store} label="Total Shops" value={totalShops} sub={`${shopCounts.approved || 0} approved, ${shopCounts.pending || 0} pending`} color="fresh" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={parseInt(revenue.total_orders)} sub={`${totalOrders} all statuses`} color="amber" />
        <StatCard icon={DollarSign} label="Platform Revenue" value={formatTZS(parseInt(revenue.total_commission))} sub={`of ${formatTZS(parseInt(revenue.total_revenue))} total`} color="primary" />
      </div>

      {/* Pending shops alert */}
      {(shopCounts.pending || 0) > 0 && (
        <button onClick={() => navigate('/admin/shops')} className="w-full mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-between hover:bg-amber-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center text-lg">🏪</div>
            <div className="text-left">
              <p className="font-bold text-amber-800">{shopCounts.pending} shop{shopCounts.pending > 1 ? 's' : ''} waiting for approval</p>
              <p className="text-xs text-amber-600">Review and approve or reject</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-amber-500" />
        </button>
      )}

      {/* Order status breakdown */}
      {data.orders.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-slate-800 mb-3">Orders by Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.orders.map(({ status, total }) => (
              <div key={status} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-sm text-slate-600 capitalize">{status.replace('_', ' ')}</span>
                <span className="text-sm font-bold text-slate-800">{total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending commission alert */}
      {parseInt(revenue.pending_commission || 0) > 0 && (
        <button onClick={() => navigate('/admin/balances')} className="w-full mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl flex items-center justify-between hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-200 dark:bg-green-800 rounded-xl flex items-center justify-center">
              <Wallet size={20} className="text-green-700 dark:text-green-300" />
            </div>
            <div className="text-left">
              <p className="font-bold text-green-800 dark:text-green-200">{formatTZS(parseInt(revenue.pending_commission))} commission to collect</p>
              <p className="text-xs text-green-600 dark:text-green-400">From cash payments — tap to view details</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-green-500" />
        </button>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickLink icon={Store} label="Manage Shops" desc="Approve, suspend, review" onClick={() => navigate('/admin/shops')} />
        <QuickLink icon={Users} label="Manage Users" desc="Customers, owners, admins" onClick={() => navigate('/admin/users')} />
        <QuickLink icon={DollarSign} label="Transactions" desc="Payments, commissions, payouts" onClick={() => navigate('/admin/transactions')} />
        <QuickLink icon={Wallet} label="Shop Balances" desc="Cash commission to collect" onClick={() => navigate('/admin/balances')} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
  const colors = { primary: 'bg-primary-50 text-primary-600', fresh: 'bg-fresh-50 text-fresh-600', amber: 'bg-amber-50 text-amber-600' };
  return (
    <div className="card p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${colors[color]}`}><Icon size={18} /></div>
      <p className="text-lg font-bold text-slate-800 text-price">{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      {sub && <p className="text-[10px] text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function QuickLink({ icon: Icon, label, desc, onClick }) {
  return (
    <button onClick={onClick} className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-all text-left">
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
        <Icon size={20} className="text-slate-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-slate-800">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-slate-300" />
    </button>
  );
}