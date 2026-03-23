import { useState, useEffect } from 'react';
import { apiOwnerGetEarnings, apiOwnerGetCommission, apiOwnerSettleCommission } from '../../api/client';
import { formatTZS } from '../../data/mockData';
import { Loader2, TrendingUp, ArrowUpRight, AlertTriangle, Smartphone, CheckCircle2 } from 'lucide-react';

export default function OwnerEarnings() {
  const [monthly, setMonthly] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Commission state
  const [commission, setCommission] = useState(null);
  const [settlePhone, setSettlePhone] = useState('');
  const [settling, setSettling] = useState(false);
  const [settleResult, setSettleResult] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [earningsData, commissionData] = await Promise.all([
          apiOwnerGetEarnings(),
          apiOwnerGetCommission(),
        ]);
        setMonthly(earningsData.monthly);
        setTransactions(earningsData.transactions);
        setCommission(commissionData.commission);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchData();
  }, []);

  const handleSettle = async () => {
    if (!settlePhone) return;
    setSettling(true);
    setSettleResult(null);
    try {
      const data = await apiOwnerSettleCommission(settlePhone);
      setSettleResult({ success: true, message: data.message });
      // Refresh commission data
      const commissionData = await apiOwnerGetCommission();
      setCommission(commissionData.commission);
    } catch (err) {
      setSettleResult({ success: false, message: err.message || 'Settlement failed' });
    } finally {
      setSettling(false);
    }
  };

  const totalEarnings = monthly.reduce((sum, m) => sum + parseInt(m.earnings), 0);
  const totalRevenue = monthly.reduce((sum, m) => sum + parseInt(m.revenue), 0);
  const totalCommission = monthly.reduce((sum, m) => sum + parseInt(m.commission), 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Earnings</h1>
        <p className="text-slate-500 text-sm">Your revenue breakdown</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-5 bg-gradient-to-br from-primary-600 to-primary-500 text-white">
          <p className="text-primary-200 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-price mt-1">{formatTZS(totalRevenue)}</p>
          <div className="flex items-center gap-1 mt-2 text-primary-200 text-xs">
            <TrendingUp size={14} /> All time
          </div>
        </div>
        <div className="card p-5">
          <p className="text-slate-400 text-sm">Platform Commission</p>
          <p className="text-2xl font-bold text-red-500 text-price mt-1">- {formatTZS(totalCommission)}</p>
          <p className="text-xs text-slate-400 mt-2">10% per order</p>
        </div>
        <div className="card p-5 bg-gradient-to-br from-fresh-600 to-fresh-500 text-white">
          <p className="text-fresh-200 text-sm">Your Earnings</p>
          <p className="text-2xl font-bold text-price mt-1">{formatTZS(totalEarnings)}</p>
          <div className="flex items-center gap-1 mt-2 text-fresh-200 text-xs">
            <ArrowUpRight size={14} /> After commission
          </div>
        </div>
      </div>

      {/* Cash Commission Settlement */}
      {commission && commission.total_owed > 0 && (
        <div className="card p-5 mb-6 border-2 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="font-bold text-slate-800 dark:text-white">Commission Due — Deni la Commission</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                You have pending platform commission from {commission.orders.length} cash order{commission.orders.length !== 1 ? 's' : ''}.
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 mb-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Commission Owed</p>
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400 text-price mt-1">{formatTZS(commission.total_owed)}</p>
          </div>

          {/* Settlement result message */}
          {settleResult && (
            <div className={`flex items-center gap-2 p-3 rounded-xl mb-4 ${
              settleResult.success
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}>
              {settleResult.success
                ? <CheckCircle2 size={16} className="text-green-600 dark:text-green-400" />
                : <AlertTriangle size={16} className="text-red-500" />
              }
              <p className={`text-sm font-medium ${settleResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-600 dark:text-red-400'}`}>
                {settleResult.message}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Smartphone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="tel"
                placeholder="M-Pesa number e.g. 0754123456"
                value={settlePhone}
                onChange={e => setSettlePhone(e.target.value)}
                className="input-field pl-9 text-sm"
              />
            </div>
            <button
              onClick={handleSettle}
              disabled={settling || !settlePhone}
              className="btn-primary px-5 text-sm whitespace-nowrap disabled:opacity-50"
            >
              {settling ? <Loader2 size={16} className="animate-spin" /> : 'Lipa — Pay'}
            </button>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
            Pay your commission via M-Pesa. You'll receive a USSD prompt to confirm.
          </p>
        </div>
      )}

      {monthly.length > 0 && (
        <div className="card overflow-hidden mb-6">
          <div className="p-5 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Monthly Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Month</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Orders</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Revenue</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Commission</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {monthly.map(row => (
                  <tr key={row.month} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {new Date(row.month + '-01').toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">{row.orders}</td>
                    <td className="px-4 py-3 text-right text-price">{formatTZS(parseInt(row.revenue))}</td>
                    <td className="px-4 py-3 text-right text-red-500 text-price">- {formatTZS(parseInt(row.commission))}</td>
                    <td className="px-4 py-3 text-right font-bold text-fresh-600 text-price">{formatTZS(parseInt(row.earnings))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Recent Transactions</h2>
        </div>
        {transactions.length === 0 ? (
          <p className="p-5 text-slate-500 text-sm">No transactions yet.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{tx.order_number}</p>
                  <p className="text-xs text-slate-400">{tx.customer_name} • {new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-fresh-600 text-price">+ {formatTZS(parseInt(tx.net_earning))}</p>
                  <p className="text-[10px] text-slate-400">of {formatTZS(tx.total_amount)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}