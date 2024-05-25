import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
    loading: false,
    error: null,
  }),
  getters: {
    ramdomProducts() {
      return this.products.sort(() => Math.random() - 0.5);
    },
    productCategories() {
      const categories = this.products.map(product => product.product_category);
      return [...new Set(categories)];
    },
  },
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get('/product');
        this.products = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async searchProductByTitle(title: string) {
      this.loading = true;
      try {
        const response = await axios.get('/product/search', {
          params: { title }
        });
        this.products = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
