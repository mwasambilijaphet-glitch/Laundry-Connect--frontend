import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Store, Clock, ChevronDown, CheckCircle2 } from 'lucide-react';
import CITIES from '../data/cityData';
import { formatTZS } from '../data/mockData';
import { ScrollReveal } from '../hooks/useScrollReveal';

export default function CitySwitcher() {
  const [activeCity, setActiveCity] = useState('dar');
  const navigate = useNavigate();
  const city = CITIES.find(c => c.id === activeCity) || CITIES[0];

  return (
    <ScrollReveal>
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 dark:from-primary-700 dark:to-primary-800 p-5 text-center relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />
          <div className="relative">
            <p className="text-primary-200 text-xs font-medium flex items-center justify-center gap-1 mb-1">
              <MapPin size={12} /> Your Current City
            </p>
            <h3 className="text-white text-xl font-bold font-display">{city.name}</h3>
          </div>
        </div>

        {/* City pills */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1">
            {CITIES.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCity(c.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 active:scale-95 min-h-[44px] ${
                  activeCity === c.id
                    ? 'bg-primary-600 text-white shadow-md dark:bg-primary-500'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400'
                }`}
              >
                <span className="text-sm">{c.flag}</span>
                <span>{c.shortName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map area visual */}
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
            <MapPin size={10} /> Service Area
          </p>
          <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 p-4 flex flex-col items-center justify-center min-h-[100px]">
            <span className="text-3xl mb-2">{city.flag}</span>
            <p className="text-sm font-bold text-slate-800 dark:text-white">{city.description}</p>
            <p className="text-xs text-slate-400 mt-0.5">Showing available vendors</p>
          </div>
        </div>

        {/* Vendor count */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-lg flex items-center justify-center">
              <CheckCircle2 size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 dark:text-white">
                {city.vendorCount} vendors nearby
              </p>
              <p className="text-xs text-slate-400">Verified & ready to serve</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/nearby')}
            className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex items-center gap-1 px-3 py-2 rounded-lg bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors min-h-[44px]"
          >
            <MapPin size={12} /> Map View
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-700/50">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock size={12} className="text-primary-500" />
              <p className="text-[11px] text-slate-400 font-medium">Available tonight</p>
            </div>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400 tabular-nums">{city.availableTonight} vendors</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-600 text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Store size={12} className="text-primary-500" />
              <p className="text-[11px] text-slate-400 font-medium">Avg. per item</p>
            </div>
            <p className="text-lg font-bold text-primary-600 dark:text-primary-400 tabular-nums text-price">{formatTZS(city.avgPrice)}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="p-4">
          <button
            onClick={() => navigate(`/shops?city=${activeCity}`)}
            className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 text-white font-bold text-sm rounded-lg shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 min-h-[48px]"
          >
            Browse Vendors in {city.shortName}
            <ChevronDown size={16} className="rotate-[-90deg]" />
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
}
