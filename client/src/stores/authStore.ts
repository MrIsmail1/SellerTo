import { defineStore } from 'pinia';
import axios from '../plugins/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    errorMessage: ''
  }),
  actions: {
    async register() {
      try {
        const response = await axios.post('/users/register', {
          firstname: this.firstname,
          lastname: this.lastname,
          email: this.email,
          password: this.password
        });
        alert('Registration successful!');
        this.reset();
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async login() {
      try {
        const response = await axios.post('/users/login', {
          email: this.email,
          password: this.password
        });
        alert('Login successful!');
        this.reset();
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
    },
    async forgotPassword() {
     try {
        const response = await axios.post('/users/forgotpassword', {
          email : this.email,
        });
        alert('Password reset link sent to your email !');
        this.reset();
      } catch (error) {
        this.errorMessage =error.response.data.message;
      }
    },
    async resetPassword(token) {
      const router = useRouter();
      try {
        const response = await axios.put(`/users/resetpassword/${token}`, {
          password : this.password
        });
        this.reset();
        router.push('/login');
      } catch (error) {
        this.errorMessage =error.response.data.message;
      }
    },
    reset() {
      this.firstname = '';
      this.lastname = '';
      this.email = '';
      this.password = '';
      this.errorMessage = '';
    } // Reset the form fields after successful registration
  }
});
