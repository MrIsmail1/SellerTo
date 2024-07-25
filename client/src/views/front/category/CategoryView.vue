<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useProductsStore } from '@/stores/productsStore';
import CardSellComponent from '@/components/CardSellComponent.vue';
import FilterComponent from '@/components/filter/FilterComponent.vue';
import { useRoute } from 'vue-router';
import { Sheet, SheetTrigger, SheetContent, SheetHeader } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import AddUserAlert from '@/components/alert/AddUserAlert.vue';
import { SlidersHorizontal } from 'lucide-vue-next';
import { useUserAlertsStore } from '@/stores/userAlertsStore';
import { useAuthStore } from '@/stores/authStore';

const productStore = useProductsStore();
const userAlertsStore = useUserAlertsStore();
const authStore = useAuthStore();
const route = useRoute();

const initializeFiltersFromURL = () => {
  const query = route.query;
  Object.keys(productStore.filters).forEach(filterKey => {
    if (query[filterKey]) {
      productStore.filters[filterKey] = query[filterKey].split(',').map(value => decodeURIComponent(value));
    } else {
      productStore.filters[filterKey] = [];
    }
  });
};

onMounted(() => {
  initializeFiltersFromURL();
  productStore.fetchProducts();
  if (route.query.query) {
    productStore.searchProductByTitleOrDescription(route.query.query);
  }
  loadUserAlerts();
});

const categoryName = computed(() => route.params.categoryName);
const filteredProducts = computed(() => {
  return productStore.filteredProducts.filter(product => product.product_category === categoryName.value);
});

const showAlertModal = ref(false);
const alertTypesFilter = ref([3]);
const alertStates = ref({});
const userId = computed(() => authStore.user?.id);

const loadUserAlerts = async () => {
  if (userId.value) {
    const alerts = await userAlertsStore.getAlertsByUserIdAndCategory(userId.value, categoryName.value);
    alertTypesFilter.value.forEach(alert => {
      alertStates.value[alert.id] = alerts.some(userAlert => userAlert.alertId === alert.id && userAlert.isActive);
    });
  }
};

watch(() => route.query, (newQuery) => {
  if (newQuery.query) {
    productStore.searchProductByTitleOrDescription(newQuery.query);
  } else {
    initializeFiltersFromURL();
  }
}, { immediate: true });
</script>

<template>
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
  <main>
    <Sheet>
      <SheetTrigger as-child>
        <Button class="fixed md:hidden visible md:invisible bottom-0 left-0 bg-white w-full p-4" variant="outline">
          Filtrer
          <SlidersHorizontal class="ml-2"/>
        </Button>
      </SheetTrigger>
      <SheetContent class="rounded-lg h-screen" side="bottom">
        <SheetHeader>
          <FilterComponent :filteredProducts="filteredProducts"/>
        </SheetHeader>
      </SheetContent>
    </Sheet>
    <div class="mt-14 lg:mt-2 md:mt-6 grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div class="hidden border-r bg-muted/40 md:block">
        <div class="flex h-full max-h-screen flex-col gap-2">
          <FilterComponent :filteredProducts="filteredProducts"/>
        </div>
      </div>
      <div class="relative flex flex-wrap justify-between -mt-4 p-0 lg:p-4">
        <!-- Notification Icon -->
        <div class="notification-icon ps-5" @click="showAlertModal = true">
          <span class="material-symbols-outlined text-gray-700">notifications</span>
        </div>

        <!-- Modal Transition -->
        <transition name="modal">
          <div v-if="showAlertModal" class="modal-overlay" @click.self="showAlertModal = false">
            <div class="modal-container">
              <AddUserAlert :userId="userId" :productId="null" :category="route.params.categoryName" :alertTypesFilter="alertTypesFilter" @close="showAlertModal = false" />
            </div>
          </div>
        </transition>

        <template v-for="product in filteredProducts" :key="product._id">
          <CardSellComponent :product="product" class="mt-4"/>
        </template>
      </div>
    </div>
  </main>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  width: 100%;
}

.notification-icon {
  position: absolute;
  top: 1rem; /* Adjusted for a bit lower position */
  right: -4rem; /* Adjusted to move more to the right */
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid #e2e8f0; /* Gray-300 */
  border-radius: 9999px; /* Full rounding */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* Small shadow */
  transition: background-color 0.2s;
}

@media (max-width: 768px) {
  .notification-icon {
    right: 0rem; /* Adjusted for smaller screens */
    top: -2rem; /* Adjusted for smaller screens */
  }
}

.notification-icon:hover {
  background-color: #f7fafc; /* Gray-100 */
}
</style>
