import { createContext, useContext, useState, useCallback } from 'react';
import en from '../i18n/en';
import sw from '../i18n/sw';

const translations = { en, sw };
const STORAGE_KEY = 'lc_lang';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'en';
    } catch {
      return 'en';
    }
  });

  const toggleLanguage = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'sw' : 'en';
      try { localStorage.setItem(STORAGE_KEY, next); } catch {}
      return next;
    });
  }, []);

  const setLanguage = useCallback((newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      try { localStorage.setItem(STORAGE_KEY, newLang); } catch {}
    }
  }, []);

  const t = useCallback((key, ...args) => {
    const val = translations[lang]?.[key] ?? translations.en[key] ?? key;
    if (typeof val === 'function') return val(...args);
    return val;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
