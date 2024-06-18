<script setup lang="ts">
import SidebarComponent from "@/components/common/SidebarComponent.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
    <SidebarComponent />
    <div class="p-7">
      <main class="max-w-full">
        <RouterView />
      </main>
    </div>
  </div>
</template>
