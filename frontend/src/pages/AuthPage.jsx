import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiRegister } from '../api/client';
import { Sparkles, ArrowLeft, Eye, EyeOff, Loader2, Phone, Mail, Lock, User, MessageCircle, Smartphone, Sun, Moon } from 'lucide-react';

const API_BASE = import.meta.env.PROD
  ? 'https://laundry-connect-backend.onrender.com/api'
  : '/api';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, verifyOTP } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [mode, setMode] = useState('login'); // login | register | otp | forgot | reset
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPurpose, setOtpPurpose] = useState('verify'); // verify | reset
  const [otpChannel, setOtpChannel] = useState('sms'); // sms | whatsapp

  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    password: '',
    role: 'customer',
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.phone || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await login(form.phone, form.password);
    setLoading(false);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.full_name || !form.phone || !form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const data = await apiRegister({ ...form, otp_channel: otpChannel });
      setOtpEmail(form.email);
      setOtpPurpose('verify');
      setOtp(['', '', '', '', '', '']);
      setMode('otp');
      setSuccess(
        otpChannel === 'whatsapp'
          ? 'Check your WhatsApp for the verification code'
          : otpChannel === 'sms'
            ? 'Check your phone for the OTP'
            : data.message || 'Check your email for the OTP'
      );
    } catch (err) {
      setError(err.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email) {
      setError('Please enter your email');
      return;
    }
    setLoading(true);
    try {
      await fetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email }),
      });
      setOtpEmail(form.email);
      setOtpPurpose('reset');
      setOtp(['', '', '', '', '', '']);
      setMode('otp');
      setSuccess('Password reset code sent to your email & phone');
    } catch (err) {
      setError('Failed to send reset code');
    }
    setLoading(false);
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOTPKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleOTPPaste = (e) => {
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      e.preventDefault();
      const digits = pasted.split('');
      setOtp(digits);
      document.getElementById('otp-5')?.focus();
    }
  };

  const handleOTPSubmit = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (otpPurpose === 'verify') {
      setLoading(true);
      const result = await verifyOTP(otpEmail, code);
      setLoading(false);
      if (result.success) {
        navigate('/home');
      } else {
        setError(result.message || 'Invalid OTP');
      }
    } else {
      setMode('reset');
      setError('');
      setSuccess('OTP verified! Enter your new password.');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: otpEmail,
          otp_code: otp.join(''),
          new_password: newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Password reset! You can now log in.');
        setMode('login');
        setForm(prev => ({ ...prev, phone: otpEmail, password: '' }));
      } else {
        setError(data.message || 'Reset failed');
      }
    } catch (err) {
      setError('Failed to reset password');
    }
    setLoading(false);
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);
    try {
      const endpoint = otpPurpose === 'reset' ? '/auth/forgot-password' : '/auth/resend-otp';
      const body = otpPurpose === 'reset'
        ? { email: otpEmail }
        : { email: otpEmail, otp_channel: otpChannel };
      await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setSuccess('New OTP sent');
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      setError('Failed to resend OTP');
    }
    setLoading(false);
  };

  const getTitle = () => {
    if (mode === 'login') return 'Karibu Tena!';
    if (mode === 'register') return 'Jisajili';
    if (mode === 'forgot') return 'Forgot Password';
    if (mode === 'otp') return 'Enter Code';
    if (mode === 'reset') return 'New Password';
    return '';
  };

  const getSubtitle = () => {
    if (mode === 'login') return 'Log in to continue';
    if (mode === 'register') return 'Create your account';
    if (mode === 'forgot') return 'We\'ll send a reset code to your email & phone';
    if (mode === 'otp') return otpChannel === 'whatsapp'
      ? `Enter the 6-digit code sent to your WhatsApp`
      : otpChannel === 'sms'
        ? `Enter the 6-digit code sent via SMS`
        : `Enter the 6-digit code sent to ${otpEmail}`;
    if (mode === 'reset') return 'Choose a new password';
    return '';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-500 pt-12 pb-20 px-6 rounded-b-3xl relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/5 rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-fresh-500/10 rounded-full blur-xl" />

        <div className="relative flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (mode === 'otp') setMode(otpPurpose === 'reset' ? 'forgot' : 'register');
              else if (mode === 'reset') setMode('otp');
              else if (mode === 'forgot') setMode('login');
              else navigate('/');
            }}
            className="text-white/80 hover:text-white flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={18} /> Back
          </button>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
          >
            {isDark ? <Sun size={18} className="text-accent-400" /> : <Moon size={18} className="text-white" />}
          </button>
        </div>
        <div className="relative flex items-center gap-3 mb-2">
          <Sparkles className="text-white" size={24} />
          <h1 className="text-2xl font-bold text-white font-display">{getTitle()}</h1>
        </div>
        <p className="text-primary-100 relative">{getSubtitle()}</p>
      </div>

      {/* Form */}
      <div className="px-6 -mt-10">
        <div className="card p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">{error}</div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-fresh-50 dark:bg-fresh-900/30 border border-fresh-200 dark:border-fresh-800 rounded-xl text-fresh-700 dark:text-fresh-400 text-sm font-medium">{success}</div>
          )}

          {/* OTP Screen */}
          {mode === 'otp' && (
            <div className="space-y-6">
              <div className="flex justify-center gap-3" onPaste={handleOTPPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOTPChange(i, e.target.value)}
                    onKeyDown={e => handleOTPKeyDown(i, e)}
                    className="w-12 h-14 text-center text-2xl font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-800 outline-none transition-all"
                  />
                ))}
              </div>
              <button onClick={handleOTPSubmit} disabled={loading} className="btn-primary w-full py-4">
                {loading ? <Loader2 className="animate-spin" size={20} /> : (otpPurpose === 'reset' ? 'Verify Code' : 'Verify & Continue')}
              </button>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Didn't receive it?{' '}
                <button onClick={handleResendOTP} disabled={loading} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  Resend Code
                </button>
              </p>
            </div>
          )}

          {/* Reset Password Screen */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(''); }}
                    className="input-field pl-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Reset Password'}
              </button>
            </form>
          )}

          {/* Forgot Password Screen */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={form.email}
                    onChange={e => handleChange('email', e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                A reset code will be sent to your email and phone automatically.
              </p>
              <button type="submit" disabled={loading} className="btn-primary w-full py-4">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Send Reset Code'}
              </button>
              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Remember your password?{' '}
                <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                  Log In
                </button>
              </p>
            </form>
          )}

          {/* Login Screen */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Phone Number or Email</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="0754 123 456 or email"
                    value={form.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Password</label>
                  <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }} className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={e => handleChange('password', e.target.value)}
                    className="input-field pl-10 pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Ingia — Log In'}
              </button>
            </form>
          )}

          {/* Register Screen */}
          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input type="text" placeholder="e.g. Japhet Masanja" value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input type="email" placeholder="you@email.com" value={form.email} onChange={e => handleChange('email', e.target.value)} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">I want to...</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'customer', label: 'Get my laundry done', icon: '👕' },
                    { value: 'owner', label: 'List my laundry shop', icon: '🏪' },
                  ].map(opt => (
                    <button key={opt.value} type="button" onClick={() => handleChange('role', opt.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        form.role === opt.value
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                          : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}>
                      <span className="text-2xl">{opt.icon}</span>
                      <p className="text-xs font-medium mt-1">{opt.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input type="tel" placeholder="0754 123 456" value={form.phone} onChange={e => handleChange('phone', e.target.value)} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="At least 6 characters" value={form.password} onChange={e => handleChange('password', e.target.value)} className="input-field pl-10 pr-10" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* OTP Channel Selector */}
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">Get OTP via</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOtpChannel('sms')}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      otpChannel === 'sms'
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Smartphone size={18} />
                    <span className="text-sm font-medium">SMS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOtpChannel('whatsapp')}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                      otpChannel === 'whatsapp'
                        ? 'border-fresh-500 bg-fresh-50 dark:bg-fresh-900/30 text-fresh-700 dark:text-fresh-300'
                        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium">WhatsApp</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1.5">
                  Choose how you'd like to receive your verification code
                </p>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 mt-2">
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Jisajili — Sign Up'}
              </button>
            </form>
          )}

          {/* Toggle login/register */}
          {(mode === 'login' || mode === 'register') && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-4">
              {mode === 'login' ? (
                <>Don't have an account? <button onClick={() => { setMode('register'); setError(''); setSuccess(''); }} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign Up</button></>
              ) : (
                <>Already have an account? <button onClick={() => { setMode('login'); setError(''); setSuccess(''); }} className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Log In</button></>
              )}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
