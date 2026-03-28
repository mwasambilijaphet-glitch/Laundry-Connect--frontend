import { useState, useEffect } from 'react';
import { apiAdminGetBalances, apiAdminSettleBalance } from '../../api/client';
import { formatTZS } from '../../data/mockData';
import { Loader2, Wallet, CheckCircle2, Phone, Mail } from 'lucide-react';

export default function AdminBalances() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState(null);

  async function fetchBalances() {
    try {
      const res = await apiAdminGetBalances();
      setData(res);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }

  useEffect(() => { fetchBalances(); }, []);

  const handleSettle = async (shopId, shopName) => {
    if (!confirm(`Mark all pending commission from "${shopName}" as collected?`)) return;
    setSettling(shopId);
    try {
      await apiAdminSettleBalance(shopId);
      await fetchBalances();
    } catch (err) {
      alert('Failed to settle: ' + err.message);
    }
    setSettling(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display">Shop Balances</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Commission owed from cash payments</p>
      </div>

      {/* Total owed */}
      <div className="card p-5 mb-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-200 dark:bg-amber-800 rounded-xl flex items-center justify-center">
            <Wallet size={24} className="text-amber-700 dark:text-amber-300" />
          </div>
          <div>
            <p className="text-sm text-amber-600 dark:text-amber-400">Total Commission Owed to You</p>
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-200 text-price">{formatTZS(data?.total_owed || 0)}</p>
          </div>
        </div>
      </div>

      {(!data?.balances || data.balances.length === 0) ? (
        <div className="card p-8 text-center">
          <CheckCircle2 size={40} className="text-fresh-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">All settled!</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">No pending commission from shop owners</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.balances.map(shop => (
            <div key={shop.shop_id} className="card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white">{shop.shop_name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{shop.owner_name}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-amber-600 dark:text-amber-400 text-price">{formatTZS(parseInt(shop.owed_amount))}</p>
                  <p className="text-xs text-slate-400">{shop.pending_orders} cash order{shop.pending_orders > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1"><Phone size={12} /> {shop.owner_phone}</span>
                <span className="flex items-center gap-1"><Mail size={12} /> {shop.owner_email}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <p className="text-xs text-slate-400">
                  Already collected: <span className="font-semibold text-fresh-600">{formatTZS(parseInt(shop.collected_amount))}</span>
                </p>
                <button
                  onClick={() => handleSettle(shop.shop_id, shop.shop_name)}
                  disabled={settling === shop.shop_id}
                  className="px-4 py-2 bg-fresh-600 text-white text-sm font-semibold rounded-xl hover:bg-fresh-700 disabled:opacity-50 transition-colors"
                >
                  {settling === shop.shop_id ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    'Mark as Collected'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
