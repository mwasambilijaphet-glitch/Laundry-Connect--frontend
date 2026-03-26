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
];

export default CITIES;

export function getCityById(id) {
  return CITIES.find(c => c.id === id);
}

export function getCityNames() {
  return CITIES.map(c => ({ id: c.id, name: c.shortName }));
}
