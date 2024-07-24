<script setup lang="ts">
import SidebarComponent from "@/components/common/SidebarComponent.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div
    class="relative min-h-screen w-full lg:grid lg:grid-cols-[280px_1fr] overflow-x-hidden"
  >
    <SidebarComponent />
    <div class="lg:ml-0 p-7 overflow-x-hidden">
      <main class="max-w-full overflow-x-hidden">
        <RouterView />
      </main>
    </div>
  </div>
</template>
