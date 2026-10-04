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
  id?: number;
  product: Product | {
    id: number;
    name: string;
    price: string;
    image?: string;
  };
  quantity: number;
}

export interface Cart {
  id?: number;
  user?: number;
  items: CartItem[];
  total_price: string;
  total_items: number;
  created_at?: string;
  updated_at?: string;
}

export interface Order {
  id: number;
  user: number;
  items: CartItem[];
  total_price: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_number?: string;
  payment_method?: string;
  // Delivery: Gambian orders use delivery_location; international orders use the postal fields
  shipping_country?: string;
  shipping_country_name?: string;
  is_international?: boolean;
  shipping_name?: string;
  shipping_phone?: string;
  shipping_email?: string;
  delivery_location?: string;
  shipping_address_line1?: string;
  shipping_house_number?: string;
  shipping_address_line2?: string;
  shipping_city?: string;
  shipping_region?: string;
  shipping_postal_code?: string;
  shipping_po_box?: string;
  delivery_fee?: string;
  // Ready-to-display address lines built by the backend
  shipping_address?: string[];
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
