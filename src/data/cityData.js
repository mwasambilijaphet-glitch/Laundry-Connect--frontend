// ============================================================
// CITY DATA — Tanzania Coverage
// Vendor counts, average prices, and coordinates for each city
// ============================================================

const CITIES = [
  {
    id: 'dar',
    name: 'Dar es Salaam',
    shortName: 'Dar',
    region: 'Dar es Salaam',
    lat: -6.7924,
    lng: 39.2083,
    vendorCount: 48,
    avgPrice: 2500,
    population: '5.4M',
    description: 'Largest city & commercial hub',
    flag: '🏙️',
  },
  {
    id: 'arusha',
    name: 'Arusha',
    shortName: 'Arusha',
    region: 'Arusha',
    lat: -3.3869,
    lng: 36.6830,
    vendorCount: 22,
    avgPrice: 2000,
    population: '617K',
    description: 'Safari capital of Tanzania',
    flag: '🦁',
  },
  {
    id: 'dodoma',
    name: 'Dodoma',
    shortName: 'Dodoma',
    region: 'Dodoma',
    lat: -6.1630,
    lng: 35.7516,
    vendorCount: 15,
    avgPrice: 1800,
    population: '453K',
    description: 'Capital city of Tanzania',
    flag: '🏛️',
  },
  {
    id: 'mwanza',
    name: 'Mwanza',
    shortName: 'Mwanza',
    region: 'Mwanza',
    lat: -2.5164,
    lng: 32.9175,
    vendorCount: 18,
    avgPrice: 1800,
    population: '1.1M',
    description: 'Rock City on Lake Victoria',
    flag: '🪨',
  },
  {
    id: 'zanzibar',
    name: 'Zanzibar City',
    shortName: 'Zanzibar',
    region: 'Zanzibar',
    lat: -6.1659,
    lng: 39.1989,
    vendorCount: 12,
    avgPrice: 3000,
    population: '501K',
    description: 'Spice Island paradise',
    flag: '🏝️',
  },
  {
    id: 'mbeya',
    name: 'Mbeya',
    shortName: 'Mbeya',
    region: 'Mbeya',
    lat: -8.9000,
    lng: 33.4500,
    vendorCount: 10,
    avgPrice: 1500,
    population: '385K',
    description: 'Highland city in the south',
    flag: '⛰️',
  },
  {
    id: 'morogoro',
    name: 'Morogoro',
    shortName: 'Morogoro',
    region: 'Morogoro',
    lat: -6.8235,
    lng: 37.6615,
    vendorCount: 9,
    avgPrice: 1600,
    population: '316K',
    description: 'Gateway to Uluguru Mountains',
    flag: '🌿',
  },
  {
    id: 'tanga',
    name: 'Tanga',
    shortName: 'Tanga',
    region: 'Tanga',
    lat: -5.0689,
    lng: 39.0986,
    vendorCount: 8,
    avgPrice: 1500,
    population: '273K',
    description: 'Historic coastal port city',
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
