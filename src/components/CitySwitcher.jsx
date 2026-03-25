import { useState } from 'react';
import { MapPin, Users, TrendingUp, Store } from 'lucide-react';
import CITIES from '../data/cityData';
import { formatTZS } from '../data/mockData';
import { ScrollReveal } from '../hooks/useScrollReveal';

export default function CitySwitcher({ onCityChange }) {
  const [activeCity, setActiveCity] = useState('dar');
  const city = CITIES.find(c => c.id === activeCity) || CITIES[0];

  function handleSelect(id) {
    setActiveCity(id);
    onCityChange?.(id);
  }

  return (
    <ScrollReveal>
      <div>
        {/* City pills */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin size={16} className="text-primary-500 flex-shrink-0" />
          <h2 className="section-title !mb-0">Miji — Cities</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pb-3">
          {CITIES.map(c => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 active:scale-95 ${
                activeCity === c.id
                  ? 'bg-primary-600 text-white shadow-glow-primary dark:bg-primary-500'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 shadow-card hover:shadow-card-hover hover:-translate-y-0.5'
              }`}
            >
              <span className="text-base">{c.flag}</span>
              <span>{c.shortName}</span>
            </button>
          ))}
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2.5 mt-1">
          <div className="card p-3 text-center">
            <div className="w-9 h-9 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Store size={16} className="text-primary-600 dark:text-primary-400" />
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-white tabular-nums">{city.vendorCount}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Vendors</p>
          </div>

          <div className="card p-3 text-center">
            <div className="w-9 h-9 bg-fresh-50 dark:bg-fresh-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <TrendingUp size={16} className="text-fresh-600 dark:text-fresh-400" />
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-white tabular-nums text-price">{formatTZS(city.avgPrice)}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Avg Price</p>
          </div>

          <div className="card p-3 text-center">
            <div className="w-9 h-9 bg-accent-50 dark:bg-accent-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users size={16} className="text-accent-600 dark:text-accent-400" />
            </div>
            <p className="text-lg font-bold text-slate-800 dark:text-white tabular-nums">{city.population}</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Population</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => onCityChange?.(activeCity)}
          className="w-full mt-3 py-3 bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400 text-white font-bold text-sm rounded-2xl shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <span className="text-base">{city.flag}</span>
          Tazama maduka {city.shortName} — Browse {city.shortName} shops
        </button>
      </div>
    </ScrollReveal>
  );
}
