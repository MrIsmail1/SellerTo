<script setup lang="ts">
import DataTable from "@/components/common/DataTableComponent.vue";
import { columns } from "@/components/datatable-columns/Stock";
import Button from "@/components/ui/button/Button.vue";
import { useStockStore } from "@/stores/stockStore";
import { Plus } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type {Stock} from "@/z-schemas/StockShema";

const data = ref<Stock[]>([]);
const stockStore = useStockStore();
const router = useRouter();

onMounted(async () => {
  await stockStore.fetchStocks();
  data.value = stockStore.stocks;
});
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Stocks</span>
      <span class="text-md text-text-200">Gérer vos stocks ici.</span>
    </span>
    <Button
        class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
        @click="router.push({ name: 'AdminAddStock' })"
    >
      <Plus class="icon w-6 h-6 mr-2 text-primary-200" />
       Stock
    </Button>
  </div>
  <div class="flex flex-col mt-6">
    <DataTable :columns="columns" :data="data" filterColumn="productId" />
  </div>
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
