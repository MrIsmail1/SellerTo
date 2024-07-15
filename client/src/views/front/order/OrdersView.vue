<script setup lang="ts">
import { useOrdersStore } from '@/stores/orderStore';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from "@/components/ui/button";

const ordersStore = useOrdersStore();
const { orders, loading, error } = storeToRefs(ordersStore);
const router = useRouter();

onMounted(() => {
  ordersStore.fetchOrders();

  const interval = setInterval(() => {
    ordersStore.fetchOrders();
  }, 600000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

const buyAgain = (productId: number) => {
};

const viewProduct = (productId: number) => {
  router.push(`/product/${productId}`);
};

const viewOrder = (orderId: number) => {
  router.push(`/order/${orderId}`);
};

// Function to format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="font-bold text-5xl my-4 mb-6">Mes Commandes</h1>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="text-center text-primary-100">{{ error }}</div>
    <ul v-if="!loading && !error" class="space-y-8 mt-6 pb-6">
      <li v-for="order in orders" :key="order.id" class="bg-gray-100 p-4 rounded-md last:mb-8">
        <div class="bg-gray-200 p-4 rounded-md mb-2">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-base">Commande effectuée le <strong>{{ formatDate(order.createdAt) }}</strong></p>
              <p class="text-base">Livraison à : <strong>{{ order.user.firstname }} {{ order.user.lastname }}</strong></p>
            </div>
            <div class="flex-grow text-center">
              <p class="text-base">Total : <strong>{{ order.amount }} €</strong></p>
            </div>
            <div class="text-right">
              <p class="text-base">N° de commande : <strong>{{ order.trackingCode }}</strong></p>
              <a href="#" class="text-base" @click.prevent="viewOrder(order.id)">Afficher les détails de la commande</a> |
              <a href="#" class="text-base">Demande de facturation</a>
            </div>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <img :src="order.product.product_photo" alt="Product Image" class="w-50 h-50 object-cover rounded-md" />
          <div>
            <p class="text-lg font-bold">{{ order.product.product_title }}</p>
            <p class="text-lg mt-6"> Statut de la commande : <strong>{{ order.status }}</strong></p>
            <div class="space-x-2 mt-8">
              <Button type="button" variant="secondary" size="medium" class="me-4" @click="buyAgain(order.product._id)">Acheter à nouveau</Button>
              <Button type="submit" variant="primary" size="medium" @click="viewProduct(order.product._id)">Afficher votre article</Button>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
}
</style>
