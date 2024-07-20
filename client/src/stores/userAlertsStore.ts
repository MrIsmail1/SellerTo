import { defineStore } from 'pinia';
import axios from 'axios';

export const useUserAlertsStore = defineStore('userAlerts', {
    actions: {
        async addUserAlert(alertData) {
            try {
                const response = await axios.post('/user-alerts', alertData);
                return response.data;
            } catch (error) {
                console.error('Failed to add user alert:', error);
            }
        },
    },
});
