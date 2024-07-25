<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div class="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
      <button @click="$emit('close')" class="absolute top-2 right-2 text-gray-500 hover:text-primary-500">
        <span class="material-symbols-outlined text-base">close</span>
      </button>
      <div>
        <h3 class="text-2xl font-bold mb-4">Gérer vos alertes sur ce produit</h3>
        <form @submit.prevent="updateAlerts" class="space-y-4">
          <div v-for="alert in filteredAlertTypes" :key="alert.id" class="flex items-center">
            <input type="checkbox" :id="'alert-' + alert.id" v-model="alertStates[alert.id]" class="mr-2 text-lg" />
            <label :for="'alert-' + alert.id" class="text-base font-medium text-gray-700">{{ alert.type }}</label>
          </div>
          <div class="flex justify-end mt-4 space-x-2">
            <button type="button" @click="$emit('close')" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
              Fermer
            </button>
            <button type="submit" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserAlertsStore } from '@/stores/userAlertsStore';

const emit = defineEmits(['close']);

const props = defineProps({
  userId: {
    type: Number,
    required: true
  },
  productId: {
    type: [Number, null],
    required: false
  },
  category: {
    type: [String, null],
    required: false
  },
  alertTypesFilter: {
    type: Array as () => number[],
    required: true
  }
});

const userAlertsStore = useUserAlertsStore();

const alertTypes = ref([
  { id: 1, type: 'Newsletter' },
  { id: 2, type: 'Sur le restock de ce produit' },
  { id: 3, type: 'Nouveaux produit sur la catégorie' },
  { id: 4, type: 'Changement de prix sur ce produit' },
]);

const filteredAlertTypes = computed(() => {
  return alertTypes.value.filter(alert => props.alertTypesFilter.includes(alert.id));
});

const alertStates = ref({});

const loadUserAlerts = async () => {
  let alerts = [];
  if (props.productId) {
    alerts = await userAlertsStore.getAlertsByUserIdAndProductId(props.userId, props.productId);
  } else if (props.category) {
    alerts = await userAlertsStore.getAlertsByUserIdAndCategory(props.userId, props.category);
  } else {
    alerts = await userAlertsStore.getAlertsByUserId(props.userId);
  }

  filteredAlertTypes.value.forEach(alert => {
    alertStates.value[alert.id] = alerts.some(userAlert => userAlert.alertId === alert.id && userAlert.isActive);
  });
};

const updateAlerts = async () => {
  const updates = filteredAlertTypes.value.map(alert => ({
    userId: props.userId,
    alertId: alert.id,
    isActive: alertStates.value[alert.id],
    productId: props.productId,
    category: props.category
  }));
  await userAlertsStore.updateUserAlerts(updates);
  emit('close');
};

onMounted(loadUserAlerts);
</script>
