import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MapPin, ShoppingBag, User } from 'lucide-react';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/shops', icon: Search, label: 'Explore' },
  { path: '/nearby', icon: MapPin, label: 'Nearby' },
  { path: '/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav md:hidden z-50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path ||
            (path === '/home' && location.pathname === '/home') ||
            (path === '/shops' && location.pathname.startsWith('/shop'));
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`relative flex flex-col items-center justify-center gap-0.5 w-16 py-1.5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 active:scale-90'
              }`}
            >
              {isActive && (
                <div className="absolute -top-0.5 w-6 h-1 bg-primary-600 dark:bg-primary-400 rounded-full transition-all duration-300" />
              )}
              <div className={`transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] transition-all duration-300 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
