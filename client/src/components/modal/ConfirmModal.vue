<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
      <h2 class="text-2xl mb-4">Confirmer la suppression</h2>
      <p class="mb-4">Êtes-vous sûr de vouloir supprimer cet élément ?</p>
      <div class="flex justify-end space-x-4">
        <Button @click="$emit('cancel')">Annuler</Button>
        <Button @click="$emit('confirm')">Supprimer</Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
</script>
