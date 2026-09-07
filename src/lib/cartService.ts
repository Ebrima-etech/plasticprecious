import axios from 'axios';
import { API_BASE_URL, getApiUrl } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

export interface CartItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: string;
    image?: string;
  };
  quantity: number;
  price: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total_price: string;
  total_items: number;
}

class CartService {
  private getAuthHeaders() {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getCart(): Promise<Cart> {
    try {
      const response = await axios.get(getApiUrl('/cart/'), {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      throw error;
    }
  }

  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    try {
      const response = await axios.post(
        getApiUrl('/cart/add_item/'),
        {
          product_id: productId,
          quantity,
        },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  }

  async updateCartItem(cartItemId: number, quantity: number): Promise<Cart> {
    try {
      const response = await axios.patch(
        getApiUrl('/cart/update_item/'),
        {
          cart_item_id: cartItemId,
          quantity,
        },
        {
          headers: this.getAuthHeaders(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    }
  }

  async removeFromCart(cartItemId: number): Promise<Cart> {
    try {
      const response = await axios.delete(getApiUrl('/cart/remove_item/'), {
        data: { cart_item_id: cartItemId },
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      await axios.post(
        getApiUrl('/cart/clear/'),
        {},
        {
          headers: this.getAuthHeaders(),
        }
      );
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();
