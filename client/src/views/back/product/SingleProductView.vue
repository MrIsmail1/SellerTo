<script setup lang="ts">
import { useProductsStore } from "@/stores/productsStore";
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const productsStore = useProductsStore();
const productId = route.params.id;

onMounted(async () => {
  await productsStore.getProductById(productId);
});

const productDetails = computed(() => productsStore.product);
const loading = computed(() => productsStore.loading);
const error = computed(() => productsStore.error);

// Filter out properties that are not needed in the UI
const excludedKeys = ["_id", "timestamps", "createdAt", "updatedAt", "__v"];
const filteredProductDetails = computed(() => {
  if (productDetails.value) {
    return Object.entries(productDetails.value).filter(
      ([key, value]) => !excludedKeys.includes(key)
    );
  }
  return [];
});
</script>

<template>
  <div class="container mx-auto p-4">
    <div v-if="loading">Loading...</div>
    <div v-if="error">{{ error }}</div>
    <div v-if="productDetails" class="flex flex-col space-y-4">
      <h1 class="text-3xl font-bold">{{ productDetails.product_title }}</h1>
      <img
        v-if="productDetails.product_photo"
        :src="productDetails.product_photo"
        alt="Product Image"
        class="w-full h-auto"
      />

      <div
        v-for="[key, value] in filteredProductDetails"
        :key="key"
        class="flex flex-col space-y-2"
      >
        <span class="font-semibold capitalize"
          >{{
            key
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())
          }}:</span
        >
        <span>{{ value }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
