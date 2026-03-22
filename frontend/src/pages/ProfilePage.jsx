import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Phone, Mail, LogOut, ChevronRight, Bell, Shield, HelpCircle, Star, Package, MapPin, User, CheckCircle2, Sun, Moon } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { icon: Bell, label: 'Notifications', desc: 'Manage alerts', color: 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' },
    { icon: Shield, label: 'Privacy & Security', desc: 'Password, data', color: 'bg-fresh-50 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400' },
    { icon: HelpCircle, label: 'Help & Support', desc: 'FAQ, contact us', color: 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' },
    { icon: Star, label: 'Rate Laundry Connect', desc: 'Share your feedback', color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-600 to-primary-700 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 pt-12 pb-10 px-6 rounded-b-[28px] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
        <div className="relative flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white font-display">Wasifu Wangu — Profile</h1>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
          >
            {isDark ? <Sun size={18} className="text-accent-400" /> : <Moon size={18} className="text-white" />}
          </button>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="w-[72px] h-[72px] bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-2 ring-white/20">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <span className="text-3xl font-bold text-white">{(user?.full_name || 'G')[0]}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">{user?.full_name || 'Guest'}</h2>
              {user?.is_verified && (
                <CheckCircle2 size={16} className="text-fresh-400 fill-fresh-400/20" />
              )}
            </div>
            <p className="text-primary-200 dark:text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
              <Phone size={12} /> {user?.phone}
            </p>
            <p className="text-primary-200 dark:text-slate-400 text-sm flex items-center gap-1.5">
              <Mail size={12} /> {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-4 relative z-10">
        {/* Role card */}
        <div className="card-glass p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Account Type</p>
            <p className="font-semibold text-slate-800 dark:text-white capitalize mt-0.5">{user?.role || 'customer'}</p>
          </div>
          <span className="badge-blue capitalize">{user?.role}</span>
        </div>

        {/* Dark mode toggle card */}
        <div className="card p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              {isDark ? <Moon size={18} className="text-primary-400" /> : <Sun size={18} className="text-accent-500" />}
            </div>
            <div>
              <p className="font-medium text-sm text-slate-800 dark:text-white">Dark Mode</p>
              <p className="text-xs text-slate-400">{isDark ? 'On' : 'Off'}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative w-12 h-7 rounded-full transition-colors duration-300 ${isDark ? 'bg-primary-600' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${isDark ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
        </div>

        {/* Quick action grid */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/orders')} className="card p-4 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] group">
            <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-2.5 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50 transition-colors duration-300">
              <Package size={22} className="text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">My Orders</p>
            <p className="text-xs text-slate-400 mt-0.5">View history</p>
          </button>
          <button onClick={() => navigate('/shops')} className="card p-4 text-center hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.97] group">
            <div className="w-12 h-12 bg-fresh-50 dark:bg-fresh-900/30 rounded-2xl flex items-center justify-center mx-auto mb-2.5 group-hover:bg-fresh-100 dark:group-hover:bg-fresh-900/50 transition-colors duration-300">
              <MapPin size={22} className="text-fresh-600 dark:text-fresh-400" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-white">Find Shops</p>
            <p className="text-xs text-slate-400 mt-0.5">Browse nearby</p>
          </button>
        </div>

        {/* Menu */}
        <div className="card overflow-hidden">
          {menuItems.map(({ icon: Icon, label, desc, color }, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-3.5 p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-200 border-b border-slate-50 dark:border-slate-700 last:border-0 text-left group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} transition-transform duration-300 group-hover:scale-105`}>
                <Icon size={18} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-slate-800 dark:text-white">{label}</p>
                <p className="text-xs text-slate-400">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all duration-300" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 active:scale-[0.97]"
        >
          <LogOut size={18} />
          Ondoka — Log Out
        </button>

        <p className="text-center text-xs text-slate-400 pt-4 pb-8">
          Laundry Connect v1.1.0<br />
          <span className="text-slate-300 dark:text-slate-600">Built in Dodoma, Tanzania</span>
        </p>
      </div>
    </div>
  );
}
