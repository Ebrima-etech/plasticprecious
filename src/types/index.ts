export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  category: number;
  stock: number;
  rating: number;
  reviews_count: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user: number;
  items: CartItem[];
  total_price: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  shipping_address: Address;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Address {
  id: number;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface Payment {
  id: number;
  order: number;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  created_at: string;
}
