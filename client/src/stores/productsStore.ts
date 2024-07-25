import type { Product } from "@/z-schemas/ProductSchema";
import { defineStore } from "pinia";
import axios from "../plugins/axios";

export const useProductsStore = defineStore("products", {
  state: () => ({
    products: [],
    product: {},
    filteredProducts: [],
    loading: false,
    error: null,
    imageUploadError: null,
    filters: {
      series: [],
      sizeSsd: [],
      sizeRam: [],
      sizeScreen: [],
      typeOfProcessor: [],
      speedOfProcessor: [],
      typeOfStorage: [],
      color: [],
      resolution: [],
      gpu: [],
      weight: [],
      keyboardAndLanguage: [],
    },
    previousFilters: {},
  }),
  getters: {
    randomProducts() {
      return this.products.sort(() => Math.random() - 0.5);
    },
    productCategories() {
      const categories = this.products.map(
        (product) => product.product_category
      );
      return [...new Set(categories)];
    },
  },
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await axios.get("/products");
        this.products = response.data;
        this.filteredProducts = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async getProductById(id: string) {
      this.loading = true;
      try {
        const response = await axios.get(`/products/${id}`);
        this.product = response.data;
        this.error = null;
      } catch (error) {
      } finally {
        this.loading = false;
      }
    },
    async addProduct(product: Product) {
      this.loading = true;
      try {
        const response = await axios.post(`/products`, product);
        this.product = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteProductImage(productId: string, imageId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.delete(
          `/upload/products/${productId}/images/${imageId}`
        );
        return response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async getImageId(imageUrl: string) {
      this.loading = true;
      this.error = null;
      try {
        const cleanedImageId = imageUrl.replace(/^\/+/, "");
        const response = await axios.get(
          `/upload/product/images/${cleanedImageId}`
        );
        return response.data;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async uploadImages(productId: string, files: File[]) {
      this.loading = true;
      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("files", file);
        });

        const response = await axios.post(
          `/products/${productId}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        return response.data;
      } catch (error) {
        this.imageUploadError = error.response?.data?.message || error.message;
      } finally {
        this.loading = false;
      }
    },
    async addProductWithImages(product: Product, files: File[]) {
      this.loading = true;
      this.imageUploadError = null;
      try {
        // Create form data
        const formData = new FormData();
        formData.append("productData", JSON.stringify(product));
        files.forEach((file) => {
          formData.append("files", file);
        });
        // Create the product with images
        const response = await axios.post("/upload/products/images", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        this.product = response.data.product;
        this.product.images = response.data.files;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        if (error.response?.data?.message.includes("Only images are allowed")) {
          this.error = error.response.data.message;
        }
      } finally {
        this.loading = false;
      }
    },
    async fetchFilteredProducts() {
      this.loading = true;
      try {
        const params = { ...this.filters };

        Object.keys(params).forEach((key) => {
          if (Array.isArray(params[key]) && params[key].length > 0) {
            params[key] = params[key].join(",");
          } else if (Array.isArray(params[key]) && params[key].length === 0) {
            delete params[key];
          }
        });

        const response = await axios.get("/products", { params });
        this.filteredProducts = response.data;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async deleteProduct(id: string) {
      this.loading = true;
      try {
        await axios.delete(`/products/${id}`);
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
    async searchProductByTitleOrDescription(query) {
      try {
        const params = { query, ...this.filters };

        Object.keys(params).forEach((key) => {
          if (Array.isArray(params[key]) && params[key].length > 0) {
            params[key] = params[key].join(",");
          } else if (Array.isArray(params[key]) && params[key].length === 0) {
            delete params[key];
          }
        });

        const response = await axios.get("/products", { params });
        this.filteredProducts = response.data;
      } catch (error) {
      }
    },
    async updateProductImages(
      productId: string,
      product: Product,
      files: File[]
    ) {
      this.loading = true;
      this.imageUploadError = null;
      try {
        // Create form data
        const formData = new FormData();
        formData.append("productData", JSON.stringify(product));
        files.forEach((file) => {
          formData.append("files", file);
        });
        // Update the product with images
        const response = await axios.put(
          `/upload/products/${productId}/images`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.product = response.data.product;
        this.product.images = response.data.files;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        if (error.response?.data?.message.includes("Only images are allowed")) {
          this.error = error.response.data.message;
        }
      } finally {
        this.loading = false;
      }
    },
    async updateProduct(id: string, product: Product) {
      this.loading = true;
      try {
        const response = await axios.patch(`/products/${id}`, product);
        this.error = null;
      } catch (error) {
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
});
