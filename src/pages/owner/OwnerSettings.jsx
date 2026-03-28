import { useState, useEffect } from 'react';
import { apiOwnerGetShop, apiOwnerUpdateShop } from '../../api/client';
import { Loader2, Save, MapPin, Clock, Phone, FileText, CheckCircle2, Camera, X, Plus } from 'lucide-react';

export default function OwnerSettings() {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', description: '', address: '', region: '', phone: '',
    open: '07:00', close: '20:00', days: 'Mon-Sat',
  });
  const [photos, setPhotos] = useState([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  useEffect(() => {
    async function fetch() {
      try {
        const data = await apiOwnerGetShop();
        if (data.shop) {
          setShop(data.shop);
          setForm({
            name: data.shop.name || '',
            description: data.shop.description || '',
            address: data.shop.address || '',
            region: data.shop.region || '',
            phone: data.shop.phone || '',
            open: data.shop.operating_hours?.open || '07:00',
            close: data.shop.operating_hours?.close || '20:00',
            days: data.shop.operating_hours?.days || 'Mon-Sat',
          });
          setPhotos(data.shop.photos || []);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setSaved(false);
    setError('');
  };

  const handleSave = async () => {
    if (!form.name || !form.address) {
      setError('Name and address are required');
      return;
    }
    try {
      setSaving(true);
      setError('');
      await apiOwnerUpdateShop({
        name: form.name, description: form.description,
        address: form.address, region: form.region, phone: form.phone,
        operating_hours: { open: form.open, close: form.close, days: form.days },
        photos,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  if (!shop) {
    return (
      <div className="p-6">
        <div className="card p-8 text-center">
          <p className="text-4xl mb-3">🏪</p>
          <h2 className="text-xl font-bold text-slate-800 mb-2">No Shop Found</h2>
          <p className="text-slate-500">Your shop hasn't been set up yet. Contact admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Shop Settings</h1>
          <p className="text-slate-500 text-sm">Edit your shop profile</p>
        </div>
        {shop.is_approved ? <span className="badge-green">✓ Approved</span> : <span className="badge-amber">Pending Approval</span>}
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>}

      {saved && (
        <div className="mb-4 p-3 bg-fresh-50 border border-fresh-200 rounded-xl text-fresh-700 text-sm flex items-center gap-2 animate-slide-up">
          <CheckCircle2 size={16} /> Settings saved successfully!
        </div>
      )}

      <div className="space-y-4">
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <FileText size={16} className="text-primary-500" /> Shop Name
          </label>
          <input type="text" value={form.name} onChange={e => handleChange('name', e.target.value)} className="input-field" placeholder="e.g. Mama Salma Laundry" />
        </div>

        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
          <textarea value={form.description} onChange={e => handleChange('description', e.target.value)} rows={3} className="input-field resize-none" placeholder="Tell customers about your shop..." />
        </div>

        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <MapPin size={16} className="text-fresh-500" /> Location
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" value={form.address} onChange={e => handleChange('address', e.target.value)} className="input-field" placeholder="Street address" />
            <input type="text" value={form.region} onChange={e => handleChange('region', e.target.value)} className="input-field" placeholder="Area / Region (e.g. Kinondoni)" />
          </div>
        </div>

        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Phone size={16} className="text-primary-500" /> Phone Number
          </label>
          <input type="tel" value={form.phone} onChange={e => handleChange('phone', e.target.value)} className="input-field" placeholder="0754 123 456" />
        </div>

        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Clock size={16} className="text-amber-500" /> Operating Hours
          </label>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Opens</label>
              <input type="time" value={form.open} onChange={e => handleChange('open', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Closes</label>
              <input type="time" value={form.close} onChange={e => handleChange('close', e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Days</label>
              <select value={form.days} onChange={e => handleChange('days', e.target.value)} className="input-field">
                <option value="Mon-Sat">Mon – Sat</option>
                <option value="Mon-Sun">Mon – Sun</option>
                <option value="Mon-Fri">Mon – Fri</option>
              </select>
            </div>
          </div>
        </div>

        {/* Shop Photos */}
        <div className="card p-5">
          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
            <Camera size={16} className="text-primary-500" /> Shop Photos
          </label>
          <p className="text-xs text-slate-400 mb-3">Add photos of your shop to attract customers. Paste image URLs from Imgur, Google Drive, or any image host.</p>

          {/* Existing photos */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {photos.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
                <img src={url} alt={`Shop photo ${i + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => { setPhotos(photos.filter((_, j) => j !== i)); setSaved(false); }}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Add photo URL */}
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste image URL here..."
              value={newPhotoUrl}
              onChange={e => setNewPhotoUrl(e.target.value)}
              className="input-field flex-1"
            />
            <button
              onClick={() => {
                if (newPhotoUrl && photos.length < 10) {
                  try {
                    new URL(newPhotoUrl);
                    setPhotos([...photos, newPhotoUrl]);
                    setNewPhotoUrl('');
                    setSaved(false);
                  } catch {
                    setError('Please enter a valid URL');
                  }
                }
              }}
              className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors flex items-center gap-1"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          {photos.length >= 10 && <p className="text-xs text-amber-500 mt-2">Maximum 10 photos reached</p>}
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-4">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}