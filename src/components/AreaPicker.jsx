import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, ChevronRight, Navigation } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import AREAS, { searchAreas, getDistrictsForCity } from '../data/areaData';

export default function AreaPicker({ onSelect, currentArea, compact = false }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length >= 2) {
      setResults(searchAreas(query));
      setSelectedCity(null);
      setSelectedDistrict(null);
    } else {
      setResults([]);
    }
  }, [query]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  function handleSelectArea(area) {
    onSelect({
      wardId: area.wardId,
      wardName: area.wardName,
      districtName: area.districtName,
      cityId: area.cityId,
      cityName: area.cityName,
      landmarks: area.landmarks,
      label: `${area.wardName}, ${area.districtName}`,
    });
    setOpen(false);
    setQuery('');
    setSelectedCity(null);
    setSelectedDistrict(null);
  }

  function handleSelectWard(ward, district, cityId, cityName) {
    onSelect({
      wardId: ward.id,
      wardName: ward.name,
      districtName: district.name,
      cityId,
      cityName,
      landmarks: ward.landmarks,
      label: `${ward.name}, ${district.name}`,
    });
    setOpen(false);
    setQuery('');
    setSelectedCity(null);
    setSelectedDistrict(null);
  }

  const cities = Object.entries(AREAS);

  // Trigger button
  const triggerContent = currentArea ? (
    <span className="flex items-center gap-1.5 truncate">
      <MapPin size={14} className="text-primary-600 dark:text-primary-400 flex-shrink-0" />
      <span className="truncate font-semibold text-slate-800 dark:text-white">{currentArea.label}</span>
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
      <MapPin size={14} />
      <span>{t('selectArea')}</span>
    </span>
  );

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 text-left transition-colors ${
          compact
            ? 'text-sm hover:text-primary-600 dark:hover:text-primary-400'
            : 'w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-primary-400 dark:hover:border-primary-500'
        }`}
      >
        {triggerContent}
        <ChevronRight size={14} className="text-slate-400 ml-auto flex-shrink-0" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-slate-900 animate-fade-in flex flex-col">
      {/* Header with search */}
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 pt-12 pb-3 z-10">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => { setOpen(false); setQuery(''); setSelectedCity(null); setSelectedDistrict(null); }}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center"
          >
            <X size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white font-display">{t('selectArea')}</h2>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t('searchAreaPlaceholder')}
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-3 pb-20">
        {/* GPS option */}
        <button
          onClick={() => {
            onSelect({ wardId: 'gps', label: t('nearMe'), useGPS: true });
            setOpen(false);
          }}
          className="w-full flex items-center gap-3 p-3 mb-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
        >
          <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/40 rounded-xl flex items-center justify-center">
            <Navigation size={18} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm text-primary-700 dark:text-primary-300">{t('useMyLocation')}</p>
            <p className="text-xs text-primary-500 dark:text-primary-400">{t('useGPSDesc')}</p>
          </div>
        </button>

        {/* Search results */}
        {query.length >= 2 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {results.length > 0 ? t('searchResults') : t('noResults')}
            </p>
            {results.map((area) => (
              <button
                key={`${area.cityId}-${area.districtId}-${area.wardId}`}
                onClick={() => handleSelectArea(area)}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
              >
                <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 dark:text-white truncate">{area.wardName}</p>
                  <p className="text-xs text-slate-400 truncate">{area.districtName}, {area.cityName}</p>
                  {area.landmarks.length > 0 && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {t('nearLandmark')}: {area.landmarks.slice(0, 2).join(', ')}
                    </p>
                  )}
                </div>
                <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
              </button>
            ))}
          </>
        )}

        {/* Browse by city → district → ward */}
        {query.length < 2 && !selectedCity && (
          <>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">{t('browseByCity')}</p>
            {cities.map(([cityId, city]) => (
              <button
                key={cityId}
                onClick={() => setSelectedCity(cityId)}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
              >
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">🏙️</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800 dark:text-white">{city.name}</p>
                  <p className="text-xs text-slate-400">
                    {city.districts.length} {t('districts')} &middot; {city.districts.reduce((sum, d) => sum + d.wards.length, 0)} {t('wards')}
                  </p>
                </div>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
              </button>
            ))}
          </>
        )}

        {/* District list for selected city */}
        {query.length < 2 && selectedCity && !selectedDistrict && (
          <>
            <button
              onClick={() => setSelectedCity(null)}
              className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-semibold mb-3 hover:underline"
            >
              ← {t('allCities')}
            </button>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {AREAS[selectedCity].name} — {t('districts')}
            </p>
            {getDistrictsForCity(selectedCity).map((district) => (
              <button
                key={district.id}
                onClick={() => setSelectedDistrict(district.id)}
                className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
              >
                <div className="w-9 h-9 bg-fresh-50 dark:bg-fresh-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin size={16} className="text-fresh-600 dark:text-fresh-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800 dark:text-white">{district.name}</p>
                  <p className="text-xs text-slate-400">{district.wards.length} {t('wards')}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300 dark:text-slate-600" />
              </button>
            ))}
          </>
        )}

        {/* Ward list for selected district */}
        {query.length < 2 && selectedCity && selectedDistrict && (
          <>
            <button
              onClick={() => setSelectedDistrict(null)}
              className="flex items-center gap-1 text-xs text-primary-600 dark:text-primary-400 font-semibold mb-3 hover:underline"
            >
              ← {AREAS[selectedCity].name}
            </button>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {getDistrictsForCity(selectedCity).find(d => d.id === selectedDistrict)?.name} — {t('wards')}
            </p>
            {(() => {
              const district = getDistrictsForCity(selectedCity).find(d => d.id === selectedDistrict);
              if (!district) return null;
              return district.wards.map((ward) => (
                <button
                  key={ward.id}
                  onClick={() => handleSelectWard(ward, district, selectedCity, AREAS[selectedCity].name)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors text-left"
                >
                  <div className="w-9 h-9 bg-accent-50 dark:bg-accent-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-accent-600 dark:text-accent-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 dark:text-white">{ward.name}</p>
                    <p className="text-xs text-slate-400 truncate">
                      {ward.landmarks.join(' · ')}
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                </button>
              ));
            })()}
          </>
        )}
      </div>
    </div>
  );
}
