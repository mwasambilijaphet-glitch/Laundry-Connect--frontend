import { useState, useEffect } from 'react';
import { apiAdminGetPendingShops, apiAdminApproveShop } from '../../api/client';
import { Loader2, Check, X, MapPin, Phone, Mail, Clock, User } from 'lucide-react';

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    async function fetch() {
      try {
        const data = await apiAdminGetPendingShops();
        setShops(data.shops);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  const handleApprove = async (id, approved) => {
    try {
      setUpdating(id);
      await apiAdminApproveShop(id, approved);
      setShops(prev => prev.filter(s => s.id !== id));
    } catch (err) { alert('Failed: ' + err.message); }
    finally { setUpdating(null); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Shop Approvals</h1>
        <p className="text-slate-500 text-sm">{shops.length} shops pending review</p>
      </div>

      {shops.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">✅</p>
          <h3 className="text-lg font-bold text-slate-800 mb-1">All caught up!</h3>
          <p className="text-slate-500 text-sm">No shops waiting for approval</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shops.map(shop => (
            <div key={shop.id} className="card overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{shop.name}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={13} /> {shop.address}
                    </p>
                  </div>
                  <span className="badge-amber">Pending</span>
                </div>

                {shop.description && (
                  <p className="text-sm text-slate-600 mb-3">{shop.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <User size={14} className="text-primary-500" />
                    <div>
                      <p className="text-xs text-slate-400">Owner</p>
                      <p className="text-sm font-medium text-slate-700">{shop.owner_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <Phone size={14} className="text-fresh-500" />
                    <div>
                      <p className="text-xs text-slate-400">Phone</p>
                      <p className="text-sm font-medium text-slate-700">{shop.owner_phone || shop.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <Mail size={14} className="text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-400">Email</p>
                      <p className="text-sm font-medium text-slate-700 truncate">{shop.owner_email}</p>
                    </div>
                  </div>
                </div>

                {shop.region && (
                  <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                    <span>Region: <strong>{shop.region}</strong></span>
                    <span>City: <strong>{shop.city}</strong></span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> Registered {new Date(shop.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => handleApprove(shop.id, false)}
                  disabled={updating === shop.id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors text-sm"
                >
                  <X size={16} /> Reject
                </button>
                <button
                  onClick={() => handleApprove(shop.id, true)}
                  disabled={updating === shop.id}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-fresh-600 text-white font-semibold rounded-xl hover:bg-fresh-700 transition-colors text-sm"
                >
                  {updating === shop.id ? <Loader2 size={16} className="animate-spin" /> : <><Check size={16} /> Approve</>}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}