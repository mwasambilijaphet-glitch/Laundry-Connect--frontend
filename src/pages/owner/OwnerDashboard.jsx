import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiOwnerGetDashboard, apiCreateShop, apiUploadImage } from '../../api/client';
import { formatTZS, getStatusInfo, getClothingIcon, CLOTHING_TYPES, SERVICE_TYPES, getClothingCategories } from '../../data/mockData';
import { ShoppingBag, TrendingUp, DollarSign, Clock, ChevronRight, Loader2, Store, MapPin, Phone, FileText, Check, Camera, Upload, X, Plus, Trash2, ArrowLeft, ArrowRight, Hash } from 'lucide-react';

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      try {
        const res = await apiOwnerGetDashboard();
        setData(res.dashboard);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    }
    fetch();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 size={28} className="text-primary-500 animate-spin" /></div>;
  }

  if (!data?.has_shop) {
    return <RegisterShopForm onSuccess={() => { setLoading(true); apiOwnerGetDashboard().then(res => setData(res.dashboard)).finally(() => setLoading(false)); }} />;
  }

  const pendingOrders = data.status_counts.find(s => s.status === 'placed');
  const activeOrders = data.status_counts.filter(s => !['delivered', 'cancelled'].includes(s.status));
  const totalActive = activeOrders.reduce((sum, s) => sum + parseInt(s.count), 0);

  return (
    <div className="p-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 font-display">Dashboard</h1>
        <p className="text-slate-500 text-sm">Karibu! Here's your shop overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={ShoppingBag} label="Today's Orders" value={data.today.orders} color="primary" />
        <StatCard icon={DollarSign} label="Today's Revenue" value={formatTZS(data.today.revenue)} color="fresh" />
        <StatCard icon={Clock} label="Active Orders" value={totalActive} color="amber" />
        <StatCard icon={TrendingUp} label="Total Earnings" value={formatTZS(data.total.earnings)} color="primary" />
      </div>

      {pendingOrders && parseInt(pendingOrders.count) > 0 && (
        <button onClick={() => navigate('/owner/orders')} className="w-full mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-2xl flex items-center justify-between hover:bg-amber-100 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center text-lg">📋</div>
            <div className="text-left">
              <p className="font-bold text-amber-800">{pendingOrders.count} new order{parseInt(pendingOrders.count) > 1 ? 's' : ''} waiting</p>
              <p className="text-xs text-amber-600">Tap to review and accept</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-amber-500" />
        </button>
      )}

      {data.status_counts.length > 0 && (
        <div className="card p-5 mb-6">
          <h2 className="font-semibold text-slate-800 mb-3">Order Status</h2>
          <div className="flex flex-wrap gap-2">
            {data.status_counts.map(({ status, count }) => {
              const info = getStatusInfo(status);
              return (
                <div key={status} className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl">
                  <span className="text-sm">{info.icon}</span>
                  <span className="text-xs font-medium text-slate-700">{info.label}</span>
                  <span className="text-xs font-bold text-slate-800 bg-white px-2 py-0.5 rounded-lg">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent Orders</h2>
          <button onClick={() => navigate('/owner/orders')} className="text-sm text-primary-600 font-semibold flex items-center gap-0.5 hover:underline">
            View All <ChevronRight size={14} />
          </button>
        </div>
        {data.recent_orders.length === 0 ? (
          <p className="p-5 text-slate-500 text-sm">No orders yet.</p>
        ) : (
          <div className="divide-y divide-slate-50">
            {data.recent_orders.map(order => {
              const statusInfo = getStatusInfo(order.status);
              return (
                <div key={order.id} className="p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-0.5">
                    {order.items?.slice(0, 3).map((item, i) => (
                      <span key={i} className="text-lg">{getClothingIcon(item.clothing_type)}</span>
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{order.order_number}</p>
                    <p className="text-xs text-slate-400">{order.customer_name || 'Customer'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-800 text-price">{formatTZS(order.total_amount)}</p>
                    <span className={`badge text-[10px] ${statusInfo.color === 'green' ? 'badge-green' : statusInfo.color === 'amber' ? 'badge-amber' : 'badge-blue'}`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function RegisterShopForm({ onSuccess }) {
  const [step, setStep] = useState(0); // 0=intro, 1=business info, 2=photos, 3=services, 4=review
  const [form, setForm] = useState({ name: '', address: '', region: '', phone: '', description: '', tin_number: '' });
  const [photos, setPhotos] = useState([]);
  const [services, setServices] = useState([]);
  const [svcForm, setSvcForm] = useState({ clothing_type: '', service_type: '', price: '' });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const regions = ['Dar es Salaam', 'Dodoma', 'Arusha', 'Mwanza', 'Mbeya', 'Morogoro', 'Tanga', 'Zanzibar', 'Iringa', 'Kilimanjaro'];
  const categories = getClothingCategories();
  const inputClass = "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500";

  async function handlePhotoUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    if (photos.length + files.length > 5) {
      setError('Maximum 5 photos allowed');
      return;
    }
    setUploading(true);
    setError('');
    try {
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) { setError('Each photo must be under 5MB'); continue; }
        const data = await apiUploadImage(file);
        setPhotos(prev => [...prev, data.url]);
      }
    } catch (err) { setError(err.message || 'Upload failed'); }
    finally { setUploading(false); if (fileInputRef.current) fileInputRef.current.value = ''; }
  }

  function addService() {
    if (!svcForm.clothing_type || !svcForm.service_type || !svcForm.price) {
      setError('Fill clothing type, service, and price'); return;
    }
    const exists = services.find(s => s.clothing_type === svcForm.clothing_type && s.service_type === svcForm.service_type);
    if (exists) { setError('This clothing + service combo already added'); return; }
    setError('');
    setServices(prev => [...prev, { ...svcForm, price: parseInt(svcForm.price) }]);
    setSvcForm({ clothing_type: '', service_type: '', price: '' });
  }

  function removeService(idx) {
    setServices(prev => prev.filter((_, i) => i !== idx));
  }

  function validateStep1() {
    if (!form.name || !form.address || !form.region || !form.phone) {
      setError('Please fill in all required fields'); return false;
    }
    setError(''); return true;
  }

  function validateStep3() {
    if (services.length === 0) {
      setError('Add at least one service with pricing'); return false;
    }
    setError(''); return true;
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      await apiCreateShop({ ...form, photos, services });
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to register shop');
    } finally {
      setSubmitting(false);
    }
  }

  const stepLabels = ['Info', 'Photos', 'Services', 'Review'];

  // Intro screen
  if (step === 0) {
    return (
      <div className="p-6 animate-fade-in flex items-center justify-center min-h-[70vh]">
        <div className="w-full max-w-md bg-slate-800 dark:bg-slate-900 rounded-3xl p-8 text-center shadow-xl">
          <div className="w-20 h-20 bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Store size={36} className="text-fresh-400" />
          </div>
          <h2 className="text-2xl font-bold text-white font-display mb-2">Set Up Your Shop</h2>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Register your laundry shop to start receiving orders. You'll add your business details, photos, and service prices.
          </p>
          <button onClick={() => setStep(1)}
            className="w-full py-3.5 bg-fresh-500 hover:bg-fresh-600 text-white font-bold rounded-2xl transition-colors text-sm flex items-center justify-center gap-2">
            <Store size={18} /> Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-6">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex-1">
              <div className={`h-1.5 rounded-full transition-colors ${i < step ? 'bg-fresh-500' : i === step ? 'bg-primary-500' : 'bg-slate-200 dark:bg-slate-700'}`} />
              <p className={`text-[10px] mt-1 font-semibold text-center ${i === step ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`}>{label}</p>
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">{error}</div>
        )}

        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1 font-display">Business Details</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Tell us about your laundry shop</p>
            <div className="card p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Store size={14} className="inline mr-1.5 text-slate-400" />Business Name *
                </label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Clean & Fresh Laundry" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <MapPin size={14} className="inline mr-1.5 text-slate-400" />Location / Address *
                </label>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Sinza, Kijitonyama" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <MapPin size={14} className="inline mr-1.5 text-slate-400" />Region *
                </label>
                <select value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className={inputClass}>
                  <option value="">Select region</option>
                  {regions.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Phone size={14} className="inline mr-1.5 text-slate-400" />Phone Number *
                </label>
                <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="e.g. 0712345678" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <Hash size={14} className="inline mr-1.5 text-slate-400" />TIN Number
                </label>
                <input type="text" value={form.tin_number} onChange={e => setForm({ ...form, tin_number: e.target.value })}
                  placeholder="e.g. 123-456-789" className={inputClass} />
                <p className="text-[11px] text-slate-400 mt-1">Tax Identification Number (optional but recommended)</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <FileText size={14} className="inline mr-1.5 text-slate-400" />Description
                </label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Tell customers about your services..." rows={3} className={inputClass + ' resize-none'} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setStep(0)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-2xl text-sm flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={() => validateStep1() && setStep(2)}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2">
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Photos */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1 font-display">Shop Photos</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Upload photos of your shop (max 5)</p>
            <div className="card p-5">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {photos.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <img src={url} alt={`Shop ${i + 1}`} className="w-full h-full object-cover" />
                    <button onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <X size={12} />
                    </button>
                  </div>
                ))}
                {photos.length < 5 && (
                  <button onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 flex flex-col items-center justify-center text-slate-400 hover:border-primary-400 hover:text-primary-500 transition-colors">
                    {uploading ? <Loader2 size={20} className="animate-spin" /> : <><Camera size={20} /><span className="text-[10px] mt-1 font-medium">Add Photo</span></>}
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
              <p className="text-[11px] text-slate-400">JPG, PNG or WebP. Max 5MB each.</p>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => { setError(''); setStep(1); }} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-2xl text-sm flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={() => { setError(''); setStep(3); }}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2">
                Next <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Services & Prices */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1 font-display">Services & Prices</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Add your services — prices differ by clothing type</p>

            {/* Add service form */}
            <div className="card p-4 mb-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Clothing Type</label>
                  <select value={svcForm.clothing_type} onChange={e => setSvcForm(prev => ({ ...prev, clothing_type: e.target.value }))} className={inputClass}>
                    <option value="">Select clothing...</option>
                    {categories.map(cat => (
                      <optgroup key={cat} label={cat}>
                        {CLOTHING_TYPES.filter(c => c.category === cat).map(c => (
                          <option key={c.id} value={c.id}>{c.icon} {c.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Service Type</label>
                  <select value={svcForm.service_type} onChange={e => setSvcForm(prev => ({ ...prev, service_type: e.target.value }))} className={inputClass}>
                    <option value="">Select service...</option>
                    {SERVICE_TYPES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Price (TZS)</label>
                  <input type="number" placeholder="e.g. 2500" value={svcForm.price}
                    onChange={e => setSvcForm(prev => ({ ...prev, price: e.target.value }))} className={inputClass} />
                </div>
                <button onClick={addService} className="w-full py-2.5 bg-fresh-50 dark:bg-fresh-900/30 text-fresh-700 dark:text-fresh-400 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-fresh-100 dark:hover:bg-fresh-900/50 transition-colors">
                  <Plus size={16} /> Add Service
                </button>
              </div>
            </div>

            {/* Services list */}
            {services.length > 0 && (
              <div className="card overflow-hidden mb-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-600 dark:text-slate-400">{services.length} service{services.length > 1 ? 's' : ''} added</p>
                </div>
                <div className="divide-y divide-slate-50 dark:divide-slate-800">
                  {services.map((svc, i) => {
                    const cloth = CLOTHING_TYPES.find(c => c.id === svc.clothing_type);
                    const svcType = SERVICE_TYPES.find(s => s.id === svc.service_type);
                    return (
                      <div key={i} className="flex items-center justify-between px-4 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-lg">{cloth?.icon || '👕'}</span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{cloth?.label || svc.clothing_type}</p>
                            <p className="text-[11px] text-slate-400">{svcType?.label || svc.service_type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-primary-600 dark:text-primary-400">{formatTZS(svc.price)}</span>
                          <button onClick={() => removeService(i)} className="w-7 h-7 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg flex items-center justify-center">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {services.length === 0 && (
              <div className="card p-6 text-center mb-4">
                <p className="text-3xl mb-2">🏷️</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">No services added yet. Add at least one to continue.</p>
              </div>
            )}

            <div className="flex gap-3 mt-5">
              <button onClick={() => { setError(''); setStep(2); }} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-2xl text-sm flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={() => validateStep3() && setStep(4)}
                className="flex-1 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2">
                Review <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {step === 4 && (
          <div className="animate-fade-in">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1 font-display">Review & Submit</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-5">Check your details before submitting</p>

            <div className="space-y-4">
              {/* Business info summary */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Business Details</h3>
                  <button onClick={() => setStep(1)} className="text-xs text-primary-600 dark:text-primary-400 font-semibold">Edit</button>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-slate-500">Name</span><span className="font-medium text-slate-800 dark:text-white">{form.name}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-medium text-slate-800 dark:text-white">{form.address}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Region</span><span className="font-medium text-slate-800 dark:text-white">{form.region}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="font-medium text-slate-800 dark:text-white">{form.phone}</span></div>
                  {form.tin_number && <div className="flex justify-between"><span className="text-slate-500">TIN</span><span className="font-medium text-slate-800 dark:text-white">{form.tin_number}</span></div>}
                </div>
              </div>

              {/* Photos summary */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Photos ({photos.length})</h3>
                  <button onClick={() => setStep(2)} className="text-xs text-primary-600 dark:text-primary-400 font-semibold">Edit</button>
                </div>
                {photos.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto">
                    {photos.map((url, i) => (
                      <img key={i} src={url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No photos uploaded</p>
                )}
              </div>

              {/* Services summary */}
              <div className="card p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Services ({services.length})</h3>
                  <button onClick={() => setStep(3)} className="text-xs text-primary-600 dark:text-primary-400 font-semibold">Edit</button>
                </div>
                <div className="space-y-1.5">
                  {services.map((svc, i) => {
                    const cloth = CLOTHING_TYPES.find(c => c.id === svc.clothing_type);
                    const svcType = SERVICE_TYPES.find(s => s.id === svc.service_type);
                    return (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">{cloth?.icon} {cloth?.label} — {svcType?.label}</span>
                        <span className="font-bold text-primary-600 dark:text-primary-400">{formatTZS(svc.price)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => { setError(''); setStep(3); }} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-2xl text-sm flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> Back
              </button>
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 py-3 bg-fresh-500 hover:bg-fresh-600 disabled:bg-slate-300 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2">
                {submitting ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {submitting ? 'Submitting...' : 'Submit for Approval'}
              </button>
            </div>

            <p className="text-xs text-slate-400 text-center mt-3">
              Your shop will be reviewed by admin before going live.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    primary: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
    fresh: 'bg-fresh-50 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400',
    amber: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  };
  return (
    <div className="card p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}><Icon size={18} /></div>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{value}</p>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{label}</p>
    </div>
  );
}