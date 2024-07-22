import { defineStore } from 'pinia';
import axios from "../plugins/axios";

export const useUserAlertsStore = defineStore('userAlerts', {
    actions: {
        async addUserAlert(alertData) {
            try {
                const response = await axios.post('/alert/user-alerts', alertData);
                return response.data;
            } catch (error) {
                console.error('Failed to add user alert:', error);
            }
        },
        async getAlertsByUserId(userId) {
            try {
                const response = await axios.get(`/alert/user-alerts/${userId}`);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user alerts:', error);
            }
        },
        async getAlertsByUserIdAndProductId(userId, productId) {
            try {
                const response = await axios.get(`/alert/user-alerts/${userId}/${productId}`);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user alerts:', error);
            }
        },
        async getAlertsByUserIdAndCategory(userId, category) {
            try {
                const response = await axios.get(`/alert/user-alerts/category/${userId}/${category}`);
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user alerts by category:', error);
            }
        },
        async updateUserAlerts(alerts) {
            try {
                const response = await axios.put('/alert/user-alerts', alerts);
                return response.data;
            } catch (error) {
                console.error('Failed to update user alerts:', error);
            }
        }
    }
});
