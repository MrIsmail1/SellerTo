import { defineStore } from "pinia";
import { useRouter } from "vue-router";
import axios from "../plugins/axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    address: "",
    postalCode: "",
    city: "",
    country: "",
    password: "",
    errorMessage: "",
    successMessage: "",
    user: null,
  }),
  actions: {
    async register(values: {
      firstname: string;
      lastname: string;
      email: string;
      password: string;
    }) {
      try {
        const response = await axios.post("/auth/register", values);
        this.successMessage = response.data.message;
        this.reset();
      } catch (error: any) {
        this.errorMessage = error.response.data.message;
      }
    },
    async login({ email, password }: { email: string; password: string }) {
      try {
        const response = await axios.post("/auth/login", { email, password });
        this.successMessage = "Connexion réussie";
        this.errorMessage = "";
        this.user = response.data.user;
      } catch (error: any) {
        this.errorMessage =
          error.response?.data?.message || "Erreur de connexion";
        this.successMessage = "";
      }
    },
    async fetchUser() {
      try {
        const response = await axios.get("/users/profile");
        this.user = response.data;
      } catch (error) {
        this.user = null;
      }
    },
    async forgotPassword(values: { email: string }) {
      try {
        await axios.post("/auth/forgotpassword", values);
        this.successMessage = "Password reset successful";
        this.reset();
      } catch (error: any) {
        this.errorMessage = error.response.data.message;
      }
    },
    async resetPassword({
      token,
      password,
    }: {
      token: string;
      password: string;
    }) {
      const router = useRouter();
      try {
        await axios.put(`/auth/resetpassword/${token}`, { password });
        this.reset();
        router.push("/login");
      } catch (error: any) {
        this.errorMessage = error.response.data.message;
      }
    },
    async changePassword(oldPassword: string, newPassword: string) {
      try {
        const response = await axios.post("/auth/changePassword", {
          id: this.user.id,
          oldPassword,
          newPassword,
        });
        this.successMessage = response.data.message;
      } catch (error: any) {
        this.errorMessage = error.response.data.message;
      }
    },
    async deleteAccount() {
      try {
        const response = await axios.delete("/users/delete");
        this.successMessage = response.data.message;
        this.reset();
      } catch (error: any) {
        this.errorMessage = error.response.data.message;
      }
    },
    async updateUser(updatedUser: any) {
      try {
        const response = await axios.put("/users/update", updatedUser);
        this.user = response.data;
        this.successMessage = "User updated successfully";
      } catch (error: any) {
        this.errorMessage = error.response.data.message;
      }
    },
    async logout() {
      try {
        await axios.get("/auth/logout");
        this.reset();
      } catch (error: any) {
        this.errorMessage = error.response.data.message;
      }
    },
    async checkAuth() {
      try {
        const response = await axios.get("/users");
        this.user = response.data;
      } catch (error) {
        this.user = null;
      }
    },
    clearMessages() {
      this.errorMessage = "";
      this.successMessage = "";
    },
    reset() {
      this.firstname = "";
      this.lastname = "";
      this.email = "";
      this.password = "";
      this.errorMessage = "";
      this.user = null;
    },
  },
});
