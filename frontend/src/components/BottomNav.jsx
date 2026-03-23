import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Search, MessageCircle, ShoppingBag, User } from 'lucide-react';
import { apiGetUnreadCount } from '../api/client';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/shops', icon: Search, label: 'Explore' },
  { path: '/chats', icon: MessageCircle, label: 'Chats' },
  { path: '/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Poll unread count every 15s
  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  async function fetchUnread() {
    try {
      const data = await apiGetUnreadCount();
      setUnreadCount(data.count || 0);
    } catch {
      // silently fail
    }
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-nav md:hidden z-50 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path ||
            (path === '/home' && location.pathname === '/home') ||
            (path === '/shops' && location.pathname.startsWith('/shop')) ||
            (path === '/chats' && location.pathname.startsWith('/chat'));
          const showBadge = path === '/chats' && unreadCount > 0;

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
              <div className={`relative transition-all duration-300 ${isActive ? 'scale-110' : ''}`}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                {showBadge && (
                  <span className="absolute -top-1.5 -right-2.5 w-4.5 h-4.5 min-w-[18px] px-1 bg-accent-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-800 animate-bounce-in">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
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
