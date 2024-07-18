<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useAuthStore } from "@/stores/authStore";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const drawerOpen = ref(true);
const authStore = useAuthStore();
const redirectionRoutes = {
  Admin: { name: "AdminDashboard" },
  Users: { name: "HomePage" },
  SuperAdmin: { name: "AdminDashboard" },
};

onMounted(async () => {
  drawerOpen.value = true;
  await authStore.fetchUser();
});
const goHome = () => {
  const role = authStore.user.role;
  if (role && redirectionRoutes[role]) {
    router.push({ name: redirectionRoutes[role].name });
  }
};
</script>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <div class="max-w-md w-full text-center bg-white p-8 shadow-lg rounded-lg">
      <h1 class="text-4xl font-bold text-red-500 mb-4">403 Interdit</h1>
      <p class="text-lg text-gray-700 mb-6">
        Vous n'avez pas la permission d'accéder à cette page.
      </p>
      <Button
        @click="goHome"
        class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
      >
        Retourner à l'accueil
      </Button>
    </div>
  </div>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <Drawer :open="drawerOpen">
      <DrawerContent>
        <div class="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>403 Interdit</DrawerTitle>
            <DrawerDescription
              >Vous n'avez pas la permission d'accéder à cette
              page.</DrawerDescription
            >
          </DrawerHeader>
          <DrawerFooter>
            <Button @click="goHome">Retourner à l'accueil</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
