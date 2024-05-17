import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useProductDetailStore = defineStore('productDetail', {
  state: () => ({
    productDetail: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchProductDetail(productId) {
      this.loading = true;
      try {
        const response = await axios.get(`/product-detail/${productId}`);
        this.productDetail = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
