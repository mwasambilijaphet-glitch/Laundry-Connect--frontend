import { useState, useEffect } from 'react';
import { apiAdminGetBalances, apiAdminSettleBalance, apiAdminSendInvoice } from '../../api/client';
import { formatTZS } from '../../data/mockData';
import { Loader2, Wallet, CheckCircle2, Phone, Mail, Send, Smartphone, CreditCard } from 'lucide-react';

export default function AdminBalances() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [settling, setSettling] = useState(null);
  const [invoicing, setInvoicing] = useState(null);
  const [invoiceResult, setInvoiceResult] = useState(null);

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

  const handleSendInvoice = async (shopId, shopName, amount) => {
    if (!confirm(`Send M-Pesa invoice of ${formatTZS(amount)} to "${shopName}"?`)) return;
    setInvoicing(shopId);
    setInvoiceResult(null);
    try {
      const result = await apiAdminSendInvoice(shopId);
      setInvoiceResult({ shopId, success: true, message: result.message, method: result.method });
    } catch (err) {
      setInvoiceResult({ shopId, success: false, message: err.message });
    }
    setInvoicing(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display">Shop Balances</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Commission collection — M-Pesa invoice or manual</p>
      </div>

      {/* Total owed */}
      <div className="card p-5 mb-6 bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-200 dark:bg-amber-800 rounded-xl flex items-center justify-center">
            <Wallet size={24} className="text-amber-700 dark:text-amber-300" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-amber-600 dark:text-amber-400">Total Commission Owed to You</p>
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-200 text-price">{formatTZS(data?.total_owed || 0)}</p>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="card p-4 mb-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800">
        <div className="flex items-start gap-3">
          <Smartphone size={18} className="text-primary-600 dark:text-primary-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">M-Pesa Commission Collection</p>
            <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">
              Mobile money payments auto-deduct commission. For cash payments, send an M-Pesa invoice to the shop owner or mark as manually collected.
            </p>
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
          {data.balances.map(shop => {
            const owedAmount = parseInt(shop.owed_amount);
            const result = invoiceResult?.shopId === shop.shop_id ? invoiceResult : null;

            return (
              <div key={shop.shop_id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white">{shop.shop_name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{shop.owner_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-amber-600 dark:text-amber-400 text-price">{formatTZS(owedAmount)}</p>
                    <p className="text-xs text-slate-400">{shop.pending_orders} cash order{shop.pending_orders > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1"><Phone size={12} /> {shop.owner_phone}</span>
                  <span className="flex items-center gap-1"><Mail size={12} /> {shop.owner_email}</span>
                </div>

                {/* Invoice result message */}
                {result && (
                  <div className={`p-3 rounded-xl mb-3 text-sm font-medium ${
                    result.success
                      ? 'bg-fresh-50 dark:bg-fresh-900/20 text-fresh-700 dark:text-fresh-300 border border-fresh-200 dark:border-fresh-800'
                      : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
                  }`}>
                    {result.message}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400">
                    Already collected: <span className="font-semibold text-fresh-600">{formatTZS(parseInt(shop.collected_amount))}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    {/* Send M-Pesa invoice */}
                    <button
                      onClick={() => handleSendInvoice(shop.shop_id, shop.shop_name, owedAmount)}
                      disabled={invoicing === shop.shop_id}
                      className="px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {invoicing === shop.shop_id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <>
                          <Send size={12} />
                          M-Pesa Invoice
                        </>
                      )}
                    </button>
                    {/* Manual settle */}
                    <button
                      onClick={() => handleSettle(shop.shop_id, shop.shop_name)}
                      disabled={settling === shop.shop_id}
                      className="px-3 py-2 bg-slate-600 text-white text-xs font-semibold rounded-xl hover:bg-slate-700 disabled:opacity-50 transition-colors flex items-center gap-1.5"
                    >
                      {settling === shop.shop_id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 size={12} />
                          Manual
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
