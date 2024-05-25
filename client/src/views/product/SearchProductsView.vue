<script setup lang="ts">
import CardSellComponent from "@/components/CardSellComponent.vue";
import {onMounted} from "vue";
import {useProductsStore} from "@/stores/productsStore";
import {useRoute} from "vue-router";

const productStore = useProductsStore();
const route = useRoute();

onMounted(() => {
  productStore.fetchProducts();
  if (route.query.title) {
    productStore.searchProductByTitle(route.query.title);
  }
});
</script>

<template>
  <main>
    <div class="flex flex-wrap justify-between -mt-4">
      <template  class="p-1" v-for="product in productStore.searchResults" :key="product.id">
        <CardSellComponent :product="product" class="mt-4" />
      </template>
    </div>
  </main>
</template>
