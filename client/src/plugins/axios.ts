import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true, // Important pour les cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

export default apiClient;
