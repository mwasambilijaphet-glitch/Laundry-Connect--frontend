import { useState, useEffect, useRef } from 'react';
import { apiOwnerGetShop, apiOwnerUpdateShop, apiUploadImage } from '../../api/client';
import { Loader2, Save, MapPin, Clock, Phone, FileText, CheckCircle2, Camera, X, Plus, Upload, ImagePlus } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

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
          <p className="text-xs text-slate-400 mb-3">Add photos of your shop to attract customers (max 5MB each, JPG/PNG/WebP)</p>

          {uploadError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-xs">{uploadError}</div>
          )}

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

            {/* Upload button tile */}
            {photos.length < 10 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-primary-400 hover:bg-primary-50 flex flex-col items-center justify-center gap-1 transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 size={24} className="text-primary-500 animate-spin" />
                ) : (
                  <>
                    <ImagePlus size={24} className="text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-medium">Add Photo</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            className="hidden"
            onChange={async (e) => {
              const files = Array.from(e.target.files || []);
              if (files.length === 0) return;

              setUploading(true);
              setUploadError('');

              for (const file of files) {
                if (photos.length >= 10) break;
                try {
                  const data = await apiUploadImage(file);
                  setPhotos(prev => [...prev, data.url]);
                  setSaved(false);
                } catch (err) {
                  setUploadError(err.message || 'Failed to upload image');
                }
              }

              setUploading(false);
              // Reset file input
              e.target.value = '';
            }}
          />

          {/* Alternative: paste URL */}
          <details className="mt-2">
            <summary className="text-xs text-slate-400 cursor-pointer hover:text-slate-600">Or paste image URL</summary>
            <div className="flex gap-2 mt-2">
              <input
                type="url"
                placeholder="Paste image URL here..."
                value={newPhotoUrl}
                onChange={e => setNewPhotoUrl(e.target.value)}
                className="input-field flex-1 text-sm"
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
                className="px-3 py-2 bg-primary-600 text-white rounded-xl text-xs font-semibold hover:bg-primary-700 transition-colors flex items-center gap-1"
              >
                <Plus size={12} /> Add
              </button>
            </div>
          </details>
          {photos.length >= 10 && <p className="text-xs text-amber-500 mt-2">Maximum 10 photos reached</p>}
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full py-4">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
        </button>
      </div>
    </div>
  );
}