<script setup lang='ts'>
import { ref, computed, onMounted } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/ui/button/Button.vue';

const cartStore = useCartStore();
const cart = computed(() => cartStore.cart);

const removeItem = async (cartItemId) => {
  await cartStore.removeFromCart(cartItemId);
};

onMounted(async () => {
  await cartStore.fetchCart();
});
</script>

<template>
  <main>
    <h1>Mon Panier</h1>
    <div v-if="!cart.length">Votre panier est vide</div>
    <div v-else>
      <div v-for="item in cart" :key="item._id">
        <h2>{{ item.productId.product_title }}</h2>
        <p>Price: {{ item.productId.product_price }} €</p>
        <Button @click="removeItem(item._id)">Remove</Button>
      </div>
    </div>
  </main>
</template>
