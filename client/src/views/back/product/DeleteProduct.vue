<script setup lang="ts">
import { useProductsStore } from "@/stores/productsStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
  const productId = router.currentRoute.value.params.id;
  const productStore = useProductsStore();
  await productStore.deleteProduct(productId);
  router.push({ name: "AdminProducts" });
});
</script>
