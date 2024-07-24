import { defineStore } from 'pinia';
import axios from '../plugins/axios';
import { ref } from 'vue';

export const useNewsletterStore = defineStore('newsletter', () => {
    const subject = ref<string>('');
    const message = ref<string>('');
    const responseMessage = ref<string>('');

    const sendNewsletter = async () => {
        try {
            const response = await axios.post('/alert/send-newsletter', {
                subject: subject.value,
                message: message.value,
            });
            responseMessage.value = 'Email envoyé avec succès';
        } catch (error) {
            responseMessage.value = 'Erreur lors de l\'envoi de l\'email';
        }
    };

    return {
        subject,
        message,
        responseMessage,
        sendNewsletter,
    };
});
