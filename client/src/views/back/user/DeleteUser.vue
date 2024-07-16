<script setup lang="ts">
import { useUsersStore } from "@/stores/userStore";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(async () => {
  const userId = router.currentRoute.value.params.id;
  const userStore = useUsersStore();
  await userStore.deleteUser(userId);
  router.push({ name: "AdminUsers" });
});
</script>
