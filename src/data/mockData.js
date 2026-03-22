// ============================================================
// MOCK DATA — Laundry Connect
// Replace these with real API calls when backend is connected
// ============================================================

export const CLOTHING_TYPES = [
  { id: 'shirt', label: 'Shirt', icon: '👔' },
  { id: 'trousers', label: 'Trousers', icon: '👖' },
  { id: 'dress', label: 'Dress', icon: '👗' },
  { id: 'suit', label: 'Suit (2pc)', icon: '🤵' },
  { id: 'bedsheet', label: 'Bedsheet', icon: '🛏️' },
  { id: 'curtain', label: 'Curtain (pair)', icon: '🪟' },
  { id: 'blanket', label: 'Blanket', icon: '🧶' },
  { id: 'kitenge', label: 'Kitenge/Kanga', icon: '🎨' },
  { id: 'shoes', label: 'Shoes (pair)', icon: '👟' },
  { id: 'underwear', label: 'Underwear', icon: '🩲' },
];

export const SERVICE_TYPES = [
  { id: 'wash_only', label: 'Wash Only', icon: '🫧' },
  { id: 'wash_iron', label: 'Wash & Iron', icon: '✨' },
  { id: 'iron_only', label: 'Iron Only', icon: '♨️' },
  { id: 'dry_clean', label: 'Dry Clean', icon: '🧼' },
  { id: 'special', label: 'Special Care', icon: '💎' },
];

export const ORDER_STATUSES = [
  { id: 'placed', label: 'Order Placed', icon: '📋', color: 'blue' },
  { id: 'confirmed', label: 'Confirmed', icon: '✅', color: 'blue' },
  { id: 'picked_up', label: 'Picked Up', icon: '🚗', color: 'amber' },
  { id: 'washing', label: 'Washing', icon: '🫧', color: 'amber' },
  { id: 'ready', label: 'Ready', icon: '✨', color: 'green' },
  { id: 'out_for_delivery', label: 'Out for Delivery', icon: '🛵', color: 'green' },
  { id: 'delivered', label: 'Delivered', icon: '🎉', color: 'green' },
];

export const mockShops = [
  {
    id: 1,
    name: 'Mama Salma Laundry',
    description: 'Trusted traditional wear care specialists in Kinondoni. We treat your Kitenge and Kanga with the love they deserve. Family-run for over 15 years.',
    address: 'Kinondoni Road, Kinondoni',
    city: 'Dar es Salaam',
    region: 'Kinondoni',
    latitude: -6.7720,
    longitude: 39.2440,
    phone: '0754 123 456',
    photos: [
      'https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600',
      'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600',
    ],
    operating_hours: { open: '07:00', close: '20:00', days: 'Mon–Sat' },
    is_approved: true,
    is_active: true,
    rating_avg: 4.7,
    total_orders: 342,
    total_reviews: 89,
    owner_name: 'Salma Hassan',
    min_price: 1500,
    delivery_zones: [
      { zone_name: 'Kinondoni Area', fee: 2000, description: 'Within 3km' },
      { zone_name: 'Mikocheni / Sinza', fee: 4000, description: '3-7km' },
      { zone_name: 'Masaki / Kariakoo', fee: 7000, description: '7-15km' },
    ],
    services: [
      { id: 101, clothing_type: 'shirt', service_type: 'wash_only', price: 1500 },
      { id: 102, clothing_type: 'shirt', service_type: 'wash_iron', price: 2500 },
      { id: 103, clothing_type: 'shirt', service_type: 'iron_only', price: 1000 },
      { id: 104, clothing_type: 'trousers', service_type: 'wash_only', price: 1500 },
      { id: 105, clothing_type: 'trousers', service_type: 'wash_iron', price: 2500 },
      { id: 106, clothing_type: 'trousers', service_type: 'iron_only', price: 1000 },
      { id: 107, clothing_type: 'dress', service_type: 'wash_only', price: 2000 },
      { id: 108, clothing_type: 'dress', service_type: 'wash_iron', price: 3500 },
      { id: 109, clothing_type: 'kitenge', service_type: 'wash_only', price: 1500 },
      { id: 110, clothing_type: 'kitenge', service_type: 'wash_iron', price: 2500 },
      { id: 111, clothing_type: 'kitenge', service_type: 'special', price: 4000 },
      { id: 112, clothing_type: 'bedsheet', service_type: 'wash_only', price: 3000 },
      { id: 113, clothing_type: 'bedsheet', service_type: 'wash_iron', price: 4000 },
      { id: 114, clothing_type: 'blanket', service_type: 'wash_only', price: 5000 },
      { id: 115, clothing_type: 'curtain', service_type: 'wash_only', price: 4000 },
      { id: 116, clothing_type: 'curtain', service_type: 'dry_clean', price: 8000 },
    ],
    reviews: [
      { id: 1, customer: 'John M.', rating: 5, comment: 'Best Kitenge care in Dar! Mama Salma really knows her craft.', date: '2025-12-10' },
      { id: 2, customer: 'Grace K.', rating: 4, comment: 'Good service, delivery was on time. Prices are fair.', date: '2025-11-28' },
      { id: 3, customer: 'Ali R.', rating: 5, comment: 'Poa sana! My blankets came back looking brand new.', date: '2025-11-15' },
    ],
  },
  {
    id: 2,
    name: 'Fresh & Clean Express',
    description: 'Premium laundry service with same-day delivery. We use eco-friendly detergents and professional equipment for perfect results every time.',
    address: 'Old Bagamoyo Rd, Mikocheni',
    city: 'Dar es Salaam',
    region: 'Mikocheni',
    latitude: -6.7627,
    longitude: 39.2534,
    phone: '0713 456 789',
    photos: [
      'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?w=600',
      'https://images.unsplash.com/photo-1469504512102-900f29606341?w=600',
    ],
    operating_hours: { open: '06:00', close: '22:00', days: 'Mon–Sun' },
    is_approved: true,
    is_active: true,
    rating_avg: 4.9,
    total_orders: 567,
    total_reviews: 156,
    owner_name: 'David Mwanga',
    min_price: 2000,
    delivery_zones: [
      { zone_name: 'Mikocheni Area', fee: 2000, description: 'Within 3km' },
      { zone_name: 'Kinondoni / Msasani', fee: 4500, description: '3-7km' },
      { zone_name: 'CBD / Kariakoo', fee: 8000, description: '7-15km' },
    ],
    services: [
      { id: 201, clothing_type: 'shirt', service_type: 'wash_only', price: 2000 },
      { id: 202, clothing_type: 'shirt', service_type: 'wash_iron', price: 3000 },
      { id: 203, clothing_type: 'shirt', service_type: 'iron_only', price: 1500 },
      { id: 204, clothing_type: 'shirt', service_type: 'dry_clean', price: 5000 },
      { id: 205, clothing_type: 'trousers', service_type: 'wash_iron', price: 3000 },
      { id: 206, clothing_type: 'suit', service_type: 'dry_clean', price: 15000 },
      { id: 207, clothing_type: 'suit', service_type: 'wash_iron', price: 8000 },
      { id: 208, clothing_type: 'dress', service_type: 'wash_iron', price: 4000 },
      { id: 209, clothing_type: 'dress', service_type: 'dry_clean', price: 7000 },
      { id: 210, clothing_type: 'bedsheet', service_type: 'wash_iron', price: 4500 },
      { id: 211, clothing_type: 'blanket', service_type: 'wash_only', price: 5500 },
      { id: 212, clothing_type: 'shoes', service_type: 'wash_only', price: 3500 },
      { id: 213, clothing_type: 'shoes', service_type: 'dry_clean', price: 5500 },
    ],
    reviews: [
      { id: 4, customer: 'Sarah L.', rating: 5, comment: 'Same-day delivery as promised! My suit looks perfect.', date: '2025-12-14' },
      { id: 5, customer: 'Mike B.', rating: 5, comment: 'Professional service. They even called to confirm my order.', date: '2025-12-01' },
    ],
  },
  {
    id: 3,
    name: 'Karibu Laundry Hub',
    description: 'Affordable laundry for the whole family. Budget-friendly prices without compromising quality. Great for bulk orders!',
    address: 'Shekilango Rd, Sinza',
    city: 'Dar es Salaam',
    region: 'Sinza',
    latitude: -6.7850,
    longitude: 39.2350,
    phone: '0765 789 012',
    photos: [
      'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600',
    ],
    operating_hours: { open: '07:30', close: '19:00', days: 'Mon–Sat' },
    is_approved: true,
    is_active: true,
    rating_avg: 4.4,
    total_orders: 203,
    total_reviews: 45,
    owner_name: 'Fatma Juma',
    min_price: 1000,
    delivery_zones: [
      { zone_name: 'Sinza Area', fee: 2000, description: 'Within 3km' },
      { zone_name: 'Kinondoni / Mwenge', fee: 3500, description: '3-7km' },
    ],
    services: [
      { id: 301, clothing_type: 'shirt', service_type: 'wash_only', price: 1000 },
      { id: 302, clothing_type: 'shirt', service_type: 'wash_iron', price: 2000 },
      { id: 303, clothing_type: 'trousers', service_type: 'wash_only', price: 1000 },
      { id: 304, clothing_type: 'trousers', service_type: 'wash_iron', price: 2000 },
      { id: 305, clothing_type: 'dress', service_type: 'wash_iron', price: 3000 },
      { id: 306, clothing_type: 'kitenge', service_type: 'wash_iron', price: 2000 },
      { id: 307, clothing_type: 'bedsheet', service_type: 'wash_only', price: 2500 },
      { id: 308, clothing_type: 'blanket', service_type: 'wash_only', price: 4000 },
      { id: 309, clothing_type: 'underwear', service_type: 'wash_only', price: 500 },
    ],
    reviews: [
      { id: 6, customer: 'Anna P.', rating: 4, comment: 'Great prices for families! I bring all our clothes here.', date: '2025-12-05' },
    ],
  },
  {
    id: 4,
    name: 'Sparkle Dry Cleaners',
    description: 'Premium dry cleaning specialists serving Masaki and Oysterbay. Expert care for suits, formal wear, and delicate fabrics.',
    address: 'Haile Selassie Rd, Masaki',
    city: 'Dar es Salaam',
    region: 'Masaki',
    latitude: -6.7470,
    longitude: 39.2740,
    phone: '0787 234 567',
    photos: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600',
    ],
    operating_hours: { open: '08:00', close: '20:00', days: 'Mon–Sun' },
    is_approved: true,
    is_active: true,
    rating_avg: 4.8,
    total_orders: 412,
    total_reviews: 98,
    owner_name: 'James Kimario',
    min_price: 3000,
    delivery_zones: [
      { zone_name: 'Masaki / Oysterbay', fee: 2500, description: 'Within 3km' },
      { zone_name: 'Mikocheni / Msasani', fee: 5000, description: '3-7km' },
      { zone_name: 'CBD / Kinondoni', fee: 8000, description: '7-15km' },
    ],
    services: [
      { id: 401, clothing_type: 'suit', service_type: 'dry_clean', price: 15000 },
      { id: 402, clothing_type: 'suit', service_type: 'wash_iron', price: 8000 },
      { id: 403, clothing_type: 'shirt', service_type: 'dry_clean', price: 5000 },
      { id: 404, clothing_type: 'shirt', service_type: 'wash_iron', price: 3000 },
      { id: 405, clothing_type: 'dress', service_type: 'dry_clean', price: 7000 },
      { id: 406, clothing_type: 'dress', service_type: 'special', price: 10000 },
      { id: 407, clothing_type: 'curtain', service_type: 'dry_clean', price: 8000 },
      { id: 408, clothing_type: 'blanket', service_type: 'dry_clean', price: 10000 },
    ],
    reviews: [
      { id: 7, customer: 'Richard N.', rating: 5, comment: 'The ONLY place I trust with my suits. Worth every shilling.', date: '2025-12-12' },
      { id: 8, customer: 'Linda W.', rating: 5, comment: 'My wedding dress came out absolutely perfect!', date: '2025-11-20' },
    ],
  },
  {
    id: 5,
    name: 'Upendo Laundry Services',
    description: 'Your reliable neighbourhood laundry in Mbezi Beach. Family-owned and operated with love and care for 8 years.',
    address: 'Mbezi Beach Rd, Mbezi',
    city: 'Dar es Salaam',
    region: 'Mbezi Beach',
    latitude: -6.7210,
    longitude: 39.2110,
    phone: '0712 567 890',
    photos: [
      'https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=600',
    ],
    operating_hours: { open: '07:00', close: '19:30', days: 'Mon–Sat' },
    is_approved: true,
    is_active: true,
    rating_avg: 4.5,
    total_orders: 178,
    total_reviews: 34,
    owner_name: 'Rose Mtui',
    min_price: 1500,
    delivery_zones: [
      { zone_name: 'Mbezi Beach', fee: 2000, description: 'Within 3km' },
      { zone_name: 'Tegeta / Kawe', fee: 4000, description: '3-7km' },
    ],
    services: [
      { id: 501, clothing_type: 'shirt', service_type: 'wash_iron', price: 2500 },
      { id: 502, clothing_type: 'trousers', service_type: 'wash_iron', price: 2500 },
      { id: 503, clothing_type: 'dress', service_type: 'wash_iron', price: 3500 },
      { id: 504, clothing_type: 'kitenge', service_type: 'wash_iron', price: 2500 },
      { id: 505, clothing_type: 'kitenge', service_type: 'special', price: 4000 },
      { id: 506, clothing_type: 'bedsheet', service_type: 'wash_iron', price: 4000 },
      { id: 507, clothing_type: 'blanket', service_type: 'wash_only', price: 5000 },
      { id: 508, clothing_type: 'shoes', service_type: 'wash_only', price: 3000 },
    ],
    reviews: [
      { id: 9, customer: 'Peter K.', rating: 5, comment: 'Reliable and honest. My go-to for years!', date: '2025-12-08' },
    ],
  },
];

export const mockOrders = [
  {
    id: 'LC-2025-0042',
    shop: mockShops[1],
    status: 'washing',
    items: [
      { clothing_type: 'shirt', service_type: 'wash_iron', quantity: 5, unit_price: 3000, total: 15000 },
      { clothing_type: 'trousers', service_type: 'wash_iron', quantity: 3, unit_price: 3000, total: 9000 },
    ],
    subtotal: 24000,
    delivery_fee: 2000,
    platform_commission: 2600,
    total_amount: 26000,
    delivery_address: 'Mikocheni B, near Shoppers Plaza',
    payment_status: 'paid',
    payment_method: 'M-Pesa',
    created_at: '2025-12-18T10:30:00',
    status_history: [
      { status: 'placed', timestamp: '2025-12-18T10:30:00' },
      { status: 'confirmed', timestamp: '2025-12-18T10:45:00' },
      { status: 'picked_up', timestamp: '2025-12-18T12:00:00' },
      { status: 'washing', timestamp: '2025-12-18T14:00:00' },
    ],
  },
  {
    id: 'LC-2025-0041',
    shop: mockShops[0],
    status: 'delivered',
    items: [
      { clothing_type: 'kitenge', service_type: 'special', quantity: 2, unit_price: 4000, total: 8000 },
      { clothing_type: 'dress', service_type: 'wash_iron', quantity: 1, unit_price: 3500, total: 3500 },
    ],
    subtotal: 11500,
    delivery_fee: 2000,
    platform_commission: 1350,
    total_amount: 13500,
    delivery_address: 'Kinondoni A, Block 7',
    payment_status: 'paid',
    payment_method: 'Airtel Money',
    created_at: '2025-12-15T09:00:00',
    status_history: [
      { status: 'placed', timestamp: '2025-12-15T09:00:00' },
      { status: 'confirmed', timestamp: '2025-12-15T09:15:00' },
      { status: 'picked_up', timestamp: '2025-12-15T11:00:00' },
      { status: 'washing', timestamp: '2025-12-15T13:00:00' },
      { status: 'ready', timestamp: '2025-12-15T18:00:00' },
      { status: 'out_for_delivery', timestamp: '2025-12-16T08:30:00' },
      { status: 'delivered', timestamp: '2025-12-16T10:00:00' },
    ],
  },
  {
    id: 'LC-2025-0039',
    shop: mockShops[3],
    status: 'delivered',
    items: [
      { clothing_type: 'suit', service_type: 'dry_clean', quantity: 2, unit_price: 15000, total: 30000 },
    ],
    subtotal: 30000,
    delivery_fee: 5000,
    platform_commission: 3500,
    total_amount: 35000,
    delivery_address: 'Msasani Peninsula',
    payment_status: 'paid',
    payment_method: 'Visa Card',
    created_at: '2025-12-10T14:00:00',
    status_history: [
      { status: 'placed', timestamp: '2025-12-10T14:00:00' },
      { status: 'confirmed', timestamp: '2025-12-10T14:10:00' },
      { status: 'picked_up', timestamp: '2025-12-10T16:00:00' },
      { status: 'washing', timestamp: '2025-12-10T17:00:00' },
      { status: 'ready', timestamp: '2025-12-12T10:00:00' },
      { status: 'out_for_delivery', timestamp: '2025-12-12T14:00:00' },
      { status: 'delivered', timestamp: '2025-12-12T15:30:00' },
    ],
  },
];

export const mockUser = {
  id: 1,
  full_name: 'Japhet',
  phone: '0712 345 678',
  email: 'japhet@example.com',
  role: 'customer',
  avatar_url: null,
  is_verified: true,
  saved_addresses: [
    { id: 1, label: 'Home', address: 'Mikocheni B, near Shoppers Plaza', is_default: true },
    { id: 2, label: 'Office', address: 'Samora Avenue, CBD', is_default: false },
  ],
};

// Helpers
export function formatTZS(amount) {
  return `TZS ${amount.toLocaleString()}`;
}

export function getClothingLabel(id) {
  return CLOTHING_TYPES.find(c => c.id === id)?.label || id;
}

export function getClothingIcon(id) {
  return CLOTHING_TYPES.find(c => c.id === id)?.icon || '👕';
}

export function getServiceLabel(id) {
  return SERVICE_TYPES.find(s => s.id === id)?.label || id;
}

export function getStatusInfo(id) {
  return ORDER_STATUSES.find(s => s.id === id) || { label: id, icon: '📋', color: 'gray' };
}

export function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
