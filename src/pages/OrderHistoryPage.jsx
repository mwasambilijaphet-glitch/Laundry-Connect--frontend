import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGetOrders } from '../api/client';
import { formatTZS, getStatusInfo, getClothingIcon } from '../data/mockData';
import { DEMO_ORDERS } from '../data/demoData';
import LanguageToggle from '../components/LanguageToggle';
import { Package, ChevronRight, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const data = await apiGetOrders();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
        setOrders(DEMO_ORDERS);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-800 dark:text-white font-display">Oda Zangu — My Orders</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{orders.length} orders total</p>
          </div>
          <div className="flex items-center gap-1">
            <LanguageToggle variant="icon" />
            <button onClick={toggleTheme} className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="text-primary-500 animate-spin" />
          </div>
        ) : (
          <>
            {activeOrders.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-primary-600 uppercase tracking-wide mb-3">
                  Active ({activeOrders.length})
                </h2>
                <div className="space-y-3">
                  {activeOrders.map(order => (
                    <OrderCard key={order.id} order={order} onClick={() => navigate(`/order/${order.order_number}`)} />
                  ))}
                </div>
              </div>
            )}

            {pastOrders.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
                  Completed ({pastOrders.length})
                </h2>
                <div className="space-y-3">
                  {pastOrders.map(order => (
                    <OrderCard key={order.id} order={order} onClick={() => navigate(`/order/${order.order_number}`)} />
                  ))}
                </div>
              </div>
            )}

            {orders.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <Package size={48} className="text-slate-300 dark:text-slate-600 mb-4" />
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No orders yet</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Start by finding a laundry shop</p>
                <button onClick={() => navigate('/shops')} className="btn-primary">
                  Find Shops
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onClick }) {
  const statusInfo = getStatusInfo(order.status);
  const isActive = !['delivered', 'cancelled'].includes(order.status);

  const badgeClass = {
    blue: 'badge-blue',
    amber: 'badge-amber',
    green: 'badge-green',
    red: 'badge-red',
    gray: 'badge-gray',
  }[statusInfo.color] || 'badge-gray';

  return (
    <button onClick={onClick} className={`card-hover w-full p-4 text-left ${isActive ? 'ring-2 ring-primary-100' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-bold text-sm text-slate-800 dark:text-white">{order.order_number}</p>
          <p className="text-xs text-slate-400">
            {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <span className={badgeClass}>
          {statusInfo.icon} {statusInfo.label}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center text-sm">🧺</div>
        <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{order.shop_name}</span>
      </div>

      <div className="flex gap-1 mb-3">
        {order.items?.slice(0, 4).map((item, i) => (
          <span key={i} className="text-lg">{getClothingIcon(item.clothing_type)}</span>
        ))}
        {order.items?.length > 4 && (
          <span className="text-xs text-slate-400 self-center ml-1">+{order.items.length - 4} more</span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-primary-600 text-price">{formatTZS(order.total_amount)}</span>
        <span className="flex items-center gap-1 text-xs text-primary-600 font-medium">
          View Details <ChevronRight size={14} />
        </span>
      </div>
    </button>
  );
}
