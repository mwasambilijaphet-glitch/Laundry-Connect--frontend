import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle({ variant = 'default' }) {
  const { lang, toggleLanguage } = useLanguage();

  if (variant === 'pill') {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-700 rounded-full text-xs font-bold transition-all hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95"
        title={lang === 'en' ? 'Badilisha lugha' : 'Switch language'}
      >
        <Globe size={14} className="text-slate-500 dark:text-slate-400" />
        <span className="text-slate-700 dark:text-slate-200">{lang === 'en' ? 'SW' : 'EN'}</span>
      </button>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleLanguage}
        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-90"
        title={lang === 'en' ? 'Badilisha lugha' : 'Switch language'}
      >
        <Globe size={18} />
      </button>
    );
  }

  if (variant === 'header') {
    return (
      <button
        onClick={toggleLanguage}
        className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
        title={lang === 'en' ? 'Badilisha lugha' : 'Switch language'}
      >
        <Globe size={16} className="text-slate-500 dark:text-slate-400" />
      </button>
    );
  }

  // default
  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-700 rounded-xl text-sm font-semibold transition-all hover:bg-slate-200 dark:hover:bg-slate-600 active:scale-95"
      title={lang === 'en' ? 'Badilisha lugha' : 'Switch language'}
    >
      <Globe size={16} className="text-slate-500 dark:text-slate-400" />
      <span className="text-slate-700 dark:text-slate-200">{lang === 'en' ? 'Swahili' : 'English'}</span>
    </button>
  );
}
