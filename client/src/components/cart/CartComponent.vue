<script setup lang='ts'>
import { defineProps, defineEmits, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardImage,
  CardContent,
} from '@/components/ui/card';

const props = defineProps({
  productImage: String,
  productCategory: String,
  productDescription: String,
  productPrice: Number,
  productQuantity: Number,
  cardImageClass: String,
  cardClass: String,
  cardLink: String,
});

const emits = defineEmits(['update']);
const quantity = ref(props.productQuantity);

const updateQuantity = () => {
  emits('update', quantity.value);
};

watch(quantity, (newQuantity) => {
  updateQuantity();
});
</script>

<template>
  <Card :class="['w-full md:h-80 h-[34rem] flex flex-col md:flex-row items-center mt-4', cardClass]">
    <RouterLink class="flex flex-col md:flex-row hover:bg-inherit" :to="cardLink">
      <img :class="['p-8 rounded-t-lg h-56']" :src="productImage" alt="product image" />
      <CardHeader class="mt-8">
        <CardTitle>{{ productCategory }}</CardTitle>
        <CardDescription>{{ productDescription }}</CardDescription>
        <h4 class="text-red-600 font-medium underline">Garantie commerciale de 12 mois</h4>
        <CardContent class="p-0">
          <p>Prix : {{ productPrice }} €</p>
        </CardContent>
      </CardHeader>
    </RouterLink>
    <div class="flex flex-col items-center justify-center mt-4">
      <label for="quantity" class="mb-2">Quantité</label>
      <select v-model="quantity" id="quantity" class="border rounded px-2 py-1">
        <option v-for="n in 10" :key="n" :value="n">{{ n }}</option>
      </select>
      <slot name="actions"></slot>
    </div>
  </Card>
</template>
