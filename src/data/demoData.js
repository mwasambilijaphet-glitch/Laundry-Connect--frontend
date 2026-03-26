// ============================================================
// DEMO DATA — Used when backend is unavailable
// Makes the app look complete for demos and testing
// ============================================================

export const DEMO_USER = {
  id: 0,
  full_name: 'Demo User',
  phone: '0768188065',
  email: 'demo@laundryconnect.co.tz',
  role: 'customer',
  avatar_url: null,
};

export const DEMO_SHOPS = [
  {
    id: 1,
    name: 'Mama Salma Laundry',
    address: 'Mikocheni B, Dar es Salaam',
    region: 'Dar es Salaam',
    city: 'dar',
    rating_avg: '4.8',
    review_count: 124,
    operating_hours: { open: '7am', close: '9pm' },
    is_approved: true,
    photos: [],
    services: [
      { clothing_type: 'shirt', service_type: 'wash_iron', price: 2000 },
      { clothing_type: 'trousers', service_type: 'wash_iron', price: 3000 },
      { clothing_type: 'dress', service_type: 'dry_clean', price: 5000 },
    ],
  },
  {
    id: 2,
    name: 'Clean & Fresh Express',
    address: 'Masaki, Dar es Salaam',
    region: 'Dar es Salaam',
    city: 'dar',
    rating_avg: '4.6',
    review_count: 89,
    operating_hours: { open: '6am', close: '10pm' },
    is_approved: true,
    photos: [],
    services: [
      { clothing_type: 'shirt', service_type: 'wash_only', price: 1500 },
      { clothing_type: 'suit', service_type: 'dry_clean', price: 8000 },
    ],
  },
  {
    id: 3,
    name: 'Baba Dry Cleaners',
    address: 'Sinza, Dar es Salaam',
    region: 'Dar es Salaam',
    city: 'dar',
    rating_avg: '4.5',
    review_count: 67,
    operating_hours: { open: '8am', close: '8pm' },
    is_approved: true,
    photos: [],
    services: [
      { clothing_type: 'shirt', service_type: 'wash_iron', price: 1800 },
      { clothing_type: 'bedsheet', service_type: 'wash_only', price: 3500 },
    ],
  },
  {
    id: 4,
    name: 'Spotless Laundry Hub',
    address: 'Kinondoni, Dar es Salaam',
    region: 'Dar es Salaam',
    city: 'dar',
    rating_avg: '4.7',
    review_count: 112,
    operating_hours: { open: '7am', close: '9pm' },
    is_approved: true,
    photos: [],
    services: [
      { clothing_type: 'shirt', service_type: 'wash_iron', price: 2500 },
      { clothing_type: 'curtain', service_type: 'wash_only', price: 4000 },
    ],
  },
  {
    id: 5,
    name: 'Quick Wash Arusha',
    address: 'Njiro, Arusha',
    region: 'Arusha',
    city: 'arusha',
    rating_avg: '4.4',
    review_count: 45,
    operating_hours: { open: '7am', close: '8pm' },
    is_approved: true,
    photos: [],
    services: [
      { clothing_type: 'shirt', service_type: 'wash_iron', price: 2200 },
    ],
  },
  {
    id: 6,
    name: 'Dodoma Fresh Laundry',
    address: 'Area D, Dodoma',
    region: 'Dodoma',
    city: 'dodoma',
    rating_avg: '4.3',
    review_count: 32,
    operating_hours: { open: '8am', close: '7pm' },
    is_approved: true,
    photos: [],
    services: [
      { clothing_type: 'shirt', service_type: 'wash_iron', price: 2000 },
    ],
  },
];

export const DEMO_ORDERS = [
  {
    id: 1,
    order_number: 'LC-2024-001',
    status: 'washing',
    shop_name: 'Mama Salma Laundry',
    shop_address: 'Mikocheni B, Dar es Salaam',
    shop_rating: '4.8',
    total_amount: 12500,
    subtotal: 10500,
    delivery_fee: 2000,
    payment_status: 'paid',
    delivery_address: 'Msasani Peninsula, Dar es Salaam',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    items: [
      { clothing_type: 'shirt', service_type: 'wash_iron', quantity: 3, total_price: 6000 },
      { clothing_type: 'trousers', service_type: 'wash_iron', quantity: 2, total_price: 4500 },
    ],
  },
];

export function isDemoMode() {
  return localStorage.getItem('lc_demo_mode') === 'true';
}

export function enableDemoMode() {
  localStorage.setItem('lc_demo_mode', 'true');
}

export function disableDemoMode() {
  localStorage.removeItem('lc_demo_mode');
}
