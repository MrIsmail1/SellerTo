<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import HeaderComponent from "@/components/common/HeaderComponent.vue";
import SidebarComponent from "@/components/common/SidebarComponent.vue";
import { onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/authStore";

const authStore = useAuthStore();
const route = useRoute();

onMounted(() => {
  authStore.checkAuth();
});

const isAdminRoute = computed(() => {
  return route.path.startsWith("/admin");
});
</script>

<template>
  <HeaderComponent v-if="!isAdminRoute" />
  <SidebarComponent v-if="isAdminRoute" />
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
