import { useState, useEffect } from 'react';
import { Loader2, MessageCircle, Wifi, WifiOff, QrCode, Send, RefreshCw, Users } from 'lucide-react';
import { getToken, API_BASE } from '../../api/client';

export default function AdminWhatsApp() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sendPhone, setSendPhone] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState('');

  async function fetchStatus() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/whatsapp/status`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, []);

  async function handleSend() {
    if (!sendPhone || !sendMessage) return;
    setSending(true);
    setSendResult('');
    try {
      const res = await fetch(`${API_BASE}/whatsapp/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ phone: sendPhone, message: sendMessage }),
      });
      const data = await res.json();
      setSendResult(data.success ? 'Sent!' : 'Failed to send');
      if (data.success) setSendMessage('');
    } catch {
      setSendResult('Error sending message');
    } finally {
      setSending(false);
    }
  }

  if (loading && !status) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="text-primary-500 animate-spin" />
      </div>
    );
  }

  const isConnected = status?.status === 'connected';
  const isConnecting = status?.status === 'connecting';

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display flex items-center gap-2">
            <MessageCircle size={24} className="text-green-500" /> WhatsApp Bot
          </h1>
          <p className="text-slate-500 text-sm">Manage WhatsApp ordering bot</p>
        </div>
        <button onClick={fetchStatus} className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors">
          <RefreshCw size={16} className="text-slate-600" />
        </button>
      </div>

      {/* Connection Status */}
      <div className={`card p-5 mb-4 border-2 ${isConnected ? 'border-green-200 bg-green-50' : isConnecting ? 'border-amber-200 bg-amber-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center gap-3">
          {isConnected ? (
            <Wifi size={24} className="text-green-600" />
          ) : (
            <WifiOff size={24} className={isConnecting ? 'text-amber-600' : 'text-red-600'} />
          )}
          <div>
            <h2 className="font-bold text-lg">
              {isConnected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
            </h2>
            <p className="text-sm text-slate-600">
              {isConnected
                ? 'Bot is running and receiving messages'
                : isConnecting
                ? 'Scan QR code below with your phone'
                : 'Set WHATSAPP_BOT=true in Render env vars to enable'}
            </p>
          </div>
          {isConnected && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white rounded-xl">
              <Users size={14} className="text-slate-500" />
              <span className="text-sm font-semibold text-slate-700">{status?.activeSessions || 0} active chats</span>
            </div>
          )}
        </div>
      </div>

      {/* QR Code */}
      {isConnecting && status?.qr && (
        <div className="card p-6 mb-4 text-center">
          <QrCode size={32} className="text-primary-600 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 mb-2">Scan QR Code</h3>
          <p className="text-sm text-slate-500 mb-4">
            Open WhatsApp on your phone → Settings → Linked Devices → Link a Device
          </p>
          <div className="bg-white p-4 rounded-xl inline-block border border-slate-200">
            <pre className="text-xs font-mono text-slate-800 leading-tight whitespace-pre">{status.qr}</pre>
          </div>
          <p className="text-xs text-slate-400 mt-3">QR code refreshes automatically. Check the terminal for a scannable version.</p>
        </div>
      )}

      {/* How it works */}
      <div className="card p-5 mb-4">
        <h3 className="font-bold text-slate-800 mb-3">How it works</h3>
        <div className="space-y-3 text-sm text-slate-600">
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
            <p>Customer sends any message to your WhatsApp number</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
            <p>Bot shows areas → shops → services menu (Swahili + English)</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
            <p>Customer picks items, enters address, confirms order</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">4</span>
            <p>Order is created in the system + shop owner gets WhatsApp notification</p>
          </div>
        </div>
      </div>

      {/* Send Message */}
      {isConnected && (
        <div className="card p-5">
          <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
            <Send size={16} className="text-primary-600" /> Send Message
          </h3>
          <div className="space-y-3">
            <input
              type="tel"
              placeholder="Phone number (0754 123 456)"
              value={sendPhone}
              onChange={e => setSendPhone(e.target.value)}
              className="input-field"
            />
            <textarea
              placeholder="Message..."
              value={sendMessage}
              onChange={e => setSendMessage(e.target.value)}
              rows={3}
              className="input-field resize-none"
            />
            <div className="flex items-center gap-3">
              <button
                onClick={handleSend}
                disabled={sending || !sendPhone || !sendMessage}
                className="btn-primary px-6 disabled:opacity-50"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : 'Send'}
              </button>
              {sendResult && (
                <span className={`text-sm font-semibold ${sendResult === 'Sent!' ? 'text-green-600' : 'text-red-500'}`}>
                  {sendResult}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
