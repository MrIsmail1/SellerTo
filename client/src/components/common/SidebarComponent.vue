<script setup lang="ts">
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/stores/authStore";
import {
  CircleUserRound,
  CreditCard,
  Ellipsis,
  FileText,
  LayoutDashboard,
  LogOut,
  MailPlus,
  PackageOpen,
  Settings,
  ShoppingCart,
  Store,
  Tag,
  Users,
} from "lucide-vue-next";
import { RouterLink, useRoute, useRouter } from "vue-router";
import Button from "../ui/button/Button.vue";

const authStore = useAuthStore();
const route = useRoute();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push("/admin/login"); // Rediriger vers la page d'accueil après la déconnexion
};

const primaryMenuItems = [
  {
    route: { name: "AdminDashboard" },
    icon: LayoutDashboard,
    text: "Tableau de bord",
  },
  { route: { name: "AdminOrders" }, icon: FileText, text: "Commandes" },
  { route: { name: "AdminProducts" }, icon: ShoppingCart, text: "Produits" },
  { route: { name: "AdminStocks" }, icon: PackageOpen, text: "Stocks" },
  { route: { name: "AdminPromoCodes" }, icon: Tag, text: "Promo codes" },
  { route: { name: "AdminPromoCodes" }, icon: MailPlus, text: "Newsletters" },
  { route: { name: "AdminUsers" }, icon: Users, text: "Utilisateurs" },
];

const secondaryMenuItems = [
  /*   { route: { name: "" }, icon: Settings, text: "Paramètres" },
   */
  { route: { name: "Homepage" }, icon: Store, text: "Boutique" },
  {
    route: { name: "" },
    icon: LogOut,
    text: "Déconnexion",
    action: handleLogout,
  },
];
</script>

<template>
  <div class="border-r bg-bg-200 lg:block sticky">
    <div class="flex h-full max-h-screen flex-col gap-2">
      <div class="flex h-[60px] items-center border-b px-6">
        <RouterLink
          :to="{ name: 'AdminDashboard' }"
          class="flex items-center gap-2 font-semibold w-full"
        >
          <span class="w-full flex justify-center">
            <img
              src="@/assets/SellerTo-logo.svg"
              class="max-h-16 max-w-32"
              alt="SellerTo Logo"
            />
          </span>
        </RouterLink>
      </div>
      <div class="flex-1 overflow-auto py-2">
        <nav class="grid items-start px-4">
          <span class="text-text-200 text-sm font-regular p-2"
            >MENU PRINCIPALE</span
          >
          <RouterLink
            v-for="(item, index) in primaryMenuItems"
            :key="index"
            :to="item.route"
            :class="[
              'flex',
              'items-center',
              'gap-3',
              'rounded-lg',
              'px-3',
              'py-2',
              'text-md',
              'font-bold',
              'hover:bg-primary-300',
              'hover:text-white',
              {
                'bg-bg-100': route.name === item.route.name,
                'text-text-200': route.name === item.route.name,
              },
            ]"
          >
            <component
              :is="item.icon"
              :class="{
                'text-primary-200': route.name === item.route.name,
                'text-text-200': route.name !== item.route.name,
              }"
              class="h-5 w-5"
            />
            {{ item.text }}
          </RouterLink>
          <div class="py-2">
            <Separator class="bg-accent-200" />
          </div>
          <span class="text-text-200 text-sm font-regular p-2"
            >MENU SECONDAIRE</span
          >
          <RouterLink
            v-for="(item, index) in secondaryMenuItems"
            :key="index"
            :to="item.route"
            :class="[
              'flex',
              'items-center',
              'gap-3',
              'rounded-lg',
              'px-3',
              'py-2',
              'text-md',
              'font-bold',
              'hover:bg-primary-300',
              'hover:text-white',
              {
                'bg-bg-100': route.name === item.route.name,
                'text-text-200': route.name === item.route.name,
              },
            ]"
            @click.prevent="item.action ? item.action() : null"
          >
            <component
              :is="item.icon"
              :class="{
                'text-primary-200': route.name === item.route.name,
                'text-gray-500': route.name !== item.route.name,
              }"
              class="h-5 w-5"
            />
            {{ item.text }}
          </RouterLink>
        </nav>
      </div>
      <div class="flex items-center gap-4 border-t p-4">
        <div class="flex items-center gap-3 mx-2">
          <CircleUserRound class="h-6 w-6 text-text-200" />
          <div class="flex flex-col">
            <span class="text-text-100 text-md font-bold">{{
              authStore.user.firstname + " " + authStore.user.lastname ??
              "Admin"
            }}</span>
            <span class="text-text-200 text-sm font-medium">{{
              authStore.user.email
            }}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                id="menu"
                variant="ghost"
                size="icon"
                className="rounded-full border border-gray-200 w-8 h-8 dark:border-gray-800"
              >
                <Ellipsis class="h-6 w-6 text-text-200" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel id="menu">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  </div>
</template>
