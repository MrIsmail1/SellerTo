import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '@/stores/authStore';

const stripePromise = loadStripe("pk_test_51PIDv1GO9b6wjgsN2GXoMsD353SOOiru1fzLBhVTIyg46HoSzsxRAk3ZQvjd7AL87aRE6LQnOHFHnKMx6SJfP9gX00AoaEwRjo");

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
    loading: false,
    error: null,
    paymentLink: null,
  }),
  getters: {
    groupedCart: (state) => {
      const grouped = [];
      state.cart.forEach(item => {
        if (item.productId && item.productId._id) {
          const existingItem = grouped.find(groupedItem => groupedItem.productId._id === item.productId._id);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            grouped.push({ ...item });
          }
        } else {
          console.error("Invalid productId in cart item", item);
        }
      });
      return grouped;
    },
    subTotal: (state) => {
      return state.groupedCart.reduce((total, item) => total + item.productId.product_price * item.quantity, 0);
    },
    total: (state) => {
      const serviceFee = 6.49;
      return state.groupedCart.reduce((total, item) => total + item.productId.product_price * item.quantity, 0) + serviceFee;
    }
  },
  actions: {
    async fetchCart() {
      this.loading = true;
      try {
        const response = await axios.get('/cart');
        this.cart = response.data.filter(item => item.productId);
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async addToCart(productId) {
      if (!productId) {
        console.error("Product ID is required");
        return;
      }
      try {
        const response = await axios.post('/cart/add', { productId });
        const cartItem = response.data;
        const existingItem = this.cart.find(item => item.productId._id === cartItem.productId._id);
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          this.cart.push(cartItem);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async removeFromCart(cartItemId) {
      try {
        await axios.post('/cart/remove', { cartItemId });
        this.cart = this.cart.filter(item => item._id !== cartItemId);
      } catch (error) {
        console.error(error);
      }
    },
    async updateQuantity(productId, quantity) {
      try {
        const existingItem = this.cart.find(item => item.productId._id === productId);
        if (existingItem) {
          const response = await axios.put('/cart/update', { cartItemId: existingItem._id, quantity });
          existingItem.quantity = quantity;
          this.cart = [...this.cart]; 
        }
      } catch (error) {
        console.error(error);
      }
    },
    async confirmPurchase(productId) {
      try {
        await axios.post('/cart/confirm', { productId });
        this.cart = this.cart.filter(item => item.productId !== productId);
      } catch (error) {
        console.error(error);
      }
    },
    async handleCheckout() {
      try {
        const authStore = useAuthStore(); 
        const userId = authStore.user.id;

        const stripe = await stripePromise;

        const items = this.groupedCart.map(item => ({
          name: item.productId.product_title,
          amount: item.productId.product_price * 100,
          quantity: item.quantity,
        }));

        const response = await axios.post('/payments', {
          items,
          userId: userId.toString(),
        });

        const sessionId = response.data.sessionId;

        const result = await stripe.redirectToCheckout({ sessionId });

        if (result.error) {
          console.error(result.error.message);
        } else {
          this.clearCart();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async clearCart() {
      this.cart = [];
    },
    async generatePaymentLink() {
      try {
        const authStore = useAuthStore(); 
        const userId = authStore.user.id;

        const items = this.groupedCart.map(item => ({
          name: item.productId.product_title,
          amount: item.productId.product_price * 100,
          quantity: item.quantity,
        }));

        const response = await axios.post('/payments/unique-payment-link', {
          items,
          userId: userId.toString(),
        });

        this.paymentLink = response.data.paymentUrl;
      } catch (error) {
        console.error('Error generating payment link:', error);
        this.paymentLink = null;
      }
    },
    async createRefund(paymentIntentId, amount) {
      try {
        const response = await axios.post('/payments/refund', {
          paymentIntentId,
          amount,
        });
        console.log('Refund created:', response.data);
      } catch (error) {
        console.error('Error creating refund:', error);
      }
    },
  },
});