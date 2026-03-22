import { useState, useEffect } from 'react';
import { apiOwnerGetEarnings } from '../../api/client';
import { formatTZS } from '../../data/mockData';
import { Loader2, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function OwnerEarnings() {
  const [monthly, setMonthly] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await apiOwnerGetEarnings();
        setMonthly(data.monthly);
        setTransactions(data.transactions);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

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