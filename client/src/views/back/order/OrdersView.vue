<script setup lang="ts">
import DataTable from "@/components/common/DataTableComponent.vue";
import { columns } from "@/components/datatable-columns/Order";

import Button from "@/components/ui/button/Button.vue";
import { useOrdersStore } from "@/stores/orderStore";
import type { Order } from "@/z-schemas/OrderSchema";
import { FileDown } from "lucide-vue-next";
import { onMounted, ref } from "vue";

const data = ref<Order[]>([]);
const ordersStore = useOrdersStore();
const selectedOrders = ref<Order[]>([]);

const handleSelectionChange = (selectedRows: Order[]) => {
  selectedOrders.value = selectedRows;
};

const handleDownloadInvoice = async () => {
  const ordersToDownload = selectedOrders.value.map((row) => row.original);
  if (ordersToDownload.length === 0) {
    return;
  }
  await ordersStore.downloadInvoice(ordersToDownload);
};

onMounted(async () => {
  await ordersStore.getOrders();
  data.value = ordersStore.orders;
});
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Commandes</span>
      <span class="text-md text-text-200">Télécharger vos factures ici.</span>
    </span>
    <Button
      class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
      @click="handleDownloadInvoice"
    >
      <FileDown class="icon w-6 h-6 mr-2 text-primary-200" />
      Facture
    </Button>
  </div>
  <div class="flex flex-col mt-6">
    <DataTable
      :columns="columns"
      :data="data"
      filterColumn="orderUnique"
      @selectionChange="handleSelectionChange"
    />
  </div>
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
