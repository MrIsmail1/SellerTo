import type { Order } from "@/z-schemas/OrderSchema";
import { defineStore } from "pinia";
import axios from "../plugins/axios";

export const useOrdersStore = defineStore("orders", {
  state: () => ({
    orders: [],
    order: null,
    loading: false,
    error: null,
  }),
  getters: {
    allOrders(state) {
      return state.orders;
    },
  },
  actions: {
    async fetchOrders() {
      this.loading = true;
      try {
        const response = await axios.get("/orders", { withCredentials: true });
        const ordersData = response.data;

        const groupedOrders = ordersData.reduce((acc, order) => {
          const orderIndex = acc.findIndex(
            (o) => o.orderUnique === order.orderUnique
          );
          if (orderIndex !== -1) {
            acc[orderIndex].products.push(order);
          } else {
            acc.push({
              ...order,
              products: [order],
            });
          }
          return acc;
        }, []);

        this.orders = groupedOrders;
        this.error = null;
      } catch (error) {
        this.error = error.response.data.message || error.message;
      } finally {
        this.loading = false;
      }
    },
    async getOrders() {
      this.loading = true;
      try {
        const response = await axios.get("/orders/all");
        const ordersData = response.data;

        const groupedOrders = ordersData.reduce((acc, order) => {
          const orderIndex = acc.findIndex(
            (o) => o.orderUnique === order.orderUnique
          );
          if (orderIndex !== -1) {
            acc[orderIndex].products.push(order);
          } else {
            acc.push({
              ...order,
              products: [order],
            });
          }
          return acc;
        }, []);

        this.orders = groupedOrders;
        this.error = null;
      } catch (error) {
        this.error = error.response.data.message || error.message;
      } finally {
        this.loading = false;
      }
    },
    async downloadInvoice(orders: Order[]) {
      this.loading = true;
      try {
        // Extract the actual orders from the proxy object
        const extractOrders = orders.map((row: any) => row.original);

        const factureOrderUnique =
          orders.length === 1
            ? orders[0].orderUnique
            : `orders_${new Date().toISOString()}`;

        const response = await axios.post("/orders/invoice", orders, {
          responseType: "blob",
        });

        const fileType = orders.length > 1 ? "zip" : "pdf";
        console.log(fileType);
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `facture_${factureOrderUnique}.${fileType}`
        );
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        this.error = error.response.data.message || error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
