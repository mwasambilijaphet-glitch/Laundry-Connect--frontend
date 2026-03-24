// ============================================================
// CITY DATA — Laundry Connect Tanzania
// ============================================================

export const CITIES = [
  {
    name: 'Dar es Salaam',
    vendors: 12,
    avgPrice: 2500,
    description: 'Dar es Salaam City Center',
    availableTonight: 8,
    lat: -6.7924,
    lng: 39.2083,
  },
  {
    name: 'Arusha',
    vendors: 8,
    avgPrice: 2800,
    description: 'Arusha City Center',
    availableTonight: 5,
    lat: -3.3869,
    lng: 36.6830,
  },
  {
    name: 'Dodoma',
    vendors: 5,
    avgPrice: 3000,
    description: 'Dodoma City Center',
    availableTonight: 3,
    lat: -6.1630,
    lng: 35.7516,
  },
];

export function getCityByName(name) {
  return CITIES.find(c => c.name === name) || CITIES[0];
}
