<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProductsStore } from '@/stores/productsStore';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import { CircleUser, Search, ShoppingBasket } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';

const productStore = useProductsStore();
const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const searchQuery = ref('');
const showSuggestions = ref(false);

onMounted(() => {
  productStore.fetchProducts();
  if (route.query.title) {
    productStore.searchProductByTitle(route.query.title);
  }
});

const handleSearch = async () => {
  if (searchQuery.value.trim() !== '') {
    await productStore.searchProductByTitle(searchQuery.value);
    router.push({ path: '/search', query: { title: searchQuery.value } });
  }
};

const handleLogout = async () => {
  await authStore.logout();
  router.push('/'); // Rediriger vers la page d'accueil après la déconnexion
};

const isLoggedIn = computed(() => authStore.user !== null);

//TODO : à supprimer plus tard
// watch(searchQuery, (newValue) => {
//   if (newValue.trim() === '') {
//     showSuggestions.value = true;
//   } else {
//     showSuggestions.value = false;
//   }
// });

const handleSuggestionClick = (path: string) => {
  router.push(path);
  showSuggestions.value = false;
};
</script>

<template>
  <header class="sticky gap-4 bg-background mb-8">
    <div class="flex px-4 bg-white pt-2">
      <nav class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <RouterLink to="/">
          <img src="@/assets/SellerTo-logo.svg" class="h-32" alt="SellerTo Logo" />
        </RouterLink>
        <a href="#" class="transition-colors hover:text-foreground">Dashboard</a>
        <a href="#" class="transition-colors hover:text-foreground">Orders</a>
        <a href="#" class="transition-colors hover:text-foreground">Products</a>
      </nav>
      <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form @submit.prevent="handleSearch" class="ml-auto flex-1">
          <div class="relative" @click.stop>
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input v-model="searchQuery"  @focus="showSuggestions = true" @blur="showSuggestions = false" type="search" placeholder="Que cherchez-vous ?" class="pl-8 w-full" />
            <div v-if="showSuggestions" class="absolute bg-white border border-gray-200 w-full mt-1 z-10">
              <ul>
                <li>
                  <RouterLink :to="`/category/macbook`" class="block px-4 py-2 hover:bg-gray-100" @mousedown.prevent="handleSuggestionClick(`/category/macbook`)">
                    MacBooks
                  </RouterLink>
                </li>
                <li>
                  <RouterLink :to="`/category/iphone`" class="block px-4 py-2 hover:bg-gray-100" @mousedown.prevent="handleSuggestionClick(`/category/iphone`)">
                    iPhone
                  </RouterLink>
                </li>
                <li>
                  <RouterLink :to="`/category/samsung`" class="block px-4 py-2 hover:bg-gray-100" @mousedown.prevent="handleSuggestionClick(`/category/samsung`)">
                    Samsung
                  </RouterLink>
                </li>
              </ul>
            </div>
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <RouterLink :to="isLoggedIn ? '' : '/login'">
              <Button variant="secondary" size="icon" class="rounded-full">
                <CircleUser class="h-5 w-5" />
              </Button>
            </RouterLink>
          </DropdownMenuTrigger>
          <DropdownMenuContent v-if="isLoggedIn">
            <DropdownMenuItem>
              <RouterLink to="/account">Mon compte</RouterLink>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleLogout">
              Déconnexion
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <RouterLink to="/cart">
          <ShoppingBasket class="h-5 w-5" />
          <span v-if="cartStore.cart.length" class="text-sm">{{ cartStore.cart.length }}</span>
        </RouterLink>
      </div>
    </div>
    <div>
      <nav class="p-2 hidden bg-gray-200 flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 px-8 overflow-hidden overflow-x-scroll no-scrollbar">
        <template v-for="category in productStore.productCategories" :key="category">
          <RouterLink :to="`/category/${category}`" class="transition-colors hover:text-foreground capitalize">{{ category }}</RouterLink>
        </template>
      </nav>
    </div>
  </header>
</template>
