<script setup lang="ts">
import HeaderComponent from "@/components/common/HeaderComponent.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <HeaderComponent />
  <div class="flex flex-col">
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <RouterView />
    </main>
  </div>
</template>
