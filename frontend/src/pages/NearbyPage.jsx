import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Loader2, AlertCircle, RefreshCw, Sun, Moon, ArrowLeft, Phone, ExternalLink, Locate, Filter } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icon issue with bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const userSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32"><circle cx="12" cy="12" r="10" fill="%233b82f6" stroke="white" stroke-width="3"/><circle cx="12" cy="12" r="4" fill="white"/></svg>`;
const userIcon = new L.Icon({
  iconUrl: `data:image/svg+xml,${userSvg}`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const shopSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 40" width="32" height="40"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="%2310b981"/><circle cx="16" cy="15" r="8" fill="white"/><text x="16" y="19" text-anchor="middle" font-size="12" fill="%2310b981" font-weight="bold">W</text></svg>`;
const shopIcon = new L.Icon({
  iconUrl: `data:image/svg+xml,${shopSvg}`,
  iconSize: [32, 40],
  iconAnchor: [16, 40],
  popupAnchor: [0, -40],
});

// Component to recenter map
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], map.getZoom());
  }, [lat, lng]);
  return null;
}

// Major Tanzanian cities
const CITIES = [
  { id: 'nearby', name: 'Near Me', lat: null, lng: null, icon: '📍' },
  { id: 'dar', name: 'Dar es Salaam', lat: -6.7924, lng: 39.2083, icon: '🌊' },
  { id: 'dodoma', name: 'Dodoma', lat: -6.1630, lng: 35.7516, icon: '🏛️' },
  { id: 'mwanza', name: 'Mwanza', lat: -2.5164, lng: 32.9175, icon: '🐟' },
  { id: 'arusha', name: 'Arusha', lat: -3.3869, lng: 36.6830, icon: '🏔️' },
  { id: 'mbeya', name: 'Mbeya', lat: -8.9000, lng: 33.4500, icon: '🌿' },
  { id: 'morogoro', name: 'Morogoro', lat: -6.8235, lng: 37.6603, icon: '🌾' },
  { id: 'tanga', name: 'Tanga', lat: -5.0689, lng: 39.0989, icon: '⚓' },
  { id: 'zanzibar', name: 'Zanzibar', lat: -6.1659, lng: 39.2026, icon: '🏝️' },
  { id: 'tabora', name: 'Tabora', lat: -5.0242, lng: 32.8000, icon: '🌳' },
  { id: 'kigoma', name: 'Kigoma', lat: -4.8769, lng: 29.6266, icon: '🚢' },
  { id: 'iringa', name: 'Iringa', lat: -7.7700, lng: 35.6900, icon: '⛰️' },
  { id: 'songea', name: 'Songea', lat: -10.6800, lng: 35.6500, icon: '🌻' },
  { id: 'musoma', name: 'Musoma', lat: -1.5000, lng: 33.8000, icon: '🎣' },
  { id: 'bukoba', name: 'Bukoba', lat: -1.3319, lng: 31.8125, icon: '🍌' },
  { id: 'lindi', name: 'Lindi', lat: -10.0000, lng: 39.7167, icon: '🐚' },
  { id: 'mtwara', name: 'Mtwara', lat: -10.2736, lng: 40.1828, icon: '⛽' },
  { id: 'shinyanga', name: 'Shinyanga', lat: -3.6615, lng: 33.4242, icon: '💎' },
  { id: 'singida', name: 'Singida', lat: -4.8163, lng: 34.7438, icon: '🏜️' },
  { id: 'sumbawanga', name: 'Sumbawanga', lat: -7.9667, lng: 31.6167, icon: '🦁' },
];

const DEFAULT_LAT = -6.1630;
const DEFAULT_LNG = 35.7516;
const SEARCH_RADIUS = 5000; // 5km

export default function NearbyPage() {
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const [userPos, setUserPos] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(true);
  const [error, setError] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [radius, setRadius] = useState(SEARCH_RADIUS);
  const [selectedCity, setSelectedCity] = useState('nearby');
  const [geoPos, setGeoPos] = useState(null); // store original geolocation
  const mapRef = useRef(null);

  // Get user location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLocating(false);
      setLoading(false);
      fetchNearby(DEFAULT_LAT, DEFAULT_LNG);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPos({ lat: latitude, lng: longitude });
        setGeoPos({ lat: latitude, lng: longitude });
        setLocating(false);
        fetchNearby(latitude, longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setUserPos({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        setGeoPos({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
        setLocating(false);
        setSelectedCity('dodoma');
        fetchNearby(DEFAULT_LAT, DEFAULT_LNG);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  // Fetch nearby dry cleaners from OpenStreetMap Overpass API
  async function fetchNearby(lat, lng, searchRadius = radius) {
    setLoading(true);
    setError('');

    try {
      // Overpass QL query for laundry and dry cleaning shops
      const query = `
        [out:json][timeout:25];
        (
          node["shop"="laundry"](around:${searchRadius},${lat},${lng});
          node["shop"="dry_cleaning"](around:${searchRadius},${lat},${lng});
          node["amenity"="laundry"](around:${searchRadius},${lat},${lng});
          node["craft"="cleaning"](around:${searchRadius},${lat},${lng});
          way["shop"="laundry"](around:${searchRadius},${lat},${lng});
          way["shop"="dry_cleaning"](around:${searchRadius},${lat},${lng});
        );
        out center body;
      `;

      let res;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          res = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: `data=${encodeURIComponent(query)}`,
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          });
          if (res.ok) break;
        } catch (fetchErr) {
          if (attempt === 1) throw fetchErr;
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      if (!res || !res.ok) throw new Error('Failed to fetch nearby places');

      const data = await res.json();

      const results = data.elements
        .map((el) => {
          const elLat = el.lat || el.center?.lat;
          const elLng = el.lon || el.center?.lon;
          if (!elLat || !elLng) return null;

          const tags = el.tags || {};
          const distance = getDistance(lat, lng, elLat, elLng);

          return {
            id: el.id,
            name: tags.name || tags['name:en'] || tags['name:sw'] || 'Dry Cleaner',
            lat: elLat,
            lng: elLng,
            phone: tags.phone || tags['contact:phone'] || null,
            website: tags.website || tags['contact:website'] || null,
            address: tags['addr:street']
              ? `${tags['addr:housenumber'] || ''} ${tags['addr:street']}, ${tags['addr:city'] || ''}`.trim()
              : tags['addr:full'] || null,
            opening_hours: tags.opening_hours || null,
            type: tags.shop || tags.amenity || tags.craft || 'laundry',
            distance,
          };
        })
        .filter(Boolean)
        .sort((a, b) => a.distance - b.distance);

      setPlaces(results);

      if (results.length === 0 && searchRadius < 20000) {
        setError(`No dry cleaners found within ${searchRadius / 1000}km. Try expanding the search radius.`);
      }
    } catch (err) {
      console.error('Overpass API error:', err);
      setError('Failed to search for nearby places. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Haversine distance in meters
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function formatDistance(meters) {
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  }

  function handleRecenter() {
    if (userPos && mapRef.current) {
      mapRef.current.setView([userPos.lat, userPos.lng], 14);
    }
  }

  function handleCityChange(city) {
    setSelectedCity(city.id);
    setSelectedPlace(null);
    setPlaces([]);

    if (city.id === 'nearby' && geoPos) {
      setUserPos(geoPos);
      if (mapRef.current) mapRef.current.setView([geoPos.lat, geoPos.lng], 14);
      fetchNearby(geoPos.lat, geoPos.lng);
    } else if (city.lat && city.lng) {
      setUserPos({ lat: city.lat, lng: city.lng });
      if (mapRef.current) mapRef.current.setView([city.lat, city.lng], 13);
      fetchNearby(city.lat, city.lng);
    }
  }

  function handleRadiusChange(newRadius) {
    setRadius(newRadius);
    if (userPos) fetchNearby(userPos.lat, userPos.lng, newRadius);
  }

  function openDirections(place) {
    const url = userPos
      ? `https://www.openstreetmap.org/directions?from=${userPos.lat},${userPos.lng}&to=${place.lat},${place.lng}`
      : `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=17/${place.lat}/${place.lng}`;
    window.open(url, '_blank');
  }

  const mapCenter = userPos || { lat: DEFAULT_LAT, lng: DEFAULT_LNG };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700 px-6 pt-12 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
              <ArrowLeft size={20} className="text-slate-600 dark:text-slate-300" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-white font-display">Nearby Dry Cleaners</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {locating ? 'Getting your location...' : `${places.length} found${selectedCity !== 'nearby' ? ` in ${CITIES.find(c => c.id === selectedCity)?.name || ''}` : ''} within ${radius / 1000}km`}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
          >
            {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
          </button>
        </div>

        {/* City selector */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar -mx-6 px-6">
          {CITIES.map((city) => (
            <button
              key={city.id}
              onClick={() => handleCityChange(city)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCity === city.id
                  ? 'bg-fresh-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              <span>{city.icon}</span> {city.name}
            </button>
          ))}
        </div>

        {/* Radius filter */}
        <div className="flex items-center gap-2 mt-2 overflow-x-auto no-scrollbar">
          <Filter size={14} className="text-slate-400 flex-shrink-0" />
          {[2000, 5000, 10000, 20000].map((r) => (
            <button
              key={r}
              onClick={() => handleRadiusChange(r)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                radius === r
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {r / 1000}km
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mt-4 flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <AlertCircle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-300">{error}</p>
        </div>
      )}

      {/* Map */}
      <div className="mx-6 mt-4 rounded-2xl overflow-hidden shadow-card relative" style={{ height: '300px' }}>
        {locating ? (
          <div className="h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 gap-3">
            <Loader2 size={28} className="text-primary-500 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Finding your location...</p>
          </div>
        ) : (
          <>
            <MapContainer
              center={[mapCenter.lat, mapCenter.lng]}
              zoom={14}
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
              zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url={isDark
                  ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
                  : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                }
              />

              {/* User position */}
              {userPos && (
                <>
                  <Marker position={[userPos.lat, userPos.lng]} icon={userIcon}>
                    <Popup>
                      <strong>You are here</strong>
                    </Popup>
                  </Marker>
                  <Circle
                    center={[userPos.lat, userPos.lng]}
                    radius={radius}
                    pathOptions={{
                      color: '#3b82f6',
                      fillColor: '#3b82f6',
                      fillOpacity: 0.05,
                      weight: 1,
                      dashArray: '5, 5',
                    }}
                  />
                </>
              )}

              {/* Dry cleaner markers */}
              {places.map((place) => (
                <Marker
                  key={place.id}
                  position={[place.lat, place.lng]}
                  icon={shopIcon}
                  eventHandlers={{ click: () => setSelectedPlace(place) }}
                >
                  <Popup>
                    <div className="min-w-[180px]">
                      <strong className="text-sm">{place.name}</strong>
                      {place.address && <p className="text-xs text-gray-500 mt-1">{place.address}</p>}
                      <p className="text-xs text-blue-600 font-semibold mt-1">{formatDistance(place.distance)} away</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Map controls */}
            <div className="absolute bottom-3 right-3 z-[1000] flex flex-col gap-2">
              <button
                onClick={handleRecenter}
                className="w-10 h-10 bg-white dark:bg-slate-700 rounded-xl shadow-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
              >
                <Locate size={18} className="text-primary-600 dark:text-primary-400" />
              </button>
            </div>

            {loading && (
              <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[1000]">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-4 py-2 rounded-full shadow-lg">
                  <Loader2 size={16} className="text-primary-500 animate-spin" />
                  <span className="text-sm text-slate-600 dark:text-slate-300">Searching...</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Results list */}
      <div className="px-6 py-4 pb-28 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 dark:text-white text-sm">
            {loading ? 'Searching...' : `${places.length} Dry Cleaners Found`}
          </h2>
          {!loading && userPos && (
            <button
              onClick={() => fetchNearby(userPos.lat, userPos.lng)}
              className="text-xs text-primary-600 dark:text-primary-400 font-semibold flex items-center gap-1 hover:underline"
            >
              <RefreshCw size={12} /> Refresh
            </button>
          )}
        </div>

        {!loading && places.length === 0 && (
          <div className="text-center py-10">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">No dry cleaners found nearby</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mb-4">Try expanding the search radius</p>
            <button
              onClick={() => handleRadiusChange(Math.min(radius * 2, 20000))}
              className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              Search within {Math.min(radius * 2, 20000) / 1000}km
            </button>
          </div>
        )}

        {places.map((place) => (
          <div
            key={place.id}
            role="button"
            tabIndex={0}
            onClick={() => {
              setSelectedPlace(place);
              if (mapRef.current) mapRef.current.setView([place.lat, place.lng], 16);
            }}
            className={`w-full text-left card-hover p-4 transition-all cursor-pointer ${
              selectedPlace?.id === place.id ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-fresh-100 dark:bg-fresh-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <span className="text-lg">🧺</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-slate-800 dark:text-white text-sm truncate">{place.name}</h3>
                  <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 flex-shrink-0">
                    {formatDistance(place.distance)}
                  </span>
                </div>
                {place.address && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin size={10} /> {place.address}
                  </p>
                )}
                {place.opening_hours && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{place.opening_hours}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); openDirections(place); }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
                  >
                    <Navigation size={10} /> Directions
                  </button>
                  {place.phone && (
                    <a
                      href={`tel:${place.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-fresh-50 dark:bg-fresh-900/30 text-fresh-600 dark:text-fresh-400 rounded-lg text-xs font-semibold hover:bg-fresh-100 dark:hover:bg-fresh-900/50 transition-colors"
                    >
                      <Phone size={10} /> Call
                    </a>
                  )}
                  {place.website && (
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                      <ExternalLink size={10} /> Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
