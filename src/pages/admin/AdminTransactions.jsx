import { useState, useEffect } from 'react';
import { apiAdminGetTransactions } from '../../api/client';
import { formatTZS } from '../../data/mockData';
import { Loader2, CreditCard, ArrowUpRight, ArrowDownRight, Percent } from 'lucide-react';

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetch() {
      try {
        const data = await apiAdminGetTransactions();
        setTransactions(data.transactions);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  const filtered = filter
    ? transactions.filter(t => t.type === filter)
    : transactions;

  const totalPayments = transactions.filter(t => t.type === 'payment' && t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const totalCommission = transactions.filter(t => t.type === 'commission').reduce((sum, t) => sum + t.amount, 0);
  const totalPayouts = transactions.filter(t => t.type === 'payout').reduce((sum, t) => sum + t.amount, 0);

  const typeIcon = (type) => {
    if (type === 'payment') return <ArrowUpRight size={14} className="text-fresh-600" />;
    if (type === 'commission') return <Percent size={14} className="text-primary-600" />;
    return <ArrowDownRight size={14} className="text-amber-600" />;
  };

  const typeBadge = (type) => {
    if (type === 'payment') return 'badge-green';
    if (type === 'commission') return 'badge-blue';
    return 'badge-amber';
  };

  const statusBadge = (status) => {
    if (status === 'completed') return 'badge-green';
    if (status === 'failed') return 'badge-red';
    return 'badge-gray';
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Transactions</h1>
        <p className="text-slate-500 text-sm">{transactions.length} total transactions</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-fresh-50 rounded-lg flex items-center justify-center">
              <ArrowUpRight size={16} className="text-fresh-600" />
            </div>
            <span className="text-sm text-slate-500">Total Payments</span>
          </div>
          <p className="text-xl font-bold text-fresh-600 text-price">{formatTZS(totalPayments)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Percent size={16} className="text-primary-600" />
            </div>
            <span className="text-sm text-slate-500">Total Commission</span>
          </div>
          <p className="text-xl font-bold text-primary-600 text-price">{formatTZS(totalCommission)}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <ArrowDownRight size={16} className="text-amber-600" />
            </div>
            <span className="text-sm text-slate-500">Total Payouts</span>
          </div>
          <p className="text-xl font-bold text-amber-600 text-price">{formatTZS(totalPayouts)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {[
          { value: '', label: 'All' },
          { value: 'payment', label: '💰 Payments' },
          { value: 'commission', label: '📊 Commission' },
          { value: 'payout', label: '💸 Payouts' },
        ].map(f => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === f.value
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <CreditCard size={40} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No transactions</h3>
          <p className="text-slate-500 text-sm">Transactions will appear when orders are paid</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Order</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Amount</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Reference</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(tx => (
                  <tr key={tx.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {typeIcon(tx.type)}
                        <span className={`${typeBadge(tx.type)} text-[10px]`}>{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{tx.order_number || '—'}</td>
                    <td className="px-4 py-3 text-right font-bold text-price">
                      {tx.type === 'commission' ? formatTZS(tx.amount) : formatTZS(tx.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`${statusBadge(tx.status)} text-[10px]`}>{tx.status}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs font-mono">{tx.snippe_reference || '—'}</td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-50">
            {filtered.map(tx => (
              <div key={tx.id} className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {typeIcon(tx.type)}
                    <span className={`${typeBadge(tx.type)} text-[10px]`}>{tx.type}</span>
                    <span className={`${statusBadge(tx.status)} text-[10px]`}>{tx.status}</span>
                  </div>
                  <span className="font-bold text-sm text-price">{formatTZS(tx.amount)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{tx.order_number || 'No order'}</span>
                  <span>{new Date(tx.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}