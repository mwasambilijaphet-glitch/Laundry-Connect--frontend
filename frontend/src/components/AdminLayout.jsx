import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Store, Users, ClipboardList, CreditCard, LogOut, Sparkles } from 'lucide-react';

const navItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/shops', icon: Store, label: 'Shop Approvals' },
  { path: '/admin/users', icon: Users, label: 'Users' },
  { path: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/admin/transactions', icon: CreditCard, label: 'Transactions' },
];

export default function AdminLayout({ children }) {
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
      <aside className="hidden md:flex md:w-64 flex-col bg-slate-900 fixed h-full z-30">
        <div className="p-5 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600/20 rounded-xl flex items-center justify-center">
              <Sparkles size={16} className="text-primary-400" />
            </div>
            <h1 className="font-bold text-lg text-white font-display">
              Laundry<span className="text-fresh-400">Connect</span>
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1 ml-10">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path ||
              (path !== '/admin' && location.pathname.startsWith(path));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-300 font-semibold'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-2.5 mb-2">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-sm font-bold text-white">
              {(user?.full_name || 'A')[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.full_name}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-900/20 rounded-xl transition-colors duration-200">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-xl">
        <div className="flex items-center gap-2 px-4 py-3">
          <Sparkles size={16} className="text-primary-400" />
          <h1 className="font-bold text-sm text-white font-display">
            Laundry<span className="text-fresh-400">Connect</span>
          </h1>
          <span className="badge text-[10px] bg-red-500/20 text-red-300 ring-1 ring-red-500/20 ml-1">Admin</span>
        </div>
        <div className="flex overflow-x-auto no-scrollbar px-2 pb-2.5 gap-1.5">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path ||
              (path !== '/admin' && location.pathname.startsWith(path));
            return (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
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
