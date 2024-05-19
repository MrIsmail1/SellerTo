<script setup lang="ts">

import Footer from '@/components/common/FooterComponent.vue';
import { useProductsStore } from '@/stores/productsStore';
import { onMounted, computed } from 'vue';
import CardSellComponent from '@/components/CardSellComponent.vue';
import SelectComponent from '@/components/common/SelectComponent.vue';
import BreadCrumbComponent from '@/components/common/BreadCrumbComponent.vue';
import { useRoute } from 'vue-router';

const productStore = useProductsStore();
const route = useRoute();

onMounted(() => {
  productStore.fetchProducts();
});

const categoryName = computed(() => route.params.categoryName);
const filteredProducts = computed(() => {
  return productStore.products.filter(product => product.product_category === categoryName.value);
});
</script>

<template>
  <main>
    <div class="flex justify-between">
      <BreadCrumbComponent />
      <SelectComponent />
    </div>
    <div class="mt-6 grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div class="hidden border-r bg-muted/40 md:block">
        <div class="flex h-full max-h-screen flex-col gap-2">
          <nav class="grid items-start px-2 text-sm font-medium lg:px-4">
            <a href="/" class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
              Dashboard
            </a>
            <a href="#" class="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary">
              Products
            </a>
          </nav>
        </div>
      </div>
      <div class="flex flex-wrap justify-between -mt-4">
        <template v-for="product in filteredProducts" :key="product.id">
          <CardSellComponent :product="product" class="mt-4" />
        </template>
      </div>
    </div>
  </main>
</template>
