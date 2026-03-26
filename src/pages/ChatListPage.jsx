import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetConversations } from '../api/client';
import { DEMO_CONVERSATIONS } from '../data/demoData';
import { MessageCircle, Search, Loader2, ChevronRight, Phone } from 'lucide-react';

export default function ChatListPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchConversations();
    // Poll for new conversations every 10s
    const interval = setInterval(fetchConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  async function fetchConversations() {
    try {
      const data = await apiGetConversations();
      setConversations(data.conversations);
    } catch (err) {
      console.error('Failed to load conversations:', err);
      setConversations(DEMO_CONVERSATIONS);
    } finally {
      setLoading(false);
    }
  }

  const isCustomer = user?.role === 'customer';

  const filtered = conversations.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    if (isCustomer) return c.shop_name?.toLowerCase().includes(q);
    return c.customer_name?.toLowerCase().includes(q);
  });

  function formatTime(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return 'Now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString('en-US', { weekday: 'short' });
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 dark:from-slate-800 dark:to-slate-900 pt-12 pb-5 px-6 rounded-b-[28px] relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
        <div className="relative">
          <h1 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <MessageCircle size={22} /> Mazungumzo — Chats
          </h1>
          <p className="text-primary-200 dark:text-slate-400 text-sm mt-1">
            {isCustomer ? 'Chat with shop owners' : 'Chat with customers'}
          </p>
        </div>

        <div className="relative mt-4">
          <Search size={18} className="absolute left-4 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm rounded-2xl text-slate-800 dark:text-white placeholder-slate-400 shadow-glass focus:outline-none focus:ring-2 focus:ring-white/50 text-sm"
          />
        </div>
      </div>

      <div className="px-6 py-4 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 size={28} className="text-primary-500 animate-spin" />
            <p className="text-sm text-slate-400">Loading conversations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={36} className="text-primary-300 dark:text-primary-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">No conversations yet</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center max-w-xs">
              {isCustomer
                ? 'Visit a shop page and tap "Chat" to start a conversation with the shop owner.'
                : 'Customers will be able to chat with you about their orders.'}
            </p>
            {isCustomer && (
              <button
                onClick={() => navigate('/shops')}
                className="mt-4 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
              >
                Browse Shops
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(conv => {
              const name = isCustomer ? conv.shop_name : conv.customer_name;
              const phone = isCustomer ? conv.shop_phone : conv.customer_phone;
              const initials = (name || 'U').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              const unread = parseInt(conv.unread_count) || 0;

              return (
                <div key={conv.id} className="card-hover flex items-center gap-3.5 p-3.5 group">
                  <button
                    onClick={() => navigate(`/chat/${conv.id}`)}
                    className="flex-1 flex items-center gap-3.5 text-left min-w-0"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-fresh-500 rounded-2xl flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{initials}</span>
                      </div>
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-800">
                          {unread}
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-bold text-sm truncate ${unread > 0 ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-200'}`}>
                          {name}
                        </h3>
                        <span className={`text-[11px] flex-shrink-0 ml-2 ${unread > 0 ? 'text-primary-600 dark:text-primary-400 font-bold' : 'text-slate-400'}`}>
                          {formatTime(conv.last_message_at)}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 truncate ${unread > 0 ? 'text-slate-600 dark:text-slate-300 font-medium' : 'text-slate-400 dark:text-slate-500'}`}>
                        {conv.last_message || 'No messages yet'}
                      </p>
                    </div>
                  </button>

                  {/* Quick call button */}
                  {phone && (
                    <a
                      href={`tel:${phone}`}
                      className="w-10 h-10 bg-fresh-50 dark:bg-fresh-900/30 rounded-xl flex items-center justify-center flex-shrink-0 hover:bg-fresh-100 dark:hover:bg-fresh-900/50 transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <Phone size={16} className="text-fresh-600 dark:text-fresh-400" />
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
