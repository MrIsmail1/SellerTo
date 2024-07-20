<script setup lang="ts">
import { useOrdersStore } from '@/stores/orderStore';
import { storeToRefs } from 'pinia';
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/stores/authStore';

const ordersStore = useOrdersStore();
const { orders, loading, error } = storeToRefs(ordersStore);
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  ordersStore.fetchOrders();

  const interval = setInterval(() => {
    ordersStore.fetchOrders();
  }, 600000);

  onUnmounted(() => {
    clearInterval(interval);
  });
});

const viewProduct = (productId: number) => {
  router.push(`/product/${productId}`);
};

const addDays = (dateString: string, days: number) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
};

const isFutureDeliveryDate = (dateString: string) => {
  const deliveryDate = addDays(dateString, 4);
  const currentDate = new Date();
  return deliveryDate > currentDate;
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

// Refund product function
const createRefund = async (productId, paymentId, quantity) => {
  try {
    await ordersStore.createRefund({ productId, paymentId, quantity });
    await ordersStore.fetchOrders();
  } catch (error) {
    console.error('Error refunding product:', error);
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="font-bold text-5xl my-4 mb-6">Mes Commandes</h1>
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-if="error" class="text-center text-primary-100">{{ error }}</div>
    <ul v-if="!loading && !error" class="space-y-8 mt-6 pb-6">
      <li v-for="groupedOrder in orders" :key="groupedOrder.orderUnique" class="bg-gray-100 p-4 rounded-md last:mb-8">
        <div class="bg-gray-200 p-4 rounded-md mb-2">
          <div class="flex justify-between items-start">
            <div>
              <p class="text-base">Commande effectuée le <strong>{{ formatDate(groupedOrder.createdAt) }}</strong></p>
              <p class="text-base">Livraison à : <strong>{{ groupedOrder.user.firstname }} {{
                  groupedOrder.user.lastname
                }}</strong></p>
              <p class="text-base">Adresse de livraison : <strong>{{ groupedOrder.user.address }},
                {{ groupedOrder.user.country }} {{ groupedOrder.user.city }} {{ groupedOrder.user.postalCode }}</strong>
              </p>
            </div>
            <div class="flex-grow text-center">
              <p class="text-base">Total :
                <strong>{{ groupedOrder.products.reduce((sum, product) => sum + product.amount, 0) }} €</strong></p>
            </div>
            <div class="text-right">
              <p class="text-base">N° de commande : <strong>{{ groupedOrder.trackingCode }}</strong></p>
              <a href="#" class="text-base">Demande de facturation</a>
            </div>
          </div>
        </div>
        <ul class="space-y-8">
          <li v-for="product in groupedOrder.products" :key="product.id" class="flex items-center space-x-4">
            <div class="flex-shrink-0">
              <img :src="product.product.product_photo" alt="Product Image" class="w-50 h-50 object-cover rounded-md"/>
            </div>
            <div class="flex-grow flex flex-col space-y-4">
              <div>
                <p class="text-lg font-bold mt-3">{{ product.product.product_title }}</p>
                <p class="text-base mt-2">
                  <span v-if="isFutureDeliveryDate(groupedOrder.createdAt)">Sera Livré le <strong>{{
                      formatDate(addDays(groupedOrder.createdAt, 4))
                    }}</strong></span>
                  <span v-else>Livré</span>
                </p>
                <p class="text-base">Statut de la commande : <strong>{{ product.status }}</strong></p>
                <p class="text-base mt-2">Quantité : <strong>{{ product.quantity }}</strong></p>
                <p class="text-base">Prix : <strong>{{ product.amount }} €</strong></p>
              </div>
              <div class="flex gap-4">
                <div class="mt-4">
                  <Button type="submit" variant="secondary" size="medium" @click="viewProduct(product.product._id)">
                    Afficher votre article
                  </Button>
                </div>
                <div class="mt-4">
                  <Button
                    type="submit"
                    variant="secondary"
                    size="medium"
                    @click="createRefund(product.product._id, groupedOrder.paymentProducts.find(pp => pp.productId === product.productId).paymentId, product.quantity)"
                    :disabled="groupedOrder.paymentProducts.find(pp => pp.productId === product.productId).refundStatus === 'refunded'"
                  >
                    {{ groupedOrder.paymentProducts.find(pp => pp.productId === product.productId).refundStatus === 'refunded' ? 'Remboursement effectué' : 'Rembourser l\'article' }}
                  </Button>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.container {
  padding: 1rem;
}
</style>