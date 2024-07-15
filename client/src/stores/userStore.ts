import type { User } from "@/z-schemas/UserSchema";
import { defineStore } from "pinia";
import axios from "../plugins/axios";

export const useUsersStore = defineStore("users", {
  state: () => ({
    users: [] as User[],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await axios.get("/users");
        this.users = response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
