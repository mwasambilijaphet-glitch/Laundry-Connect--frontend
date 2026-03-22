import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Tag, ClipboardList, TrendingUp, Settings, LogOut, Sparkles } from 'lucide-react';

const navItems = [
  { path: '/owner', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/owner/services', icon: Tag, label: 'Services & Prices' },
  { path: '/owner/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/owner/earnings', icon: TrendingUp, label: 'Earnings' },
  { path: '/owner/settings', icon: Settings, label: 'Shop Settings' },
];

export default function OwnerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-slate-100 fixed h-full z-30">
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-primary-600" />
            </div>
            <h1 className="font-bold text-lg text-slate-800 font-display">
              Laundry<span className="text-fresh-500">Connect</span>
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 ml-10">Owner Dashboard</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path ||
              (path !== '/owner' && location.pathname.startsWith(path));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-2.5 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {(user?.full_name || 'O')[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-b border-slate-100">
        <div className="flex items-center gap-2 px-4 py-3">
          <Sparkles size={16} className="text-primary-600" />
          <h1 className="font-bold text-sm text-slate-800 font-display">
            Laundry<span className="text-fresh-500">Connect</span>
          </h1>
          <span className="badge-blue text-[10px] ml-1">Owner</span>
        </div>
        <div className="flex overflow-x-auto no-scrollbar px-2 pb-2.5 gap-1.5">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path ||
              (path !== '/owner' && location.pathname.startsWith(path));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
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
