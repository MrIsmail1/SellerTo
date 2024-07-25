import { defineStore } from "pinia";
import axios from "../plugins/axios";
import type {Stock} from "@/z-schemas/StockShema";

interface StockState {
    stocks: Stock[];
    stock: Stock | null;
    loading: boolean;
    error: string | null;
}

export const useStockStore = defineStore("stocks", {
    state: (): StockState => ({
        stocks: [] as Stock[],
        stock: null,
        loading: false,
        error: null,
    }),
    actions: {
        async fetchStocks(): Promise<void> {
            this.loading = true;
            try {
                const response = await axios.get("/stocks");
                this.stocks = response.data;
            } catch (error: any) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        async deleteStock(id: string): Promise<void> {
            this.loading = true;
            try {
                await axios.delete(`/stocks/${id}`);
                this.stocks = this.stocks.filter((stock) => stock.id !== id);
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
        async updateStock(id: string, stock: Stock): Promise<void> {
            this.loading = true;
            try {
                await axios.patch(`/stocks/${id}`, stock);
                const index = this.stocks.findIndex((s) => s.id === stock.id);
                this.stocks[index] = stock;
            } catch (error: any) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        async createStock(stock: Stock): Promise<void> {
            this.loading = true;
            try {
                const response = await axios.post("/stocks", stock);
                this.stocks.push(response.data);
            } catch (error: any) {
                this.error = error.message;
            } finally {
                this.loading = false;
            }
        },
        async findStockById(id: string) {
            try {
                const response = await axios.get(`/stocks/${id}`);
                this.stock = response.data;
                this.error = null;
            } catch (error) {
                this.stock = null;
            }
        },
    },
});
