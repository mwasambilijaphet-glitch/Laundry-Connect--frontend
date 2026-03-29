import { useState, useEffect } from 'react';
import { apiAdminGetShops, apiAdminGetShop, apiAdminApproveShop } from '../../api/client';
import { CLOTHING_TYPES, SERVICE_TYPES, formatTZS } from '../../data/mockData';
import { Loader2, Check, X, MapPin, Phone, Mail, Clock, User, Store, Eye, ChevronLeft, Tag, Hash, FileText, Image, ExternalLink } from 'lucide-react';

export default function AdminShops() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('pending'); // 'pending' | 'approved' | 'all'
  const [updating, setUpdating] = useState(null);
  const [selectedShop, setSelectedShop] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchShops = async (status) => {
    try {
      setLoading(true);
      const data = await apiAdminGetShops(status === 'all' ? '' : status);
      setShops(data.shops);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchShops(tab); }, [tab]);

  const handleApprove = async (id, approved) => {
    try {
      setUpdating(id);
      await apiAdminApproveShop(id, approved);
      fetchShops(tab);
    } catch (err) { alert('Failed: ' + err.message); }
    finally { setUpdating(null); }
  };

  const openDetail = async (id) => {
    try {
      setDetailLoading(true);
      const data = await apiAdminGetShop(id);
      setSelectedShop(data.shop);
    } catch (err) { alert('Failed to load shop: ' + err.message); }
    finally { setDetailLoading(false); }
  };

  // Detail view
  if (selectedShop) {
    const shop = selectedShop;
    const clothingLabel = (id) => CLOTHING_TYPES.find(c => c.id === id)?.label || id;
    const clothingIcon = (id) => CLOTHING_TYPES.find(c => c.id === id)?.icon || '👕';
    const serviceLabel = (id) => SERVICE_TYPES.find(s => s.id === id)?.label || id;

    return (
      <div className="p-6 animate-fade-in">
        <button onClick={() => setSelectedShop(null)} className="flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-semibold mb-4 hover:underline">
          <ChevronLeft size={16} /> Back to Shops
        </button>

        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display">{shop.name}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mt-1"><MapPin size={13} /> {shop.address}{shop.region ? `, ${shop.region}` : ''}</p>
          </div>
          <span className={shop.is_approved ? 'badge-green' : 'badge-amber'}>
            {shop.is_approved ? 'Approved' : 'Pending'}
          </span>
        </div>

        {/* Shop Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Store size={14} /> Business Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Owner</span><span className="font-medium text-slate-800 dark:text-white">{shop.owner_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-medium text-slate-800 dark:text-white">{shop.phone || shop.owner_phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="font-medium text-slate-800 dark:text-white truncate ml-2">{shop.owner_email}</span></div>
              {shop.tin_number && <div className="flex justify-between"><span className="text-slate-500">TIN Number</span><span className="font-medium text-slate-800 dark:text-white">{shop.tin_number}</span></div>}
              <div className="flex justify-between"><span className="text-slate-500">Registered</span><span className="font-medium text-slate-800 dark:text-white">{new Date(shop.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            </div>
          </div>

          <div className="card p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><FileText size={14} /> Description & Stats</h3>
            {shop.description ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{shop.description}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">No description provided</p>
            )}
            <div className="flex gap-4 text-xs text-slate-500 pt-2">
              <span>Orders: <strong>{shop.total_orders || 0}</strong></span>
              <span>Rating: <strong>{shop.rating_avg || '—'}</strong></span>
              <span>Services: <strong>{shop.services?.length || 0}</strong></span>
            </div>
          </div>
        </div>

        {/* TIN Document */}
        {shop.tin_document && (
          <div className="card p-5 mb-6">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3"><Hash size={14} /> TIN Document</h3>
            {shop.tin_document.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
              <div className="max-w-md">
                <img src={shop.tin_document} alt="TIN Document" className="rounded-xl border border-slate-200 dark:border-slate-700 w-full" />
              </div>
            ) : (
              <a href={shop.tin_document} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
                <ExternalLink size={14} /> View TIN Document (PDF)
              </a>
            )}
          </div>
        )}

        {/* Photos */}
        {shop.photos && shop.photos.length > 0 && (
          <div className="card p-5 mb-6">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-3"><Image size={14} /> Shop Photos ({shop.photos.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {shop.photos.map((url, i) => (
                <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:opacity-80 transition-opacity">
                  <img src={url} alt={`Shop photo ${i + 1}`} className="w-full h-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        <div className="card overflow-hidden mb-6">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Tag size={14} /> Services & Prices ({shop.services?.length || 0})</h3>
          </div>
          {shop.services && shop.services.length > 0 ? (
            <div className="divide-y divide-slate-50 dark:divide-slate-800">
              {shop.services.map(svc => (
                <div key={svc.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{clothingIcon(svc.clothing_type)}</span>
                    <div>
                      <p className="text-sm font-medium text-slate-800 dark:text-white">{clothingLabel(svc.clothing_type)}</p>
                      <p className="text-xs text-slate-400">{serviceLabel(svc.service_type)}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{formatTZS(svc.price)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">No services added yet</div>
          )}
        </div>

        {/* Approve/Reject buttons if pending */}
        {!shop.is_approved && (
          <div className="flex gap-3">
            <button onClick={() => { handleApprove(shop.id, false); setSelectedShop(null); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-white dark:bg-slate-800 border-2 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm">
              <X size={16} /> Reject
            </button>
            <button onClick={() => { handleApprove(shop.id, true); setSelectedShop(null); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-fresh-600 text-white font-semibold rounded-xl hover:bg-fresh-700 transition-colors text-sm">
              <Check size={16} /> Approve
            </button>
          </div>
        )}
      </div>
    );
  }

  // List view
  const tabs = [
    { id: 'pending', label: 'Pending', count: null },
    { id: 'approved', label: 'Approved', count: null },
    { id: 'all', label: 'All Shops', count: null },
  ];

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display">Shop Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{shops.length} shops {tab !== 'all' ? `(${tab})` : 'total'}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === t.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>
      ) : shops.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">{tab === 'pending' ? '✅' : '🏪'}</p>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
            {tab === 'pending' ? 'All caught up!' : 'No shops found'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {tab === 'pending' ? 'No shops waiting for approval' : 'No shops registered yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {shops.map(shop => (
            <div key={shop.id} className="card overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-4 flex items-start gap-4">
                {/* Shop photo or placeholder */}
                <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {shop.photos && shop.photos.length > 0 ? (
                    <img src={shop.photos[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Store size={24} className="text-slate-400" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-white truncate">{shop.name}</h3>
                    <span className={shop.is_approved ? 'badge-green text-[10px]' : 'badge-amber text-[10px]'}>
                      {shop.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-1">
                    <MapPin size={11} /> {shop.address}{shop.region ? `, ${shop.region}` : ''}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1"><User size={11} /> {shop.owner_name}</span>
                    <span className="flex items-center gap-1"><Phone size={11} /> {shop.phone || shop.owner_phone}</span>
                    <span className="flex items-center gap-1"><Tag size={11} /> {shop.service_count || 0} services</span>
                    {shop.tin_number && <span className="flex items-center gap-1"><Hash size={11} /> TIN: {shop.tin_number}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openDetail(shop.id)}
                    disabled={detailLoading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-xl text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors">
                    {detailLoading ? <Loader2 size={13} className="animate-spin" /> : <Eye size={13} />} View
                  </button>
                  {!shop.is_approved && (
                    <>
                      <button onClick={() => handleApprove(shop.id, true)} disabled={updating === shop.id}
                        className="flex items-center gap-1 px-3 py-2 bg-fresh-50 dark:bg-fresh-900/30 text-fresh-700 dark:text-fresh-400 rounded-xl text-xs font-semibold hover:bg-fresh-100 dark:hover:bg-fresh-900/50 transition-colors">
                        {updating === shop.id ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Approve
                      </button>
                      <button onClick={() => handleApprove(shop.id, false)} disabled={updating === shop.id}
                        className="flex items-center gap-1 px-3 py-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors">
                        <X size={13} /> Reject
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
