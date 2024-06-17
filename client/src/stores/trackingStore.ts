import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useTrackingStore = defineStore('tracking', {
    state: () => ({
        trackingInfo: null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchTrackingInfo(trackingCode) {
            this.loading = true;
            this.error = null;
            try {
                const response = await axios.get(`/suivi/v2/idships/${trackingCode}`);
                this.trackingInfo = response.data;
            } catch (error) {
                this.error = error.message;
                this.trackingInfo = null;
            } finally {
                this.loading = false;
            }
        },
    },
});
