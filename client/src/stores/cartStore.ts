import { defineStore } from 'pinia';
import axios from '@/plugins/axios';
import { loadStripe } from '@stripe/stripe-js';
import { useAuthStore } from '@/stores/authStore';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
    loading: false,
    error: null,
    paymentLink: null,
    discount: 0,
    errorMessage: '',
    promoCodeDetails: null,
  }),
  getters: {
    groupedCart: (state) => {
      const grouped = [];
      state.cart.forEach(item => {
        if (item.Product && item.Product.id) {
          const existingItem = grouped.find(groupedItem => groupedItem.Product.id === item.Product.id);
          if (existingItem) {
            existingItem.quantity += item.quantity;
          } else {
            grouped.push({ ...item });
          }
        } else {
          console.error("Invalid product in cart item", item);
        }
      });
      return grouped;
    },
    subTotal: (state) => {
      return state.groupedCart.reduce((total, item) => total + (item.Product ? item.Product.product_price * item.quantity : 0), 0);
    },
    total: (state) => {
      const serviceFee = 6.49;
      const discount = state.calculateDiscount();
      return state.subTotal + serviceFee - discount;
    },
    discountPercentage: (state) => {
      return state.promoCodeDetails ? state.promoCodeDetails.discount : 0;
    },
    discountAmount: (state) => {
      return state.calculateDiscount();
    },
  },
  actions: {
    calculateDiscount() {
      if (!this.promoCodeDetails) return 0;

      let discount = 0;
      this.groupedCart.forEach(item => {
        if (this.promoCodeDetails.product_id && item.Product.id === this.promoCodeDetails.product_id) {
          discount += (item.Product.product_price * item.quantity) * (this.promoCodeDetails.discount / 100);
        } else if (this.promoCodeDetails.category && item.Product.product_category === this.promoCodeDetails.category) {
          discount += (item.Product.product_price * item.quantity) * (this.promoCodeDetails.discount / 100);
        }
      });
      return discount;
    },
    async fetchCart() {
      this.loading = true;
      try {
        const response = await axios.get('/cart');
        this.cart = response.data.filter(item => item.Product);
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
        const response = await axios.post('/cart', { productId });
        const cartItem = response.data;
        if (cartItem && cartItem.Product) {
          const existingItem = this.cart.find(item => item.Product && item.Product.id === cartItem.Product.id);
          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            this.cart.push(cartItem);
          }
        } else {
          console.error("Invalid response data", response.data);
        }
      } catch (error) {
        console.error(error);
      }
    },
    async removeFromCart(cartItemId) {
      try {
        await axios.delete('/cart', { data: { cartItemId } });
        this.cart = this.cart.filter(item => item.id !== cartItemId);
      } catch (error) {
        console.error(error);
      }
    },
    async updateQuantity(productId, quantity) {
      try {
        const existingItem = this.cart.find(item => item.Product && item.Product.id === productId);
        if (existingItem) {
          const response = await axios.put('/cart', { cartItemId: existingItem.id, quantity });
          existingItem.quantity = quantity;
          this.cart = [...this.cart];
        }
      } catch (error) {
        console.error(error);
      }
    },
    async confirmPurchase() {
      try {
        const authStore = useAuthStore();
        const userId = authStore.user.id;

        const stripe = await stripePromise;

        const items = this.groupedCart.map(item => ({
          name: item.Product.product_title,
          amount: Math.round((item.Product.product_price * 100) * (1 - (this.promoCodeDetails && (this.promoCodeDetails.product_id === item.Product.id || this.promoCodeDetails.category === item.Product.product_category) ? this.promoCodeDetails.discount / 100 : 0))), // Amount in cents
          productId: item.Product.id,
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
          name: item.Product.product_title,
          amount: Math.round((item.Product.product_price * 100) * (1 - (this.promoCodeDetails && (this.promoCodeDetails.product_id === item.Product.id || this.promoCodeDetails.category === item.Product.product_category) ? this.promoCodeDetails.discount / 100 : 0))), // Amount in cents
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
          amount: amount ? amount * 100 : undefined,
        });
        console.log('Refund created:', response.data);
      } catch (error) {
        console.error('Error creating refund:', error);
      }
    },
    async applyPromoCode(code) {
      try {
        const response = await axios.post('/promocodes/validate', { code });
        const promoCode = response.data;

        const valid = this.groupedCart.some(item => {
          const productMatch = promoCode.product_id && item.Product.id === promoCode.product_id;
          const categoryMatch = promoCode.category && item.Product.product_category === promoCode.category;
          return productMatch || categoryMatch;
        });

        if (valid && new Date(promoCode.expiry_date) > new Date()) {
          this.promoCodeDetails = promoCode;
          this.errorMessage = '';
        } else {
          this.promoCodeDetails = null;
          this.errorMessage = 'Code promo invalide ou expiré';
        }
      } catch (error) {
        console.error('Error applying promo code:', error);
        this.promoCodeDetails = null;
        this.errorMessage = 'Code promo invalide ou expiré';
      }
    }
  },
});
