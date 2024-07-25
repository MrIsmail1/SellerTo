<script setup lang="ts">
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
</script>

<template>
  <h2>Nos meilleures ventes</h2>
  <p>Ça part aussi vite que des petits pains (au chocolat).</p>
  <Carousel
    class="relative md:w-full"
    :opts="{
      align: 'start',
    }"
  >
    <CarouselContent class="-ml-1">
      <CarouselItem v-for="(_, index) in 16" :key="index" class="pl-1 md:basis-1/2 lg:basis-1/4">
        <div class="p-1">
          <slot/>
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
</template>