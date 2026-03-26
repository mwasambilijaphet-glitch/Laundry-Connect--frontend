/**
 * LAUNDRY CONNECT — API Service
 * 
 * All backend API calls go through here.
 * In dev: Vite proxy forwards /api/* to localhost:5000
 * In prod: calls Render backend directly
 */

export const API_BASE = '/api';

// ── Token management ──────────────────────────────────────
let accessToken = localStorage.getItem('lc_token') || null;
let refreshToken = localStorage.getItem('lc_refresh') || null;

export function setTokens(token, refresh) {
  accessToken = token;
  refreshToken = refresh;
  if (token) localStorage.setItem('lc_token', token);
  else localStorage.removeItem('lc_token');
  if (refresh) localStorage.setItem('lc_refresh', refresh);
  else localStorage.removeItem('lc_refresh');
}

export function clearTokens() {
  accessToken = null;
  refreshToken = null;
  localStorage.removeItem('lc_token');
  localStorage.removeItem('lc_refresh');
}

export function getToken() {
  return accessToken;
}

// ── Base fetch wrapper ────────────────────────────────────
async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new Error('Cannot connect to server. Please check your internet connection and try again.');
  }

  if (response.status === 401 && refreshToken) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      headers['Authorization'] = `Bearer ${accessToken}`;
      const retryResponse = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
      return handleResponse(retryResponse);
    } else {
      clearTokens();
      window.location.href = '/auth';
      throw new Error('Session expired');
    }
  }

  return handleResponse(response);
}

async function handleResponse(response) {
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    if (response.status === 502 || response.status === 503 || response.status === 0) {
      throw new Error('Server is starting up, please wait 30 seconds and try again');
    }
    throw new Error('Server returned an invalid response (status ' + response.status + ')');
  }
  if (!response.ok) {
    if (response.status === 500) {
      throw new Error(data.message || 'Server error. The backend may still be starting up — please try again in 30 seconds.');
    }
    throw new Error(data.message || 'Request failed (status ' + response.status + ')');
  }
  return data;
}

async function tryRefreshToken() {
  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (response.ok) {
      const data = await response.json();
      setTokens(data.token, refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ── AUTH API ──────────────────────────────────────────────

export async function apiRegister({ full_name, phone, email, password, role, otp_channel }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ full_name, phone, email, password, role, otp_channel: otp_channel || 'sms' }),
  });
}

export async function apiLogin(phone, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  });
  if (data.success) {
    setTokens(data.token, data.refreshToken);
  }
  return data;
}

export async function apiVerifyOTP(email, otp_code) {
  const data = await request('/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp_code }),
  });
  if (data.success) {
    setTokens(data.token, data.refreshToken);
  }
  return data;
}

export async function apiGetMe() {
  return request('/auth/me');
}

// ── SHOPS API ─────────────────────────────────────────────

export async function apiGetShops(params = {}) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  if (params.city) query.set('city', params.city);
  const qs = query.toString();
  return request(`/shops${qs ? `?${qs}` : ''}`);
}

export async function apiGetShop(id) {
  return request(`/shops/${id}`);
}

// ── ORDERS API ────────────────────────────────────────────

export async function apiCreateOrder(orderData) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

export async function apiGetOrders(status) {
  const qs = status ? `?status=${status}` : '';
  return request(`/orders${qs}`);
}

export async function apiGetOrder(orderNumber) {
  return request(`/orders/${orderNumber}`);
}

// ── PAYMENTS API ──────────────────────────────────────────

export async function apiInitiatePayment({ order_id, method, phone }) {
  return request('/payments/initiate', {
    method: 'POST',
    body: JSON.stringify({ order_id, method, phone }),
  });
}

// ── OWNER API ─────────────────────────────────────────────

export async function apiOwnerGetShop() {
  return request('/owner/shop');
}

export async function apiOwnerGetDashboard() {
  return request('/owner/dashboard');
}

export async function apiOwnerGetOrders(status) {
  const qs = status ? `?status=${status}` : '';
  return request(`/owner/orders${qs}`);
}

export async function apiOwnerUpdateOrderStatus(orderId, status) {
  return request(`/owner/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function apiOwnerGetServices() {
  return request('/owner/services');
}

export async function apiOwnerAddService({ clothing_type, service_type, price }) {
  return request('/owner/services', {
    method: 'POST',
    body: JSON.stringify({ clothing_type, service_type, price }),
  });
}

export async function apiOwnerDeleteService(id) {
  return request(`/owner/services/${id}`, { method: 'DELETE' });
}

export async function apiOwnerGetEarnings() {
  return request('/owner/earnings');
}

export async function apiOwnerUpdateShop(data) {
  return request('/owner/shop', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ── MESSAGES API ──────────────────────────────────────────

export async function apiGetConversations() {
  return request('/messages/conversations');
}

export async function apiGetUnreadCount() {
  return request('/messages/unread-count');
}

export async function apiStartConversation(shop_id, order_id) {
  return request('/messages/start', {
    method: 'POST',
    body: JSON.stringify({ shop_id, order_id }),
  });
}

export async function apiGetMessages(conversationId) {
  return request(`/messages/${conversationId}`);
}

export async function apiSendMessage(conversationId, content) {
  return request(`/messages/${conversationId}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// ── ADMIN API ─────────────────────────────────────────────

export async function apiAdminGetDashboard() {
  return request('/admin/dashboard');
}

export async function apiAdminGetPendingShops() {
  return request('/admin/shops/pending');
}

export async function apiAdminApproveShop(id, approved) {
  return request(`/admin/shops/${id}/approve`, {
    method: 'PATCH',
    body: JSON.stringify({ approved }),
  });
}

export async function apiAdminGetUsers(role) {
  const qs = role ? `?role=${role}` : '';
  return request(`/admin/users${qs}`);
}

export async function apiAdminGetOrders() {
  return request('/admin/orders');
}

export async function apiAdminGetTransactions() {
  return request('/admin/transactions');
}