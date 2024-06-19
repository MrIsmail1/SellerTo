<script setup lang="ts">
import {useProductsStore} from '@/stores/productsStore';
import {computed, onMounted, watch} from 'vue';
import CardSellComponent from '@/components/CardSellComponent.vue';
import FilterComponent from '@/components/filter/FilterComponent.vue';
import {useRoute} from 'vue-router';
import {Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription} from '@/components/ui/sheet';
import {Button} from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-vue-next';


const productStore = useProductsStore();
const route = useRoute();

const initializeFiltersFromURL = () => {
  const query = route.query;
  Object.keys(productStore.filters).forEach(filterKey => {
    if (query[filterKey]) {
      productStore.filters[filterKey] = query[filterKey].split(',').map(value => decodeURIComponent(value));
    } else {
      productStore.filters[filterKey] = [];
    }
  });
};

onMounted(() => {
  initializeFiltersFromURL();
  productStore.fetchProducts();
  if (route.query.query) {
    productStore.searchProductByTitleOrDescription(route.query.query);
  }
});

const categoryName = computed(() => route.params.categoryName);
const filteredProducts = computed(() => {
  return productStore.filteredProducts.filter(product => product.product_category === categoryName.value);
});

watch(() => route.query, (newQuery) => {
  if (newQuery.query) {
    productStore.searchProductByTitleOrDescription(newQuery.query);
  } else {
    initializeFiltersFromURL();
  }
}, {immediate: true});

</script>

<template>
  <main>
    <Sheet>
        <SheetTrigger as-child>
          <Button class="fixed md:hidden visible md:invisible bottom-0 left-0 bg-white w-full p-4" variant="outline">
            Filtrer <SlidersHorizontal class="ml-2"/>
          </Button>
        </SheetTrigger>
        <SheetContent class="rounded-lg h-screen" side="bottom">
          <SheetHeader>
              <FilterComponent :filteredProducts="filteredProducts"/>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    <div class="mt-2 md:mt-6 grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div class="hidden border-r bg-muted/40 md:block">
        <div class="flex h-full max-h-screen flex-col gap-2">
          <FilterComponent :filteredProducts="filteredProducts"/>
        </div>
      </div>
      <div class="flex flex-wrap justify-between -mt-4">
        <template v-for="product in filteredProducts" :key="product._id">
          <CardSellComponent :product="product" class="mt-4"/>
        </template>
      </div>
    </div>
  </main>
</template>
