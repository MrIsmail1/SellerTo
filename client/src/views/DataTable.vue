<script setup lang="ts">
import { ref, onMounted } from "vue";
import { columns } from "@/components/datatable-columns/Product";
import { useProductsStore } from "@/stores/productsStore";
import type { Product } from "@/schemas/ProductSchema";
import DataTable from "@/components/common/DataTableComponent.vue";

const data = ref<Product>([]);
const productStore = useProductsStore();

onMounted(async () => {
  await productStore.fetchProducts();
  data.value = productStore.products;
});
</script>

<template>
  <div class="container py-10 mx-auto">
    <DataTable :columns="columns" :data="data" />
  </div>
</template>
