// ============================================================
// CITY DATA — Tanzania Coverage
// Vendor counts, average prices, availability, and coordinates
// ============================================================

const CITIES = [
  {
    id: 'dar',
    name: 'Dar es Salaam',
    shortName: 'Dar',
    region: 'Dar es Salaam',
    lat: -6.7924,
    lng: 39.2083,
    vendorCount: 12,
    avgPrice: 2500,
    availableTonight: 8,
    population: '5.4M',
    description: 'Dar es Salaam City Center',
    flag: '🏙️',
  },
  {
    id: 'arusha',
    name: 'Arusha',
    shortName: 'Arusha',
    region: 'Arusha',
    lat: -3.3869,
    lng: 36.6830,
    vendorCount: 8,
    avgPrice: 2800,
    availableTonight: 5,
    population: '617K',
    description: 'Arusha City Center',
    flag: '🦁',
  },
  {
    id: 'dodoma',
    name: 'Dodoma',
    shortName: 'Dodoma',
    region: 'Dodoma',
    lat: -6.1630,
    lng: 35.7516,
    vendorCount: 5,
    avgPrice: 3000,
    availableTonight: 3,
    population: '453K',
    description: 'Dodoma City Center',
    flag: '🏛️',
  },
  {
    id: 'mwanza',
    name: 'Mwanza',
    shortName: 'Mwanza',
    region: 'Mwanza',
    lat: -2.5164,
    lng: 32.9175,
    vendorCount: 6,
    avgPrice: 2200,
    availableTonight: 4,
    population: '1.1M',
    description: 'Mwanza City Center',
    flag: '🪨',
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar City',
    shortName: 'Zanzibar',
    region: 'Zanzibar',
    lat: -6.1659,
    lng: 39.1989,
    vendorCount: 4,
    avgPrice: 3500,
    availableTonight: 2,
    population: '501K',
    description: 'Stone Town & surrounds',
    flag: '🏝️',
  },
  {
    id: 'mbeya',
    name: 'Mbeya',
    shortName: 'Mbeya',
    region: 'Mbeya',
    lat: -8.9000,
    lng: 33.4500,
    vendorCount: 3,
    avgPrice: 1800,
    availableTonight: 2,
    population: '385K',
    description: 'Mbeya City Center',
    flag: '⛰️',
  },
  {
    id: 'morogoro',
    name: 'Morogoro',
    shortName: 'Morogoro',
    region: 'Morogoro',
    lat: -6.8235,
    lng: 37.6615,
    vendorCount: 3,
    avgPrice: 2000,
    availableTonight: 2,
    population: '316K',
    description: 'Morogoro City Center',
    flag: '🌿',
  },
  {
    id: 'tanga',
    name: 'Tanga',
    shortName: 'Tanga',
    region: 'Tanga',
    lat: -5.0689,
    lng: 39.0986,
    vendorCount: 3,
    avgPrice: 1800,
    availableTonight: 1,
    population: '273K',
    description: 'Tanga City Center',
    flag: '⚓',
  },
];

export default CITIES;

export function getCityById(id) {
  return CITIES.find(c => c.id === id);
}

export function getCityNames() {
  return CITIES.map(c => ({ id: c.id, name: c.shortName }));
}
