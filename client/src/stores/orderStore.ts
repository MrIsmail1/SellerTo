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
                const ordersData = response.data;

                const groupedOrders = ordersData.reduce((acc, order) => {
                    const orderIndex = acc.findIndex(o => o.orderUnique === order.orderUnique);
                    if (orderIndex !== -1) {
                        acc[orderIndex].products.push(order);
                    } else {
                        acc.push({
                            ...order,
                            products: [order]
                        });
                    }
                    return acc;
                }, []);

                this.orders = groupedOrders;
                this.error = null;
            } catch (error) {
                this.error = error.response.data.message || error.message;
            } finally {
                this.loading = false;
            }
        },
    },
});
