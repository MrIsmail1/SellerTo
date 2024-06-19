<script setup lang="ts">
import HeaderComponent from "@/components/common/HeaderComponent.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <HeaderComponent />
  <div class="flex flex-col px-6 md:gap-8 md:p-6">
      <RouterView />
  </div>
</template>
