// API URL - Production Render backend
export const API_BASE_URL = 'https://preciousback.onrender.com/api';

export const API_ENDPOINTS = {
  // Products
  PRODUCTS: '/products/',
  PRODUCT_DETAIL: (id: string | number) => `/products/${id}/`,
  CATEGORIES: '/categories/',

  // Auth
  REGISTER: '/auth/register/',
  LOGIN: '/auth/login/',
  LOGOUT: '/auth/logout/',
  REFRESH_TOKEN: '/auth/refresh/',

  // Orders
  ORDERS: '/orders/',
  ORDER_DETAIL: (id: string | number) => `/orders/${id}/`,
  ORDER_STATUS: (id: string | number) => `/orders/${id}/status/`,

  // Cart
  CART: '/cart/',
  CART_ITEMS: '/cart/items/',

  // Payments
  PAYMENTS: '/payments/',
  CREATE_PAYMENT: '/payments/create/',

  // User
  USER_PROFILE: '/user/profile/',
  USER_ADDRESSES: '/user/addresses/',
};

export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint}`;
};
