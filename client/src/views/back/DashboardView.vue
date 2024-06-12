<script setup lang="ts">
import { useRoute } from "vue-router";
import Button from "@/components/ui/button/Button.vue";

const route = useRoute();
</script>

<template>
  <div class="flex justify-between">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Tableau de bord</span>
      <span class="text-md text-text-200"
        >Surveillez vos revenus de ventes ici.</span
      >
    </span>
    <Button> Ajouter un widget </Button>
  </div>
</template>
