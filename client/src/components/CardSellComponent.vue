<script setup lang='ts'>
import { defineProps, computed } from 'vue';
import { RouterLink } from 'vue-router';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  CardImage,
} from '@/components/ui/card';

const props = defineProps({
  product: Object,
  cardClass: String,
  cardImageClass: String
});

const starRating = computed(() => {
  const fullStars = Math.floor(props.product.product_star_rating);
  const hasHalfStar = props.product.product_star_rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  return {
    fullStars,
    hasHalfStar,
    emptyStars
  };
});
</script>

<template>
  <RouterLink :to="{ name: 'Product', params: { id: product._id } }">
    <Card :class="['w-64 h-[22.75rem] p-0 mb-8', cardClass]">
      <CardImage>
        <img :class="['p-8 rounded-t-lg h-32', cardImageClass]" :src="product.product_photo" alt="product image" />
      </CardImage>
      <CardHeader>
        <CardTitle>{{ product.product_title }}</CardTitle>
        <CardDescription>{{ product.product_description }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex items-center mt-2.5">
          <span>{{ product.product_star_rating }}</span>
          <div class="ml-1 flex items-center space-x-1 rtl:space-x-reverse">
            <!-- Full stars -->
            <svg v-for="n in starRating.fullStars" :key="'full-' + n" class="w-3 h-3 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
            <!-- Half star -->
            <svg v-if="starRating.hasHalfStar" class="w-3 h-3 text-black" viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.701 0.907977C10.8189 0.663803 11.0039 0.458194 11.2342 0.315131C11.4646 0.172068 11.7309 0.097449 12.002 0.0999767C12.519 0.0999767 13.036 0.369977 13.302 0.907977L15.992 6.35998L22.01 7.23498C23.2 7.40798 23.674 8.86898 22.814 9.70798L18.459 13.952L19.487 19.945C19.691 21.13 18.447 22.033 17.384 21.474L12.002 18.644L6.62001 21.474C5.55601 22.033 4.31301 21.13 4.51601 19.945L5.54401 13.952L1.18901 9.70798C0.329014 8.86898 0.804015 7.40798 1.99301 7.23498L8.01002 6.35998L10.701 0.907977ZM12.002 17.138C12.234 17.138 12.465 17.193 12.676 17.304L17.992 20.099L16.977 14.179C16.896 13.709 17.052 13.229 17.394 12.896L21.694 8.70498L15.751 7.84098C15.5183 7.80723 15.2974 7.71741 15.1071 7.57926C14.9169 7.44112 14.7631 7.25878 14.659 7.04798L12.002 1.66298V17.138Z" fill="black"/>
            </svg>
            <!-- Empty stars -->
            <svg v-for="n in starRating.emptyStars" :key="'empty-' + n" class="w-3 h-3 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
              <path d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z"/>
            </svg>
          </div>
          <span class="px-2">(8661)</span>
        </div>
      </CardContent>
      <CardFooter class="px-4">
        <p>À partir de</p>
        <h6 class="h7">{{ product.product_price }} € </h6>
      </CardFooter>
    </Card>
  </RouterLink>
</template>
