import type { User } from "@/z-schemas/UserSchema";
import { defineStore } from "pinia";
import axios from "../plugins/axios";

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const useUsersStore = defineStore("users", {
  state: (): UsersState => ({
    users: [] as User[],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchUsers(): Promise<void> {
      this.loading = true;
      try {
        const response = await axios.get("/users");
        this.users = response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id: number): Promise<void> {
      this.loading = true;
      try {
        await axios.delete(`/users/${id}`);
        this.users = this.users.filter((user) => user._id !== id);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async updateUser(user: User): Promise<void> {
      this.loading = true;
      try {
        await axios.put(`/users/${user._id}`, user);
        const index = this.users.findIndex((u) => u._id === user._id);
        this.users[index] = user;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async createUser(user: User): Promise<void> {
      this.loading = true;
      try {
        await axios.post("/users", user);
        this.users.push(user);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async findUserById(id: string): Promise<User | undefined> {
      this.loading = true;
      try {
        const response = await axios.get(`/users/${id}`);
        return response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
