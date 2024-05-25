import { defineStore } from 'pinia';
import axios from '../plugins/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    errorMessage: '',
    successMessage: '',
    user: null
  }),
  actions: {
    async register() {
      const router = useRouter();
      try {
        const response = await axios.post('/auth/register', {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password
        });
        this.successMessage = response.data.message;
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
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get('/users');
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
        this.successMessage = 'Password reset successful';
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
        const response = await axios.get('/users');
        this.user = response.data;
      } catch (error) {
        this.user = null;
      }
    },
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
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
