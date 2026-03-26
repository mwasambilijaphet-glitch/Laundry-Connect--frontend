import { useState, useEffect } from 'react';
import { apiAdminGetOrders } from '../../api/client';
import { formatTZS, getStatusInfo, getClothingIcon } from '../../data/mockData';
import { Loader2, Search } from 'lucide-react';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await apiAdminGetOrders();
        if (data.success) setOrders(data.orders);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetchOrders();
  }, []);

  const filtered = search
    ? orders.filter(o =>
        (o.order_number || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.customer_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (o.shop_name || '').toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-display">All Orders</h1>
        <p className="text-slate-500 text-sm">{orders.length} orders platform-wide</p>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by order number, customer, or shop..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field pl-10"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">📦</p>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No orders found</h3>
          <p className="text-slate-500 text-sm">{search ? 'Try a different search' : 'No orders on the platform yet'}</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Order</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Customer</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Shop</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Total</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-600">Commission</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Payment</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(order => {
                  const statusInfo = getStatusInfo(order.status);
                  const badgeClass = {
                    blue: 'badge-blue', amber: 'badge-amber', green: 'badge-green', red: 'badge-red', gray: 'badge-gray',
                  }[statusInfo.color] || 'badge-gray';
                  return (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-800">{order.order_number}</td>
                      <td className="px-4 py-3 text-slate-600">{order.customer_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{order.shop_name || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`${badgeClass} text-[10px]`}>{statusInfo.icon} {statusInfo.label}</span>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-price">{formatTZS(order.total_amount)}</td>
                      <td className="px-4 py-3 text-right text-primary-600 text-price">{formatTZS(order.platform_commission)}</td>
                      <td className="px-4 py-3">
                        <span className={`badge text-[10px] ${order.payment_status === 'paid' ? 'badge-green' : 'badge-gray'}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-slate-50">
            {filtered.map(order => {
              const statusInfo = getStatusInfo(order.status);
              const badgeClass = {
                blue: 'badge-blue', amber: 'badge-amber', green: 'badge-green', red: 'badge-red', gray: 'badge-gray',
              }[statusInfo.color] || 'badge-gray';
              return (
                <div key={order.id} className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-bold text-sm text-slate-800">{order.order_number}</p>
                    <span className={`${badgeClass} text-[10px]`}>{statusInfo.icon} {statusInfo.label}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>{order.customer_name || 'Customer'} → {order.shop_name || 'Shop'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`badge text-[10px] ${order.payment_status === 'paid' ? 'badge-green' : 'badge-gray'}`}>
                      {order.payment_status}
                    </span>
                    <span className="font-bold text-sm text-price">{formatTZS(order.total_amount)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}