import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useOrdersStore = defineStore('orders', {
    state: () => ({
        orders: [],
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
                // TODO: Changer la routes (je pense pas très restfull)
                const response = await axios.get('/orders/user/orders', { withCredentials: true });
                this.orders = response.data;
                this.error = null;
            } catch (error) {
                this.error = error.response.data.message || error.message;
            } finally {
                this.loading = false;
            }
        },
    },
});
