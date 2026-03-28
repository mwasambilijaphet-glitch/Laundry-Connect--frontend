// ============================================================
// DEMO DATA — Used when backend is unavailable
// Makes the app look complete for demos and testing
// ============================================================

export const DEMO_USER = {
  id: 0,
  full_name: 'Demo User',
  phone: '0700000000',
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

export function enableDemoMode(role) {
  localStorage.setItem('lc_demo_mode', 'true');
  if (role) localStorage.setItem('lc_demo_role', role);
}

export function getDemoRole() {
  return localStorage.getItem('lc_demo_role') || 'customer';
}

export function disableDemoMode() {
  localStorage.removeItem('lc_demo_mode');
  localStorage.removeItem('lc_demo_role');
}

// Get a demo shop by ID
export function getDemoShop(id) {
  const shop = DEMO_SHOPS.find(s => s.id === parseInt(id));
  if (!shop) return null;
  return {
    ...shop,
    total_reviews: shop.review_count,
    total_orders: Math.floor(Math.random() * 200) + 50,
    description: `Welcome to ${shop.name}! We provide quality laundry services in ${shop.region}.`,
    delivery_zones: [
      { id: 1, zone_name: 'Within 5km', description: 'Nearby delivery', fee: 2000 },
      { id: 2, zone_name: '5-10km', description: 'Extended delivery', fee: 3500 },
    ],
    reviews: [
      { id: 1, customer_name: 'Amina', rating: 5, comment: 'Excellent service! Very clean clothes.', created_at: new Date(Date.now() - 86400000 * 3).toISOString() },
      { id: 2, customer_name: 'John', rating: 4, comment: 'Good and reliable.', created_at: new Date(Date.now() - 86400000 * 7).toISOString() },
    ],
  };
}

// Get a demo order by ID
export function getDemoOrder(id) {
  const order = DEMO_ORDERS.find(o => o.id === parseInt(id));
  return order || DEMO_ORDERS[0];
}

export const DEMO_CONVERSATIONS = [
  {
    id: 1,
    shop_name: 'Mama Salma Laundry',
    shop_phone: '+255768188065',
    customer_name: 'Demo User',
    customer_phone: '0768188065',
    last_message: 'Your clothes are ready for pickup!',
    last_message_at: new Date(Date.now() - 1800000).toISOString(),
    unread_count: 1,
  },
  {
    id: 2,
    shop_name: 'Clean & Fresh Express',
    shop_phone: '+255712345678',
    customer_name: 'Demo User',
    customer_phone: '0768188065',
    last_message: 'Thank you for your order!',
    last_message_at: new Date(Date.now() - 86400000).toISOString(),
    unread_count: 0,
  },
];

export const DEMO_MESSAGES = [
  {
    id: 1,
    sender_id: 999,
    sender_role: 'owner',
    sender_name: 'Mama Salma',
    content: 'Karibu! Welcome to Mama Salma Laundry. How can I help you?',
    message_type: 'text',
    is_read: true,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 2,
    sender_id: 0,
    sender_role: 'customer',
    sender_name: 'Demo User',
    content: 'Hi! I have some clothes for washing. What are your prices?',
    message_type: 'text',
    is_read: true,
    created_at: new Date(Date.now() - 3500000).toISOString(),
  },
  {
    id: 3,
    sender_id: 999,
    sender_role: 'owner',
    sender_name: 'Mama Salma',
    content: 'Shirts are TSH 2,000 for wash & iron, trousers TSH 3,000. We also do dry cleaning!',
    message_type: 'text',
    is_read: true,
    created_at: new Date(Date.now() - 3400000).toISOString(),
  },
  {
    id: 4,
    sender_id: 999,
    sender_role: 'owner',
    sender_name: 'Mama Salma',
    content: 'Your clothes are ready for pickup!',
    message_type: 'text',
    is_read: false,
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
];
