<script setup lang="ts">
import HeaderComponent from "@/components/common/HeaderComponent.vue";
import Button from "@/components/ui/button/Button.vue";
import { useAuthStore } from "@/stores/authStore";
import { Gauge } from "lucide-vue-next";
import { RouterView, useRouter } from "vue-router";
const authStore = useAuthStore();
const user = authStore.user ?? null;
const router = useRouter();
const navigateTo = (route: string) => router.push({ name: route });
const AdminDashboard = "AdminDashboard";
</script>

<template>
  <div class="flex items-center" v-if="user && user.role !== 'User'">
    <Button
      class="bg-transparent hover:bg-transparent mt-0"
      @click="navigateTo(AdminDashboard)"
    >
      <Gauge class="w-6 h-6 text-primary-200" />
      <span class="text-text-100 underline ml-1 font-medium">
        Tableau de board
      </span>
    </Button>
  </div>
  <HeaderComponent />
  <div class="px-6 md:px-0">
    <RouterView />
  </div>
</template>
