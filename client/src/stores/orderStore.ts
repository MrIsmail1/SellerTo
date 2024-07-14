import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
        order: null,
        loading: false,
        error: null,
    }),
    getters: {
        allOrders(state) {
            return state.orders;
        },
    },
    actions: {
        async fetchOrders() {
            this.loading = true;
            try {
                const response = await axios.get('/orders', { withCredentials: true });
                this.orders = response.data;
                this.error = null;
            } catch (error) {
                this.error = error.response.data.message || error.message;
            } finally {
                this.loading = false;
            }
        },
        async fetchOrder(orderId) {
            this.loading = true;
            try {
                const response = await axios.get(`/orders/${orderId}`, { withCredentials: true });
                this.order = response.data;
                this.error = null;
            } catch (error) {
                this.error = error.response.data.message || error.message;
            } finally {
                this.loading = false;
            }
        },
    },
});
