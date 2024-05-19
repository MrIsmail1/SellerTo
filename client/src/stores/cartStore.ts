import { defineStore } from 'pinia';
import axios from '../plugins/axios';

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
        this.error = error.message;
      }
    },
    async removeFromCart(productId) {
      try {
        await axios.post('/cart/remove', { productId });
        this.cart = this.cart.filter(item => item.productId !== productId);
      } catch (error) {
        console.error(error);
        this.error = error.message;
      }
    },
    async confirmPurchase(productId) {
      try {
        await axios.post('/cart/confirm', { productId });
        this.cart = this.cart.filter(item => item.productId !== productId);
      } catch (error) {
        console.error(error);
        this.error = error.message;
      }
    },
  },
});
