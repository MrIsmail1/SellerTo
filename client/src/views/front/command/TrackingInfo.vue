<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useTrackingStore } from '@/stores/trackingStore.js';

const route = useRoute();
const trackingCode = route.params.trackingCode;
const trackingStore = useTrackingStore();

const loading = ref(trackingStore.loading);
const error = ref(trackingStore.error);
const trackingInfo = ref(trackingStore.trackingInfo);

onMounted(async () => {
  await trackingStore.fetchTrackingInfo(trackingCode);
});
</script>

<template>
  <div>
    <h3>Suivi pour le numéro {{ trackingCode }}</h3>
    <div v-if="loading">Chargement des informations de suivi...</div>
    <div v-else-if="error">Erreur: {{ error }}</div>
    <div v-else-if="trackingInfo">
      <div v-for="event in trackingInfo.shipment.event" :key="event.date">
        <p>{{ event.date }}: {{ event.label }}</p>
      </div>
    </div>
    <div v-else>
      Aucune information de suivi disponible.
    </div>
  </div>
</template>