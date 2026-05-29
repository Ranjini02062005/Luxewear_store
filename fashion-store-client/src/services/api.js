const BASE_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ── Products ──
export const getProducts = (category, search, sub_category) => {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search)       params.append('search', search);
  if (sub_category && sub_category !== 'All') params.append('sub_category', sub_category);
  const url = `${BASE_URL}/products${params.toString() ? '?' + params : ''}`;
  return fetch(url).then(handleResponse);
};

export const getSubCategories = (category) => {
  const url = `${BASE_URL}/products/sub-categories?category=${encodeURIComponent(category)}`;
  return fetch(url).then(handleResponse);
};

export const getProduct = (id) =>
  fetch(`${BASE_URL}/products/${id}`).then(handleResponse);

// ── Auth ──
export const login = (data) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data)
  }).then(handleResponse);

export const register = (data) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data)
  }).then(handleResponse);

export const getMe = () =>
  fetch(`${BASE_URL}/auth/me`, { headers: headers() }).then(handleResponse);

// ── Cart ──
export const getCart = () =>
  fetch(`${BASE_URL}/cart`, { headers: headers() }).then(handleResponse);

export const addToCart = (product_id, quantity = 1) =>
  fetch(`${BASE_URL}/cart`, {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ product_id, quantity })
  }).then(handleResponse);

export const updateCartItem = (id, quantity) =>
  fetch(`${BASE_URL}/cart/${id}`, {
    method: 'PUT', headers: headers(),
    body: JSON.stringify({ quantity })
  }).then(handleResponse);

export const removeFromCart = (id) =>
  fetch(`${BASE_URL}/cart/${id}`, {
    method: 'DELETE', headers: headers()
  }).then(handleResponse);

// ── Orders ──
export const placeOrder = (address) =>
  fetch(`${BASE_URL}/orders`, {
    method: 'POST', headers: headers(),
    body: JSON.stringify({ address })
  }).then(handleResponse);

export const getOrders = () =>
  fetch(`${BASE_URL}/orders`, { headers: headers() }).then(handleResponse);