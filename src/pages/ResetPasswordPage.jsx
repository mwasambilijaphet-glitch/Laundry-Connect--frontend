import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, Sun, Moon, Loader2, AlertCircle, KeyRound } from 'lucide-react';

import { API_BASE } from '../api/client';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isDark, toggleTheme } = useTheme();

  const [email] = useState(searchParams.get('email') || '');
  const [code] = useState(searchParams.get('code') || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email || !code) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [email, code]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      setError('Password must include uppercase, lowercase, and a number');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          otp_code: code,
          new_password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setStatus('success');
      setTimeout(() => navigate('/auth'), 3000);
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Something went wrong. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white dark:bg-slate-900 animate-fade-in">
        <div className="w-20 h-20 bg-fresh-100 dark:bg-fresh-900/30 rounded-full flex items-center justify-center mb-6 animate-bounce-in">
          <CheckCircle2 size={40} className="text-fresh-600 dark:text-fresh-400" />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-display mb-2">Password Reset!</h1>
        <p className="text-slate-500 dark:text-slate-400 text-center mb-2">Your password has been updated successfully.</p>
        <p className="text-sm text-slate-400 text-center">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-600 to-primary-700 dark:from-slate-800 dark:to-slate-900 animate-fade-in">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/auth')} className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium">
            <ArrowLeft size={18} /> Back to Login
          </button>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center"
          >
            {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-white" />}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <KeyRound size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white font-display">New Password</h1>
            <p className="text-primary-200 dark:text-slate-400 text-sm">Create a new password for your account</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-800 rounded-t-[28px] min-h-[60vh] px-6 pt-8 pb-12">
        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl mb-6">
            <AlertCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        )}

        {email && (
          <div className="mb-6 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <p className="text-xs text-slate-400 mb-0.5">Resetting password for</p>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{email}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                className="input-field pl-11 pr-12"
                disabled={!email || !code}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="input-field pl-11"
                disabled={!email || !code}
              />
            </div>
          </div>

          {password && (
            <div className="space-y-1.5">
              <p className={`text-xs flex items-center gap-1.5 ${password.length >= 6 ? 'text-fresh-600' : 'text-slate-400'}`}>
                <CheckCircle2 size={12} /> At least 6 characters
              </p>
              <p className={`text-xs flex items-center gap-1.5 ${password === confirmPassword && confirmPassword ? 'text-fresh-600' : 'text-slate-400'}`}>
                <CheckCircle2 size={12} /> Passwords match
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'loading' || !email || !code}
            className="btn-fresh w-full py-4 text-base disabled:opacity-50"
          >
            {status === 'loading' ? (
              <Loader2 className="animate-spin mx-auto" size={20} />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
