import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiOwnerGetShop } from '../api/client';
import LanguageToggle from './LanguageToggle';
import { LayoutDashboard, Tag, ClipboardList, TrendingUp, Settings, LogOut, Sparkles, MessageCircle, Lock, Sun, Moon } from 'lucide-react';

const navItems = [
  { path: '/owner', icon: LayoutDashboard, label: 'Dashboard', alwaysEnabled: true },
  { path: '/owner/services', icon: Tag, label: 'Services & Prices' },
  { path: '/owner/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/owner/earnings', icon: TrendingUp, label: 'Earnings' },
  { path: '/owner/chats', icon: MessageCircle, label: 'Messages' },
  { path: '/owner/settings', icon: Settings, label: 'Shop Settings' },
];

export default function OwnerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [hasShop, setHasShop] = useState(true); // default true to avoid flash

  useEffect(() => {
    apiOwnerGetShop()
      .then(res => setHasShop(!!res.shop))
      .catch(() => setHasShop(false));
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 fixed h-full z-30">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="font-bold text-lg text-slate-800 dark:text-white font-display">
              Laundry<span className="text-fresh-500">Connect</span>
            </h1>
          </div>
          <div className="flex items-center justify-between mt-2 ml-10">
            <p className="text-xs text-slate-400">Owner Dashboard</p>
            <div className="flex items-center gap-1">
              <LanguageToggle variant="icon" />
              <button onClick={toggleTheme}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ path, icon: Icon, label, alwaysEnabled }) => {
            const isActive = location.pathname === path ||
              (path !== '/owner' && location.pathname.startsWith(path));
            const disabled = !hasShop && !alwaysEnabled;
            return (
              <button
                key={path}
                onClick={() => !disabled && navigate(path)}
                disabled={disabled}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  disabled
                    ? 'opacity-35 cursor-not-allowed text-slate-400'
                    : isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-semibold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <Icon size={18} />
                {label}
                {disabled && <Lock size={12} className="ml-auto text-slate-300" />}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 px-4 py-2.5 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {(user?.full_name || 'O')[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors duration-200">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 px-4 py-3">
          <Sparkles size={16} className="text-primary-600 dark:text-primary-400" />
          <h1 className="font-bold text-sm text-slate-800 dark:text-white font-display">
            Laundry<span className="text-fresh-500">Connect</span>
          </h1>
          <span className="badge-blue text-[10px] ml-1">Owner</span>
          <div className="ml-auto flex items-center gap-1">
            <LanguageToggle variant="icon" />
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
        <div className="flex overflow-x-auto no-scrollbar px-2 pb-2.5 gap-1.5">
          {navItems.map(({ path, icon: Icon, label, alwaysEnabled }) => {
            const isActive = location.pathname === path ||
              (path !== '/owner' && location.pathname.startsWith(path));
            const disabled = !hasShop && !alwaysEnabled;
            return (
              <button
                key={path}
                onClick={() => !disabled && navigate(path)}
                disabled={disabled}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  disabled
                    ? 'opacity-35 cursor-not-allowed bg-slate-100 dark:bg-slate-700 text-slate-400'
                    : isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <Icon size={13} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-24 md:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
