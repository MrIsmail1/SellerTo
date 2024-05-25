<script setup lang='ts'>
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useProductsStore } from '@/stores/productsStore';
import { useCartStore } from '@/stores/cartStore';
import BreadCrumbComponent from '@/components/common/BreadCrumbComponent.vue';
import Button from '@/components/ui/button/Button.vue';

const route = useRoute();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const productId = route.params.id;

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts();
  }
});

const productDetail = computed(() => productsStore.products.find(product => product._id === productId));
const loading = computed(() => productsStore.loading);
const error = computed(() => productsStore.error);

const addToCart = async () => {
  await cartStore.addToCart(productId);
};
</script>

<template>
  <main>
    <BreadCrumbComponent />
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="productDetail">
      <h1>{{ productDetail.product_title }}</h1>
      <img :src="productDetail.product_photo" alt="product image" />
      <p>{{ productDetail.data }}</p>
      <p>Price: {{ productDetail.product_price }} €</p>
      <Button @click="addToCart">Ajouter au panier</Button>
    </div>
  </main>
</template>
