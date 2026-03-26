import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiVerifyOTP, apiGetMe, clearTokens, getToken, setTokens } from '../api/client';
import { DEMO_USER, isDemoMode, enableDemoMode, disableDemoMode, getDemoRole } from '../data/demoData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      // Check demo mode first
      if (isDemoMode()) {
        const role = getDemoRole();
        setUser({ ...DEMO_USER, role });
        setIsLoading(false);
        return;
      }

      const token = getToken();
      if (token) {
        try {
          const data = await apiGetMe();
          setUser(data.user);
        } catch {
          clearTokens();
        }
      }
      setIsLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (phone, password) => {
    try {
      const data = await apiLogin(phone, password);
      disableDemoMode();
      setUser(data.user);
      return { success: true };
    } catch (err) {
      // If backend is down, offer demo mode
      if (err.message.includes('Cannot connect') || err.message.includes('starting up') || err.message.includes('status 4') || err.message.includes('status 5')) {
        // Detect admin phone for demo mode admin access
        const isAdmin = phone === '0768188065' || phone === '+255768188065';
        const role = isAdmin ? 'admin' : 'customer';
        enableDemoMode(role);
        setUser({ ...DEMO_USER, full_name: isAdmin ? 'Admin' : 'User', phone, role });
        return { success: true, demo: true };
      }
      return { success: false, message: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const data = await apiRegister(formData);
      return { success: true, message: data.message };
    } catch (err) {
      if (err.message.includes('Cannot connect') || err.message.includes('starting up')) {
        enableDemoMode();
        setUser({ ...DEMO_USER, full_name: formData.full_name, phone: formData.phone, email: formData.email });
        return { success: true, demo: true };
      }
      return { success: false, message: err.message };
    }
  };

  const verifyOTP = async (email, otp_code) => {
    try {
      const data = await apiVerifyOTP(email, otp_code);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      if (isDemoMode()) {
        return { success: true };
      }
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    clearTokens();
    disableDemoMode();
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, verifyOTP, logout, isDemo: isDemoMode() }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
