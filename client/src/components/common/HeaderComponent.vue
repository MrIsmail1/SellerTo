<script setup lang="ts">
import { CircleUser, Search,ShoppingBasket } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { useProductsStore } from '@/stores/productsStore'
import { onMounted } from 'vue'

const productStore = useProductsStore();

onMounted(() => {
  productStore.fetchProducts();
});

</script>

<template>
    <header class="sticky gap-4 bg-background mb-8">
      <div class="flex px-4 bg-white pt-2">
      <nav class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <a href="/">
          <img src="@/assets/SellerTo-logo.svg" class="h-32" alt="SellerTo Logo" />
        </a>
        <a
          href="#"
          class=" transition-colors hover:text-foreground"
        >
          Dashboard
        </a>
        <a
          href="#"
          class=" transition-colors hover:text-foreground"
        >
          Orders
        </a>
        <a
          href="#"
          class=" transition-colors hover:text-foreground"
        >
          Products
        </a>
        
      </nav>
      <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form class="ml-auto flex-1">
          <div class="relative">
            <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Que cherchez-vous ?"
              class="pl-8 w-full"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
             <a href="/login">Mon compte</a>
            </DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <a href="/logout">Déconnexion</a>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <a href="/">
          <ShoppingBasket class="h-5 w-5" />
        </a>
      </div>
      </div>
    <div>
      <nav class="hidden bg-gray-200 flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6 px-8 overflow-hidden overflow-x-scroll no-scrollbar">
          <template v-for="category in productStore.productCategories" :key="category">
          <a :href="`/category/${category}`" class="transition-colors hover:text-foreground capitalize">{{ category }}</a>
        </template>
        </nav>
    </div>
    </header>
</template>