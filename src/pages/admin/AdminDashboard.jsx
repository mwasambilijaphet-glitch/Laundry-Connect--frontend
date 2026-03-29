import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiAdminGetDashboard } from '../../api/client';
import { formatTZS } from '../../data/mockData';
import { Users, Store, ShoppingBag, DollarSign, Wallet, Loader2, ChevronRight } from 'lucide-react';

// All possible order statuses for the pill bar
const ALL_STATUSES = ['placed', 'confirmed', 'picked_up', 'washing', 'ready', 'delivered', 'cancelled'];

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
  const totalRevenue = parseInt(revenue.total_revenue);
  const totalCommission = parseInt(revenue.total_commission);

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display">Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Platform-wide overview</p>
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Users" value={totalUsers} sub={`${userCounts.customer || 0} customers · ${userCounts.owner || 0} owners`} color="primary" />
        <StatCard icon={Store} label="Total Shops" value={totalShops} sub={`${shopCounts.approved || 0} approved · ${shopCounts.pending || 0} pending`} color="fresh" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} color="amber" />
        {/* P2 #4 — Show dash when zero instead of "TZS 0 total" */}
        <StatCard icon={DollarSign} label="Platform Revenue" value={formatTZS(totalCommission)} sub={totalRevenue > 0 ? `of ${formatTZS(totalRevenue)} GMV` : null} color="primary" />
      </div>

      {/* P1 #1 — Order status pill bar instead of wasted card space */}
      <div className="card p-5 mb-6">
        <h2 className="font-semibold text-slate-800 dark:text-white mb-4">Orders by Status</h2>
        <div className="flex flex-wrap gap-2">
          {ALL_STATUSES.map(status => {
            const count = orderCounts[status] || 0;
            const isActive = count > 0;
            return (
              <button
                key={status}
                onClick={() => navigate('/admin/orders')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm hover:bg-primary-700'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span className="capitalize">{status.replace('_', ' ')}</span>
                {' '}
                <span className="font-bold">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pending shops alert */}
      {(shopCounts.pending || 0) > 0 && (
        <button onClick={() => navigate('/admin/shops')} className="w-full mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-200 dark:bg-amber-800 rounded-xl flex items-center justify-center text-lg">🏪</div>
            <div className="text-left">
              <p className="font-bold text-amber-800 dark:text-amber-200">{shopCounts.pending} shop{shopCounts.pending > 1 ? 's' : ''} waiting for approval</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Review and approve or reject</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-amber-500" />
        </button>
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

      {/* P3 #5 — Quick links with cleaner labels, P2 #3 — colored icon backgrounds */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <QuickLink icon={Store} label="Shop Approvals" desc="Review pending shops" color="fresh" onClick={() => navigate('/admin/shops')} />
        <QuickLink icon={Users} label="User Management" desc="View all accounts" color="primary" onClick={() => navigate('/admin/users')} />
        <QuickLink icon={DollarSign} label="Transactions" desc="All payment activity" color="amber" onClick={() => navigate('/admin/transactions')} />
        <QuickLink icon={Wallet} label="Shop Balances" desc="Commission to collect" color="primary" onClick={() => navigate('/admin/balances')} />
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }) {
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
      {sub && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">{sub}</p>}
    </div>
  );
}

// P2 #3 — Colored icon backgrounds matching top stat cards
function QuickLink({ icon: Icon, label, desc, color, onClick }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    fresh: 'bg-fresh-50 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };
  return (
    <button onClick={onClick} className="card p-5 flex items-center gap-4 hover:shadow-card-hover transition-all text-left group">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]} group-hover:scale-105 transition-transform`}>
        <Icon size={20} />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-slate-800 dark:text-white">{label}</p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{desc}</p>
      </div>
      <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}
