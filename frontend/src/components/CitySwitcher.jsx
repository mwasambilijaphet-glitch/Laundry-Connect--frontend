import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Map, List, CheckCircle, Clock, Users } from 'lucide-react';
import { CITIES } from '../data/cities';
import { formatTZS } from '../data/mockData';

export default function CitySwitcher({ currentCity = 'Dar es Salaam', onCityChange }) {
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(currentCity);
  const [viewMode, setViewMode] = useState('map');

  const city = CITIES.find(c => c.name === selectedCity) || CITIES[0];

  function handleCityChange(name) {
    setSelectedCity(name);
    onCityChange?.(name);
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-card overflow-hidden transition-all duration-300">
      {/* Header */}
      <div
        className="px-5 py-6 text-center text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0052CC 0%, #003d99 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full" />
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/5 rounded-full" />
        <p className="text-sm text-blue-200 font-medium flex items-center justify-center gap-1.5 relative">
          <MapPin size={14} /> Your Current City
        </p>
        <h2 className="text-2xl sm:text-[26px] font-bold font-display mt-1.5 relative">
          {selectedCity}
        </h2>
      </div>

      {/* City Pills */}
      <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-700">
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-1 px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {CITIES.map(c => {
            const isActive = c.name === selectedCity;
            return (
              <button
                key={c.name}
                onClick={() => handleCityChange(c.name)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium border-2 transition-all duration-300 min-h-[44px] ${
                  isActive
                    ? 'text-white border-[#0052CC]'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:border-[#0052CC] hover:text-[#0052CC]'
                }`}
                style={isActive ? { background: '#0052CC', borderColor: '#0052CC', boxShadow: '0 4px 12px rgba(0, 82, 204, 0.3)' } : {}}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Map / Service Area */}
      <div className="px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2.5 flex items-center gap-1.5">
          <MapPin size={12} /> Service Area
        </p>
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg h-[150px] sm:h-[180px] flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <Map size={24} className="text-[#0052CC]" />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{city.description}</p>
          <p className="text-xs text-slate-400">Showing available vendors</p>
        </div>
      </div>

      {/* Vendor Count + Toggle */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
            style={{ background: '#00D084' }}
          >
            <CheckCircle size={20} />
          </div>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {city.vendors} vendors nearby
          </span>
        </div>
        <button
          onClick={() => setViewMode(v => v === 'map' ? 'list' : 'map')}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-[#0052CC] hover:text-[#0052CC] transition-all duration-300 min-h-[44px]"
        >
          {viewMode === 'map' ? <><Map size={14} /> Map View</> : <><List size={14} /> List View</>}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 px-5 py-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Clock size={14} className="text-[#0052CC]" />
          </div>
          <p className="text-base font-bold font-display" style={{ color: '#0052CC' }}>
            {city.availableTonight}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Available tonight</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-1">
            <Users size={14} className="text-[#0052CC]" />
          </div>
          <p className="text-base font-bold font-display" style={{ color: '#0052CC' }}>
            {city.avgPrice.toLocaleString()} TSH
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Avg. per item</p>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-5 py-4">
        <button
          onClick={() => navigate('/shops')}
          className="w-full py-4 text-white font-semibold rounded-lg text-base transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 min-h-[44px]"
          style={{
            background: 'linear-gradient(135deg, #0052CC 0%, #003d99 100%)',
            boxShadow: '0 4px 12px rgba(0, 82, 204, 0.3)',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 82, 204, 0.4)'; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 82, 204, 0.3)'; }}
        >
          Browse Vendors ↓
        </button>
      </div>
    </div>
  );
}
