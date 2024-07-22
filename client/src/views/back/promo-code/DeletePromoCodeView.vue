<script setup lang="ts">
import { usePromoCodeStore } from "@/stores/promoCodeStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
  const promoCodeId = router.currentRoute.value.params.id;
  const promoCodeStore = usePromoCodeStore();
  await promoCodeStore.deletePromoCode(promoCodeId);
  await router.push({name: "AdminPromoCodes"});
});
</script>
