import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL_SERVER,
  withCredentials: true, // Important pour les cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
