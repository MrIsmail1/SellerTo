<script setup lang='ts'>
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useProductDetailStore } from '@/stores/productDetailStore';
import { useCartStore } from '@/stores/cartStore';
import BreadCrumbComponent from '@/components/common/BreadCrumbComponent.vue';
import Button from '@/components/ui/button/Button.vue';

const route = useRoute();
const productDetailStore = useProductDetailStore();
const cartStore = useCartStore();
const productId = route.params.id;

onMounted(async () => {
  await productDetailStore.fetchProductDetail(productId);
});

const productDetail = computed(() => productDetailStore.productDetail);
const loading = computed(() => productDetailStore.loading);
const error = computed(() => productDetailStore.error);

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
      <h1>{{ productDetail.data.product_title }}</h1>
      <img :src="productDetail.data.product_photo" alt="product image" />
      <p>{{ productDetail.data.product_description }}</p>
      <p>Price: {{ productDetail.data.product_price }} €</p>
      <Button @click="addToCart">Ajouter au panier</Button>
    </div>
  </main>
</template>
