<script setup lang='ts'>
import { computed, onMounted, onUnmounted } from 'vue';
import { useCartStore } from '@/stores/cartStore';
import Button from '@/components/ui/button/Button.vue';
import CartComponent from '@/components/cart/CartComponent.vue';

const cartStore = useCartStore();
const cart = computed(() => cartStore.groupedCart);

const removeItem = async (cartItemId) => {
  await cartStore.removeFromCart(cartItemId);
};

const updateQuantity = async (productId, quantity) => {
  await cartStore.updateQuantity(productId, quantity);
};

const handleCheckout = async () => {
  await cartStore.handleCheckout();
};

const generatePaymentLink = async () => {
  await cartStore.generatePaymentLink();
};

let cleanInterval;

onMounted(async () => {
  await cartStore.fetchCart();
  cleanInterval = setInterval(async () => {
    await cartStore.fetchCart();
  }, 15000);
});

onUnmounted(() => {
  clearInterval(cleanInterval);
});

const subTotal = computed(() => cartStore.subTotal);
const total = computed(() => cartStore.total);
const paymentLink = computed(() => cartStore.paymentLink);
</script>

<template>
  <div v-if="!cart.length" class="text-center text-lg">Votre panier est vide</div>
  <main v-else
   class="flex flex-col md:flex-row gap-4 container mx-auto p-4">
    <div class="flex-1">
      <h1 class="text-3xl font-bold mb-4">Mon Panier</h1>
      <div >
        <div class="mt-4">
          <CartComponent
            v-for="item in cart"
            :key="item.productId._id"
            :productImage="item.productId.product_photo"
            :productCategory="item.productId.product_category"
            :productDescription="item.productId.product_title"
            :productPrice="item.productId.product_price"
            :productQuantity="item.quantity"
            :cardLink="`/products/${item.productId._id}`"
            @update="updateQuantity(item.productId._id, $event)"
          >
            <template #actions>
              <Button @click="() => removeItem(item._id)" variant="secondary" class="mt-2 mb-auto">Supprimer</Button>
            </template>
          </CartComponent>
        </div>
      </div>
    </div>
    <div class="w-96 absolute right-11">
      <div class="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
        <h2 class="text-2xl font-bold mb-4">Récapitulatif</h2>
        <div v-for="item in cart" :key="item.productId._id" class="flex justify-between mb-2">
          <span>{{ item.productId.product_title }} x{{ item.quantity }}</span>
        </div>
        <div class="flex justify-between border-t pt-2 mt-2">
          <span>Livraison</span>
          <span>Offert</span>
        </div>
        <div class="flex justify-between border-t pt-2 mt-2">
          <span>Sous-total</span>
          <span>{{ subTotal }} €</span>
        </div>
        <div class="flex justify-between border-t pt-2 mt-2">
          <span>Frais de service SellerTo</span>
          <span>{{ 6.49 }} €</span>
        </div>
        <div class="flex justify-between border-t pt-2 mt-2 font-bold">
          <span>Total TTC</span>
          <span>{{ total }} €</span>
        </div>
        <div class="mt-4 text-sm">
          <p>Paiement sécurisé</p>
          <p>En passant commande vous acceptez nos Conditions générales d'utilisation, nos Conditions générales de vente et notre politique de protection des données</p>
        </div>
        <div class="text-center">
          <Button @click="handleCheckout" size="medium">Passer commande</Button>
          <Button @click="generatePaymentLink" size="medium">Générer un lien de paiement</Button>
        </div>
        <div v-if="paymentLink" class="mt-4">
          <p>Lien de paiement :</p>
          <a :href="paymentLink" target="_blank">{{ paymentLink }}</a>
        </div>
      </div>
    </div>
  </main>
</template>
