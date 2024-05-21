import { defineStore } from 'pinia';
import axios from '../plugins/axios';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '@/stores/authStore';

const stripePromise = loadStripe("pk_test_51PIDv1GO9b6wjgsN2GXoMsD353SOOiru1fzLBhVTIyg46HoSzsxRAk3ZQvjd7AL87aRE6LQnOHFHnKMx6SJfP9gX00AoaEwRjo");

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchCart() {
      this.loading = true;
      try {
        const response = await axios.get('/cart');
        this.cart = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async addToCart(productId) {
      try {
        const response = await axios.post('/cart/add', { productId });
        this.cart.push(response.data);
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
        const userId = authStore.user.user.id;
        console.log("User ID:", userId); 

        const stripe = await stripePromise;

        const items = this.cart.map(item => ({
          name: item.productId.product_title,
          amount: item.productId.product_price * 100,
          quantity: 1,
        }));

        const response = await axios.post('/payment', {
          items,
          userId: userId.toString(),
        });

        const sessionId = response.data.sessionId;

        const result = await stripe.redirectToCheckout({ sessionId });

        if (result.error) {
          console.error(result.error.message);
        } else {
          // Vider le panier après le paiement réussi
          this.clearCart();
        }
      } catch (error) {
        console.error(error);
      }
    },
    async clearCart() {
      this.cart = [];
    },
  },
});
