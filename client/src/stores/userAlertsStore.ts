import { defineStore } from 'pinia';
import axios from "../plugins/axios";

export const useUserAlertsStore = defineStore('userAlerts', {
    actions: {
        async addUserAlert(alertData) {
            try {
                const response = await axios.post('/alert', alertData);
                return response.data;
            } catch (error) {
            }
        },
        async getAlertsByUserId(userId) {
            try {
                const response = await axios.get(`/alert/${userId}`);
                return response.data;
            } catch (error) {
            }
        },
        async getAlertsByUserIdAndProductId(userId, productId) {
            try {
                const response = await axios.get(`/alert/${userId}/${productId}`);
                return response.data;
            } catch (error) {
            }
        },
        async getAlertsByUserIdAndCategory(userId, category) {
            try {
                const response = await axios.get(`/alert/category/${userId}/${category}`);
                return response.data;
            } catch (error) {
            }
        },
        async updateUserAlerts(alerts) {
            try {
                const response = await axios.put('/alert', alerts);
                return response.data;
            } catch (error) {
            }
        }
    }
});
