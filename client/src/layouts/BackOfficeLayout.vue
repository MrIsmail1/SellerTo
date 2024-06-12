<script setup lang="ts">
import SidebarComponent from "@/components/common/SidebarComponent.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
    <SidebarComponent />
    <div>
      <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>
