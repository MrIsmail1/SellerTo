<script setup lang="ts">
import DataTable from "@/components/common/DataTableComponent.vue";

import Button from "@/components/ui/button/Button.vue";
import { usePromoCodeStore } from "@/stores/promoCodeStore";

import { Plus } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import type {PromoCode} from "@/z-schemas/PromoCodeSchema";
import {columns} from "@/components/datatable-columns/PromoCode";

const data = ref<PromoCode[]>([]);
const promoCodeStore = usePromoCodeStore();
const router = useRouter();

onMounted(async () => {
  await promoCodeStore.fetchPromoCodes();
  data.value = promoCodeStore.promoCodes;
});
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Promo Codes</span>
      <span class="text-md text-text-200">Gérer vos code promo ici</span>
    </span>
    <Button
        class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
        @click="router.push({ name: 'AdminAddPromoCode' })"
    >
      <Plus class="icon w-6 h-6 mr-2 text-primary-200" />
        Ajouter code promo
    </Button>
  </div>
  <div class="flex flex-col mt-6">
    <DataTable :columns="columns" :data="data" filterColumn="code" />
  </div>
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
