import { useState, useEffect } from 'react';
import { apiOwnerGetServices, apiOwnerAddService, apiOwnerDeleteService } from '../../api/client';
import { CLOTHING_TYPES, SERVICE_TYPES, formatTZS, getClothingIcon, getServiceLabel } from '../../data/mockData';
import { Plus, Trash2, Loader2, Save, X } from 'lucide-react';

export default function OwnerServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ clothing_type: '', service_type: '', price: '' });
  const [error, setError] = useState('');

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await apiOwnerGetServices();
      setServices(data.services);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchServices(); }, []);

  const handleAdd = async () => {
    setError('');
    if (!form.clothing_type || !form.service_type || !form.price) {
      setError('Please fill all fields');
      return;
    }
    try {
      setSaving(true);
      await apiOwnerAddService({
        clothing_type: form.clothing_type,
        service_type: form.service_type,
        price: parseInt(form.price),
      });
      setForm({ clothing_type: '', service_type: '', price: '' });
      setShowForm(false);
      fetchServices();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remove this service?')) return;
    try {
      await apiOwnerDeleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  };

  const grouped = {};
  services.forEach(svc => {
    if (!grouped[svc.clothing_type]) grouped[svc.clothing_type] = [];
    grouped[svc.clothing_type].push(svc);
  });

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Services & Prices</h1>
          <p className="text-slate-500 text-sm">{services.length} services listed</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={showForm ? 'btn-secondary' : 'btn-primary'}>
          {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Service</>}
        </button>
      </div>

      {showForm && (
        <div className="card p-5 mb-6 animate-slide-up">
          <h3 className="font-semibold text-slate-800 mb-4">Add New Service</h3>
          {error && <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Clothing Type</label>
              <select value={form.clothing_type} onChange={e => setForm(prev => ({ ...prev, clothing_type: e.target.value }))} className="input-field">
                <option value="">Select clothing...</option>
                {CLOTHING_TYPES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Service Type</label>
              <select value={form.service_type} onChange={e => setForm(prev => ({ ...prev, service_type: e.target.value }))} className="input-field">
                <option value="">Select service...</option>
                {SERVICE_TYPES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Price (TZS)</label>
              <input type="number" placeholder="e.g. 2500" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} className="input-field" />
            </div>
          </div>
          <button onClick={handleAdd} disabled={saving} className="btn-fresh">
            {saving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Service</>}
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="text-primary-500 animate-spin" /></div>
      ) : services.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">🏷️</p>
          <h3 className="text-lg font-bold text-slate-800 mb-1">No services yet</h3>
          <p className="text-slate-500 text-sm">Add your first service and set your prices</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([clothingId, svcs]) => {
            const clothing = CLOTHING_TYPES.find(c => c.id === clothingId);
            return (
              <div key={clothingId} className="card overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-3">
                  <span className="text-2xl">{clothing?.icon || '👕'}</span>
                  <h3 className="font-semibold text-slate-800">{clothing?.label || clothingId}</h3>
                  <span className="badge-gray text-[10px]">{svcs.length} service{svcs.length > 1 ? 's' : ''}</span>
                </div>
                <div className="divide-y divide-slate-50">
                  {svcs.map(svc => (
                    <div key={svc.id} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm text-slate-700 font-medium">{getServiceLabel(svc.service_type)}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-primary-600 text-price">{formatTZS(svc.price)}</span>
                        <button onClick={() => handleDelete(svc.id)} className="w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center justify-center transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}