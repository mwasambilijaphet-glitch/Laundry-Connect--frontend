import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiGetReferralInfo, apiApplyReferralCode } from '../api/client';
import { formatTZS } from '../data/mockData';
import {
  ArrowLeft, Copy, Check, Share2, MessageCircle, Smartphone,
  Gift, Users, Wallet, Loader2, ChevronRight, Sparkles
} from 'lucide-react';

export default function ReferralPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [copied, setCopied] = useState(false);
  const [applyCode, setApplyCode] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState(null);

  useEffect(() => {
    fetchReferralInfo();
  }, []);

  async function fetchReferralInfo() {
    try {
      setLoading(true);
      const result = await apiGetReferralInfo();
      setData(result);
    } catch (err) {
      console.error('Failed to load referral info:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!data?.referral_code) return;
    try {
      await navigator.clipboard.writeText(data.referral_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = data.referral_code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function handleShareWhatsApp() {
    const msg = encodeURIComponent(t('shareMessage', data.referral_code));
    window.open(`https://wa.me/?text=${msg}`, '_blank');
  }

  function handleShareSMS() {
    const msg = encodeURIComponent(t('shareMessage', data.referral_code));
    window.open(`sms:?body=${msg}`, '_blank');
  }

  async function handleApplyCode() {
    if (!applyCode.trim()) return;
    setApplying(true);
    setApplyResult(null);
    try {
      const result = await apiApplyReferralCode(applyCode.trim());
      setApplyResult({ success: true, message: result.message });
      setApplyCode('');
      fetchReferralInfo(); // Refresh data
    } catch (err) {
      setApplyResult({ success: false, message: err.message });
    } finally {
      setApplying(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
        <Loader2 size={28} className="text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-fresh-500 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 pt-12 pb-8 px-6 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-fresh-400/10 rounded-full blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-white font-display">{t('referralTitle')}</h1>
              <p className="text-white/70 text-sm">{t('referralSubtitle')}</p>
            </div>
          </div>

          {/* Referral code card */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">{t('yourReferralCode')}</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-white/20 rounded-xl px-4 py-3 flex items-center justify-center">
                <span className="text-2xl font-bold tracking-[0.3em] text-white font-mono">
                  {data?.referral_code || '------'}
                </span>
              </div>
              <button
                onClick={handleCopy}
                className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                  copied ? 'bg-fresh-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            </div>
            <p className="text-xs text-white/50 mt-2 text-center">
              {copied ? t('codeCopied') : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-10 space-y-4 pb-28">
        {/* Share buttons */}
        <div className="card p-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold text-sm transition-colors active:scale-95"
            >
              <MessageCircle size={18} />
              {t('shareViaWhatsApp')}
            </button>
            <button
              onClick={handleShareSMS}
              className="flex items-center justify-center gap-2 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold text-sm transition-colors active:scale-95"
            >
              <Smartphone size={18} />
              {t('shareViaSMS')}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="card p-3 text-center">
            <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Wallet size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400 text-price">
              {formatTZS(data?.referral_balance || 0)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('referralBalance')}</p>
          </div>
          <div className="card p-3 text-center">
            <div className="w-10 h-10 bg-fresh-50 dark:bg-fresh-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users size={18} className="text-fresh-600 dark:text-fresh-400" />
            </div>
            <p className="text-lg font-bold text-fresh-600 dark:text-fresh-400">
              {data?.stats?.total_referrals || 0}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('friendsReferred')}</p>
          </div>
          <div className="card p-3 text-center">
            <div className="w-10 h-10 bg-accent-50 dark:bg-accent-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Gift size={18} className="text-accent-600 dark:text-accent-400" />
            </div>
            <p className="text-lg font-bold text-accent-600 dark:text-accent-400 text-price">
              {formatTZS(data?.stats?.total_earned || 0)}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">{t('totalEarned')}</p>
          </div>
        </div>

        {/* Apply a referral code */}
        <div className="card p-4">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <Gift size={16} className="text-accent-500" />
            {t('haveReferralCode')}
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder={t('enterReferralCode')}
              value={applyCode}
              onChange={e => setApplyCode(e.target.value.toUpperCase())}
              maxLength={10}
              className="flex-1 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm font-mono tracking-wider text-slate-800 dark:text-white placeholder:text-slate-400 uppercase focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleApplyCode}
              disabled={applying || !applyCode.trim()}
              className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold text-sm hover:bg-primary-700 disabled:opacity-50 transition-colors active:scale-95"
            >
              {applying ? <Loader2 size={16} className="animate-spin" /> : t('applyCode')}
            </button>
          </div>
          {applyResult && (
            <p className={`text-sm mt-2 font-medium ${applyResult.success ? 'text-fresh-600' : 'text-red-500'}`}>
              {applyResult.message}
            </p>
          )}
        </div>

        {/* How it works */}
        <div className="card p-4">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-white mb-3 flex items-center gap-2">
            <Sparkles size={16} className="text-accent-500" />
            {t('howItWorks')}
          </h3>
          <div className="space-y-3">
            {[
              { step: '1', text: t('step1'), icon: '📤' },
              { step: '2', text: t('step2'), icon: '👤' },
              { step: '3', text: t('step3'), icon: '🎉' },
            ].map(({ step, text, icon }) => (
              <div key={step} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">{icon}</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent referrals */}
        <div className="card overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-white flex items-center gap-2">
              <Users size={16} className="text-primary-500" />
              {t('recentReferrals')}
            </h3>
          </div>
          {(!data?.recent_referrals || data.recent_referrals.length === 0) ? (
            <div className="p-6 text-center">
              <Share2 size={28} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-400">{t('noReferralsYet')}</p>
            </div>
          ) : (
            data.recent_referrals.map((ref, i) => (
              <div key={i} className="flex items-center gap-3 p-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0">
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                    {ref.referred_name?.[0]?.toUpperCase() || '?'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{ref.referred_name}</p>
                  <p className="text-xs text-slate-400">
                    {t('joined')} {new Date(ref.joined_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-sm font-bold text-fresh-600 dark:text-fresh-400 text-price">
                  +{formatTZS(ref.reward_amount)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
