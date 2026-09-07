import axios from 'axios';
import { API_BASE_URL, getApiUrl } from '@/config/api';
import { getAccessToken } from '@/lib/auth';

export interface CartItem {
  id?: number;
  product: {
    id: number;
    name: string;
    price: string;
    image?: string;
  };
  quantity: number;
  price?: string;
}

export interface Cart {
  id?: number;
  items: CartItem[];
  total_price: string;
  total_items: number;
}

const ANONYMOUS_CART_KEY = 'plasticprecious_cart';

class CartService {
  private isAuthenticated(): boolean {
    return !!getAccessToken();
  }

  private getAuthHeaders() {
    const token = getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  private getAnonymousCart(): Cart {
    try {
      const stored = localStorage.getItem(ANONYMOUS_CART_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (err) {
      console.error('Failed to parse anonymous cart:', err);
    }
    return { items: [], total_price: '0', total_items: 0 };
  }

  private saveAnonymousCart(cart: Cart): void {
    try {
      localStorage.setItem(ANONYMOUS_CART_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error('Failed to save anonymous cart:', err);
    }
  }

  private calculateCartTotals(cart: Cart): Cart {
    let total = 0;
    let count = 0;

    cart.items.forEach(item => {
      const price = parseFloat(item.product.price || '0');
      total += price * item.quantity;
      count += item.quantity;
    });

    return {
      ...cart,
      total_price: total.toString(),
      total_items: count,
    };
  }

  async getCart(): Promise<Cart> {
    // If not authenticated, return anonymous cart from localStorage
    if (!this.isAuthenticated()) {
      return this.getAnonymousCart();
    }

    try {
      const response = await axios.get(getApiUrl('/cart/'), {
        headers: this.getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Fallback to anonymous cart on error
      return this.getAnonymousCart();
    }
  }

  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    // If not authenticated, add to localStorage cart
    if (!this.isAuthenticated()) {
      const cart = this.getAnonymousCart();
      const existingItem = cart.items.find(item => item.product.id === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        // Fetch product details for anonymous cart
        try {
          const productRes = await axios.get(getApiUrl(`/products/${productId}/`));
          const product = productRes.data;
          cart.items.push({
            product: {
              id: product.id,
              name: product.name,
              price: product.price.toString(),
              image: product.image,
            },
            quantity,
          });
        } catch (error) {
          console.error('Failed to fetch product:', error);
          throw new Error('Failed to add product to cart');
        }
      }

      const updatedCart = this.calculateCartTotals(cart);
      this.saveAnonymousCart(updatedCart);
      return updatedCart;
    }

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
    // If not authenticated, update anonymous cart
    if (!this.isAuthenticated()) {
      const cart = this.getAnonymousCart();
      const item = cart.items[cartItemId]; // Use index as ID for anonymous cart

      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
          cart.items.splice(cartItemId, 1);
        }
      }

      const updatedCart = this.calculateCartTotals(cart);
      this.saveAnonymousCart(updatedCart);
      return updatedCart;
    }

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
    // If not authenticated, remove from anonymous cart
    if (!this.isAuthenticated()) {
      const cart = this.getAnonymousCart();
      cart.items.splice(cartItemId, 1);

      const updatedCart = this.calculateCartTotals(cart);
      this.saveAnonymousCart(updatedCart);
      return updatedCart;
    }

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
    // If not authenticated, clear anonymous cart
    if (!this.isAuthenticated()) {
      localStorage.removeItem(ANONYMOUS_CART_KEY);
      return;
    }

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

  async mergeAnonymousCart(): Promise<Cart> {
    // Merge anonymous cart items into authenticated cart
    if (!this.isAuthenticated()) {
      return this.getAnonymousCart();
    }

    try {
      const anonymousCart = this.getAnonymousCart();
      if (anonymousCart.items.length === 0) {
        // No anonymous cart to merge, just return authenticated cart
        return this.getCart();
      }

      // Add all anonymous cart items to authenticated cart
      for (const item of anonymousCart.items) {
        await this.addToCart(item.product.id, item.quantity);
      }

      // Clear anonymous cart after merge
      localStorage.removeItem(ANONYMOUS_CART_KEY);

      // Return final cart
      return this.getCart();
    } catch (error) {
      console.error('Failed to merge anonymous cart:', error);
      throw error;
    }
  }
}

export const cartService = new CartService();
