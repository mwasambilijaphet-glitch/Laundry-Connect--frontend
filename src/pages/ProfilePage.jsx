import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { apiUploadImage, apiUpdateProfile } from '../api/client';
import {
  Phone, Mail, LogOut, ChevronRight, Bell, Shield, HelpCircle, Star,
  Package, MapPin, User, CheckCircle2, Sun, Moon, Camera, Edit3,
  Globe, Heart, Award, Zap, Settings, Info, CreditCard, Lock, Gift, Loader2,
  Save, X
} from 'lucide-react';
import { LogoIcon } from '../components/Logo';
import LanguageToggle from '../components/LanguageToggle';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t, lang, toggleLanguage } = useLanguage();
  const [showFullInfo, setShowFullInfo] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', email: '' });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const avatarInputRef = useRef(null);

  const startEditing = () => {
    setEditForm({
      full_name: user?.full_name || '',
      phone: user?.phone || '',
      email: user?.email || '',
    });
    setEditError('');
    setEditSuccess(false);
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.full_name.trim()) {
      setEditError('Name is required');
      return;
    }
    try {
      setEditSaving(true);
      setEditError('');
      const updates = {};
      if (editForm.full_name !== user?.full_name) updates.full_name = editForm.full_name;
      if (editForm.phone !== user?.phone) updates.phone = editForm.phone;
      if (editForm.email !== user?.email) updates.email = editForm.email;

      if (Object.keys(updates).length === 0) {
        setEditing(false);
        return;
      }

      await apiUpdateProfile(updates);
      await refreshUser();
      setEditSuccess(true);
      setEditing(false);
      setTimeout(() => setEditSuccess(false), 3000);
    } catch (err) {
      setEditError(err.message || 'Failed to update profile');
    } finally {
      setEditSaving(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const uploadData = await apiUploadImage(file);
      await apiUpdateProfile({ avatar_url: uploadData.url });
      await refreshUser();
    } catch (err) {
      alert(err.message || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const firstName = user?.full_name?.split(' ')[0] || 'Guest';
  const initials = (user?.full_name || 'G').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'New Member';

  const quickActions = [
    { icon: Package, label: t('myOrders'), desc: t('trackOrder'), path: '/orders', color: 'from-primary-500 to-primary-600', iconColor: 'text-primary-100' },
    { icon: MapPin, label: t('nearbyDryCleaners'), desc: t('findShopsNearYou'), path: '/nearby', color: 'from-fresh-500 to-fresh-600', iconColor: 'text-fresh-100' },
    { icon: CreditCard, label: t('paymentTitle'), desc: t('adminTransactions'), path: '/orders', color: 'from-accent-500 to-accent-600', iconColor: 'text-accent-100' },
    { icon: Heart, label: t('navExplore'), desc: t('viewAll'), path: '/shops', color: 'from-pink-500 to-pink-600', iconColor: 'text-pink-100' },
  ];

  const settingsMenu = [
    { icon: Bell, label: t('notifications'), color: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' },
    { icon: Lock, label: t('profile'), color: 'bg-fresh-50 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400' },
    { icon: Globe, label: t('language'), desc: lang === 'en' ? 'English → Swahili' : 'Kiswahili → English', color: 'bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400', action: toggleLanguage },
    { icon: Settings, label: t('darkMode'), color: 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-400' },
  ];

  const supportMenu = [
    { icon: HelpCircle, label: t('helpSupport'), color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
    { icon: Star, label: 'Rate Laundry Connect', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
    { icon: Info, label: t('aboutUs'), desc: 'v2.0.0 — Dodoma, Tanzania', color: 'bg-cyan-50 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400' },
  ];

  return (
    <div className="animate-fade-in pb-4">
      {/* Header — curved gradient */}
      <div className="relative">
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-fresh-500 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 pt-12 pb-20 px-6 rounded-b-[36px] relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
          <div className="absolute top-10 -left-10 w-40 h-40 bg-fresh-400/10 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-10 w-32 h-32 bg-accent-400/10 rounded-full blur-xl" />

          {/* Top bar */}
          <div className="relative flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <LogoIcon size={28} />
              <span className="text-sm font-bold text-white/80">{t('profile')}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
              >
                {isDark ? <Sun size={18} className="text-accent-400" /> : <Moon size={18} className="text-white" />}
              </button>
            </div>
          </div>

          {/* Avatar & name */}
          <div className="relative flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center ring-2 ring-white/30 overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-white">{initials}</span>
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarUpload}
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-fresh-500 rounded-lg flex items-center justify-center shadow-lg ring-2 ring-white dark:ring-slate-800 group-hover:scale-110 transition-transform disabled:opacity-50"
              >
                {uploadingAvatar ? <Loader2 size={13} className="text-white animate-spin" /> : <Camera size={13} className="text-white" />}
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{user?.full_name || 'Guest'}</h2>
                {user?.is_verified && (
                  <div className="w-5 h-5 bg-fresh-400 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-white" />
                  </div>
                )}
              </div>
              <p className="text-white/70 text-sm mt-0.5 capitalize">{user?.role || 'customer'}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-white/50 flex items-center gap-1">
                  <Award size={10} /> Member since {memberSince}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating contact card */}
        <div className="mx-6 -mt-10 relative z-10">
          <div className="card p-4 shadow-elevated">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {editing ? 'Edit Profile' : 'Contact Info'}
              </h3>
              {!editing ? (
                <button
                  onClick={startEditing}
                  className="text-xs text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1 hover:underline"
                >
                  <Edit3 size={12} /> Edit
                </button>
              ) : (
                <button
                  onClick={() => { setEditing(false); setEditError(''); }}
                  className="text-xs text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1"
                >
                  <X size={12} /> Cancel
                </button>
              )}
            </div>

            {editError && (
              <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-xs">
                {editError}
              </div>
            )}

            {editSuccess && (
              <div className="mb-3 p-2 bg-fresh-50 dark:bg-fresh-900/20 border border-fresh-200 dark:border-fresh-800 rounded-lg text-fresh-700 dark:text-fresh-400 text-xs flex items-center gap-1.5 animate-slide-up">
                <CheckCircle2 size={14} /> Profile updated!
              </div>
            )}

            {editing ? (
              <div className="space-y-3">
                {/* Name */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                      <User size={16} className="text-slate-500 dark:text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={editForm.full_name}
                      onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                {/* Phone */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Phone</label>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone size={16} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="0768 123 456"
                    />
                  </div>
                </div>
                {/* Email */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Email</label>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 bg-fresh-50 dark:bg-fresh-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail size={16} className="text-fresh-600 dark:text-fresh-400" />
                    </div>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                      className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                {/* Save button */}
                <button
                  onClick={handleSaveProfile}
                  disabled={editSaving}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-bold rounded-xl transition-all active:scale-[0.97] disabled:opacity-50"
                >
                  {editSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                  {editSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User size={16} className="text-slate-500 dark:text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400">Name</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.full_name || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400">Phone</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.phone || '—'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-fresh-50 dark:bg-fresh-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={16} className="text-fresh-600 dark:text-fresh-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-slate-400">Email</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.email || '—'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 mt-5 space-y-5">
        {/* Dark mode toggle */}
        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 dark:from-amber-400 dark:to-accent-500 flex items-center justify-center shadow-sm">
              {isDark ? <Sun size={18} className="text-white" /> : <Moon size={18} className="text-white" />}
            </div>
            <div>
              <p className="font-semibold text-sm text-slate-800 dark:text-white">{t('darkMode')}</p>
              <p className="text-xs text-slate-400">{isDark ? 'Enabled — easy on the eyes' : 'Disabled — bright & clean'}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${isDark ? 'bg-primary-600' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${isDark ? 'translate-x-7' : 'translate-x-1'}`}>
              {isDark ? <Moon size={12} className="text-primary-600" /> : <Sun size={12} className="text-amber-500" />}
            </span>
          </button>
        </div>

        {/* Quick actions */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-1">Quick Actions</h3>
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map(({ icon: Icon, label, desc, path, color, iconColor }, i) => (
              <button
                key={i}
                onClick={() => navigate(path)}
                className="flex flex-col items-center group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center shadow-card mb-2 group-hover:shadow-card-hover group-hover:-translate-y-1 transition-all duration-300 group-active:scale-90`}>
                  <Icon size={22} className={iconColor} />
                </div>
                <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 text-center leading-tight">{label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Referral banner */}
        <button
          onClick={() => navigate('/referrals')}
          className="card p-4 w-full text-left group"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Gift size={22} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm text-slate-800 dark:text-white">{t('referralTitle')}</p>
              <p className="text-xs text-slate-400 mt-0.5">{t('referralSubtitle')}</p>
            </div>
            <ChevronRight size={18} className="text-slate-300 dark:text-slate-600 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
          </div>
        </button>

        {/* Account type badge */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-fresh-100 dark:from-primary-900/40 dark:to-fresh-900/40 rounded-xl flex items-center justify-center">
                <Zap size={18} className="text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="font-semibold text-sm text-slate-800 dark:text-white">Account Type</p>
                <p className="text-xs text-slate-400 capitalize">{user?.role || 'customer'} account</p>
              </div>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              user?.role === 'admin'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : user?.role === 'owner'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            }`}>
              {user?.role === 'admin' ? 'Admin' : user?.role === 'owner' ? 'Shop Owner' : 'Customer'}
            </span>
          </div>
        </div>

        {/* Settings menu */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-1">Settings</h3>
          <div className="card overflow-hidden">
            {settingsMenu.map(({ icon: Icon, label, desc, color, action }, i) => (
              <button
                key={i}
                onClick={action}
                className="w-full flex items-center gap-3.5 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 border-b border-slate-50 dark:border-slate-700/50 last:border-0 text-left group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} transition-transform duration-300 group-hover:scale-105`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Support menu */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3 px-1">Support</h3>
          <div className="card overflow-hidden">
            {supportMenu.map(({ icon: Icon, label, desc, color }, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3.5 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 border-b border-slate-50 dark:border-slate-700/50 last:border-0 text-left group"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} transition-transform duration-300 group-hover:scale-105`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 active:scale-[0.97] border border-red-100 dark:border-red-900/30"
        >
          <LogOut size={18} />
          {t('logout')}
        </button>

        {/* Footer branding */}
        <div className="text-center pt-4 pb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <LogoIcon size={20} />
            <span className="text-sm font-bold text-slate-300 dark:text-slate-600">
              Laundry<span className="text-fresh-400 dark:text-fresh-600">Connect</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 dark:text-slate-600">
            v2.0.0 — Built with love in Dodoma, Tanzania
          </p>
        </div>
      </div>
    </div>
  );
}
