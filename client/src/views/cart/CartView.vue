<script setup lang='ts'>
import { ref, computed } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/ui/button/Button.vue';

const cartStore = useCartStore();
const cart = computed(() => cartStore.cart);

const removeItem = (id) => {
  cartStore.removeItemFromCart(id);
};
</script>

<template>
  <main>
    <h1>Mon Panier</h1>
    <div v-if="!cart.length">Votre panier est vide</div>
    <div v-else>
      <div v-for="item in cart" :key="item.id">
        <h2>{{ item.product_title }}</h2>
        <p>Price: {{ item.product_price }} €</p>
        <p>Quantity: {{ item.quantity }}</p>
        <Button @click="removeItem(item.id)">Remove</Button>
      </div>
    </div>
  </main>
</template>
