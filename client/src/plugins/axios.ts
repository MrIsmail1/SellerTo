import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // URL de base de votre API
  withCredentials: true, // Important pour les cookies si vous utilisez des sessions
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
