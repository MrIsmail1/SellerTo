import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useProductsStore = defineStore('products', {
    state: () => ({
        products: [],
        filteredProducts: [],
        loading: false,
        error: null,
        filters: {
            series: [],
            sizeSsd: [],
            sizeRam: [],
            sizeScreen: [],
            typeOfProcessor: [],
            speedOfProcessor: [],
            typeOfStorage: [],
            color: [],
            resolution: [],
            gpu: [],
            weight: [],
            keyboardAndLanguage: []
        },
        previousFilters: {}
    }),
    getters: {
        randomProducts(state) {
            return [...state.products].sort(() => Math.random() - 0.5);
        },
        productCategories(state) {
            const categories = state.products.map(product => product.product_category);
            return [...new Set(categories)];
        },
    },
    actions: {
        async fetchProducts() {
            this.loading = true;
            try {
                const response = await axios.get('/products');
                this.products = response.data;
                this.filteredProducts = response.data;
                this.error = null;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async fetchFilteredProducts() {
            this.loading = true;
            try {
                const params = { ...this.filters };

                Object.keys(params).forEach(key => {
                    if (Array.isArray(params[key]) && params[key].length > 0) {
                        params[key] = params[key].join(',');
                    } else if (Array.isArray(params[key]) && params[key].length === 0) {
                        delete params[key];
                    }
                });

                const response = await axios.get('/products', { params });
                this.filteredProducts = response.data;
                this.error = null;
            } catch (error) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },

        async searchProductByTitleOrDescription(query) {
            try {
                const params = { query, ...this.filters };

                Object.keys(params).forEach(key => {
                    if (Array.isArray(params[key]) && params[key].length > 0) {
                        params[key] = params[key].join(',');
                    } else if (Array.isArray(params[key]) && params[key].length === 0) {
                        delete params[key];
                    }
                });

                const response = await axios.get('/products/search', { params });
                this.filteredProducts = response.data;
            } catch (error) {
                console.error('Failed to search products:', error);
            }
        },
    },
});
