import { defineStore } from 'pinia';
import axios from '../plugins/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    errorMessage: '',
    user: null
  }),
  actions: {
    async register() {
      try {
        await axios.post('/auth/register', {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password
        });
        this.reset();
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async login() {
      try {
        const response = await axios.post('/auth/login', {
          email: this.email,
          password: this.password
        });
        this.user = response.data.user;
        this.errorMessage = ''; // Réinitialiser le message d'erreur
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get('/user');
        this.user = response.data;
      } catch (error) {
        this.user = null;
      }
    },
    async forgotPassword() {
      try {
        await axios.post('/auth/forgotpassword', {
          email: this.email,
        });
        this.reset();
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async resetPassword(token) {
      const router = useRouter();
      try {
        await axios.put(`/auth/resetpassword/${token}`, {
          password: this.password
        });
        this.reset();
        router.push('/login');
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async logout() {
      try {
        await axios.get('/auth/logout');
        this.reset();
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async checkAuth() {
      try {
        const response = await axios.get('/user');
        this.user = response.data;
      } catch (error) {
        this.user = null;
      }
    },
    reset() {
      this.firstname = '';
      this.lastname = '';
      this.email = '';
      this.password = '';
      this.errorMessage = '';
      this.user = null;
    }
  }
});
