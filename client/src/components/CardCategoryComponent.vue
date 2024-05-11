<script setup lang='ts'>
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardImage,
} from '@/components/ui/card';

const props = defineProps({
  productImage: String,
  productCategory: String,
  productDescription: String,
  cardImageClass: String,
  cardClass: String,
  cardLink: String,
})

</script>

<template>
    <Card :class="['w-64 h-[22.75rem]', cardClass]">
      <RouterLink :to="cardLink">
      <CardImage>
          <img :class="['p-8 rounded-t-lg h-56']" :src="productImage" alt="product image" />
      </CardImage>
      <CardHeader>
        <CardTitle>{{ productCategory }}</CardTitle>
        <CardDescription>{{ productDescription }}</CardDescription>
      </CardHeader>
      </RouterLink>
    </Card>
</template>