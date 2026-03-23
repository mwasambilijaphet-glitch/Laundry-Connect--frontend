import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiGetMessages, apiSendMessage } from '../api/client';
import { ArrowLeft, Send, Phone, Loader2, CheckCheck, Clock, ShoppingBag } from 'lucide-react';

export default function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isCustomer = user?.role === 'customer';

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 3s
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchMessages() {
    try {
      const data = await apiGetMessages(id);
      setConversation(data.conversation);
      setMessages(data.messages);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic update
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      sender_id: user.id,
      sender_role: isCustomer ? 'customer' : 'owner',
      sender_name: user.full_name,
      content,
      message_type: 'text',
      is_read: false,
      created_at: new Date().toISOString(),
      _pending: true,
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const data = await apiSendMessage(id, content);
      // Replace optimistic message with real one
      setMessages(prev =>
        prev.map(m => m.id === optimisticMsg.id ? data.message : m)
      );
    } catch (err) {
      // Remove optimistic message on failure
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      setNewMessage(content); // Restore the message
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.toDateString() === d.toDateString();
    if (diff) return 'Today';
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (yesterday.toDateString() === d.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  // Group messages by date
  function getDateGroups() {
    const groups = [];
    let currentDate = '';
    messages.forEach(msg => {
      const date = new Date(msg.created_at).toDateString();
      if (date !== currentDate) {
        currentDate = date;
        groups.push({ type: 'date', date: msg.created_at });
      }
      groups.push({ type: 'message', ...msg });
    });
    return groups;
  }

  const chatPartnerName = isCustomer ? conversation?.shop_name : conversation?.customer_name;
  const chatPartnerPhone = isCustomer ? conversation?.shop_phone : conversation?.customer_phone;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <Loader2 size={28} className="text-primary-500 animate-spin" />
      </div>
    );
  }

  const dateGroups = getDateGroups();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
      {/* Chat Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-4 pt-12 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/chats')}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
          </button>

          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-slate-800 dark:text-white text-sm truncate">{chatPartnerName}</h2>
            <p className="text-xs text-slate-400 truncate">
              {isCustomer ? 'Shop Owner' : 'Customer'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {chatPartnerPhone && (
              <a
                href={`tel:${chatPartnerPhone}`}
                className="w-10 h-10 bg-fresh-50 dark:bg-fresh-900/30 rounded-xl flex items-center justify-center hover:bg-fresh-100 dark:hover:bg-fresh-900/50 transition-colors"
              >
                <Phone size={18} className="text-fresh-600 dark:text-fresh-400" />
              </a>
            )}
            {conversation?.order_id && (
              <button
                onClick={() => navigate(`/order/${conversation.order_id}`)}
                className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
              >
                <ShoppingBag size={18} className="text-primary-600 dark:text-primary-400" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Send size={24} className="text-primary-300" />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">No messages yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Say hello to start the conversation!</p>
          </div>
        )}

        {dateGroups.map((item, i) => {
          if (item.type === 'date') {
            return (
              <div key={`date-${i}`} className="flex justify-center py-3">
                <span className="px-3 py-1 bg-slate-200/80 dark:bg-slate-700/80 rounded-full text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {formatDate(item.date)}
                </span>
              </div>
            );
          }

          const isMine = item.sender_id === user.id;

          return (
            <div
              key={item.id}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}
            >
              <div
                className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
                  isMine
                    ? 'bg-primary-600 text-white rounded-br-md'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-bl-md shadow-sm border border-slate-100 dark:border-slate-700'
                } ${item._pending ? 'opacity-70' : ''}`}
              >
                {!isMine && (
                  <p className="text-[10px] font-bold text-primary-500 dark:text-primary-400 mb-0.5">
                    {item.sender_name}
                  </p>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{item.content}</p>
                <div className={`flex items-center justify-end gap-1 mt-1 ${isMine ? 'text-white/60' : 'text-slate-400'}`}>
                  <span className="text-[10px]">{formatTime(item.created_at)}</span>
                  {isMine && (
                    item._pending
                      ? <Clock size={10} />
                      : <CheckCheck size={12} className={item.is_read ? 'text-fresh-300' : ''} />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="sticky bottom-0 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 px-4 py-3 z-20">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 rounded-2xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none max-h-32"
              style={{ minHeight: '44px' }}
            />
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="w-11 h-11 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-300 dark:disabled:bg-slate-600 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 flex-shrink-0"
          >
            {sending ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
