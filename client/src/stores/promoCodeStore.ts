import type { PromoCode } from "@/z-schemas/PromoCodeSchema";
import { defineStore } from "pinia";
import axios from "../plugins/axios";

interface PromoCodeState {
  promoCodes: PromoCode[];
  promoCode: PromoCode | null;
  loading: boolean;
  error: string | null;
}

export const usePromoCodeStore = defineStore("promoCodes", {
  state: (): PromoCodeState => ({
    promoCodes: [] as PromoCode[],
    promoCode: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPromoCodes(): Promise<void> {
      this.loading = true;
      try {
        const response = await axios.get("/promocodes");
        this.promoCodes = response.data;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deletePromoCode(id: string): Promise<void> {
      this.loading = true;
      try {
        await axios.delete(`/promocodes/${id}`);
        this.promoCodes = this.promoCodes.filter(
          (promoCode) => promoCode.id !== id
        );
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          throw new Error("403");
        } else {
          this.error = error.message;
        }
      } finally {
        this.loading = false;
      }
    },
    async updatePromoCode(id: string, promoCode: PromoCode): Promise<void> {
      this.loading = true;
      try {
        await axios.put(`/promocodes/${id}`, promoCode);
        const index = this.promoCodes.findIndex((p) => p.id === promoCode.id);
        this.promoCodes[index] = promoCode;
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async createPromoCode(promoCode: PromoCode): Promise<void> {
      this.loading = true;
      try {
        const response = await axios.post("/promocodes", promoCode);
        this.promoCodes.push(response.data);
      } catch (error: any) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async findPromoCodeById(id: string) {
      try {
        const response = await axios.get(`/promocodes/${id}`);
        this.promoCode = response.data;
        this.error = null;
      } catch (error) {
        this.promoCode = null;
      }
    },
  },
});
