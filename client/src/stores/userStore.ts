import type { User } from "@/z-schemas/UserSchema";
import { defineStore } from "pinia";
import { useRouter } from "vue-router";
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
        if (error.response && error.response.status === 403) {
          const router = useRouter();
          router.push({ name: "403-forbidden" });
        } else {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id: string) {
      this.loading = true;
      try {
        await axios.delete(`/users/${id}`);
        this.users = this.users.filter((user) => user._id !== id);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          const router = useRouter();
          router.push({ name: "403-forbidden" });
          //error here
        } else {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },
    async updateUser(user: User) {
      this.loading = true;
      try {
        await axios.put(`/users/${user._id}`, user);
        const index = this.users.findIndex((u) => u._id === user._id);
        this.users[index] = user;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async createUser(user: User) {
      this.loading = true;
      try {
        await axios.post("/users", user);
        this.users.push(user);
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async findUserById(id: string) {
      this.loading = true;
      try {
        const response = await axios.get(`/users/${id}`);
        return response.data;
      } catch (error) {
        if (error.response && error.response.status === 403) {
          const router = useRouter();
          router.push({ name: "403-forbidden" });
        } else {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
