<script setup lang="ts">
import { ref, onMounted } from "vue";
import Button from "@/components/ui/button/Button.vue";
import AddProductModal from "@/components/modal/AddProductModal.vue";
import { Plus } from "lucide-vue-next";
import { useProductsStore } from "@/stores/productsStore";
import DataTable from "@/components/common/DataTableComponent.vue";
import { columns } from "@/components/datatable-columns/Product";
import type { Product } from "@/z-schemas/ProductSchema";

const showModal = ref(false);
const data = ref<Product>([]);
const productsStore = useProductsStore();

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const saveProduct = (product) => {
  productsStore.addProduct(product);
  closeModal();
};

onMounted(async () => {
  await productsStore.fetchProducts();
  data.value = productsStore.products;
});
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Produits</span>
      <span class="text-md text-text-200">Gérer vos produits ici.</span>
    </span>
    <Button
      class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
      @click="openModal"
    >
      <Plus class="icon w-6 h-6 mr-2 text-primary-200" />
      Produit
    </Button>
  </div>
  <div class="flex flex-col mt-6">
    <DataTable :columns="columns" :data="data" filterColumn="product_title" />
  </div>
  <AddProductModal v-if="showModal" @close="closeModal" @save="saveProduct" />
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
