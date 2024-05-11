<script setup lang="ts">
import Footer from '@/components/common/FooterComponent.vue';
import { useProductsStore } from '@/stores/productsStore';
import { onMounted } from 'vue';
import Card from '@/components/ui/card/Card.vue';


const productStore = useProductsStore();

onMounted(() => {
  productStore.fetchProducts();
});

</script>

<template>
  <main>
     klmzfeklmezf
  </main>
  <Footer />
</template>