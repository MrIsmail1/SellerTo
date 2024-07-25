<script setup lang="ts">
import { useStockStore } from "@/stores/stockStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
  const stockId = router.currentRoute.value.params.id;
  const stockStore = useStockStore();
  await stockStore.deleteStock(stockId);
  await router.push({name: "AdminStocks"});
});
</script>
