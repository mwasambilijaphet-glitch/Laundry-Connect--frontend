import { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, apiRegister, apiVerifyOTP, apiGetMe, clearTokens, getToken } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app load, check if we have a saved token and fetch user
  useEffect(() => {
    async function checkAuth() {
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
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const register = async (formData) => {
    try {
      const data = await apiRegister(formData);
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const verifyOTP = async (email, otp_code) => {
    try {
      const data = await apiVerifyOTP(email, otp_code);
      setUser(data.user);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const logout = () => {
    clearTokens();
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
    <AuthContext.Provider value={{ user, isLoading, login, register, verifyOTP, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
