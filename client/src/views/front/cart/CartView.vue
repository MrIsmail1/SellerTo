<script setup lang='ts'>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cartStore';
import { useAuthStore } from '@/stores/authStore'; 
import Button from '@/components/ui/button/Button.vue';
import CartComponent from '@/components/cart/CartComponent.vue';
import toast from '@/plugins/toast';

const cartStore = useCartStore();
const authStore = useAuthStore(); // Déclarez le store d'authentification ici
const cart = computed(() => cartStore.groupedCart);
const router = useRouter(); // Déclarez le router ici

const removeItem = async (cartItemId) => {
  await cartStore.removeFromCart(cartItemId);
};

const updateQuantity = async (productId, quantity) => {
  await cartStore.updateQuantity(productId, quantity);
};

const handleCheckout = async () => {
  const user = authStore.user;

  if (!user || !user.address) {
    router.push('/account');
    toast.error('Remplissez votre adresse avant de passer commande', {
      position: 'top-right',
      timeout: 3000,
    });
    return;
  }

  await cartStore.confirmPurchase();
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
const promoCode = ref('');
const discount = computed(() => cartStore.discount);
const discountPercentage = computed(() => cartStore.discountPercentage);
const discountAmount = computed(() => cartStore.discountAmount);
const errorMessage = computed(() => cartStore.errorMessage);

const applyPromoCode = async () => {
  await cartStore.applyPromoCode(promoCode.value);
};
</script>

<template>
  <div v-if="!cart.length" class="text-center text-lg">Votre panier est vide</div>
  <main v-else class="block md:flex flex-col md:flex-row p-0 md:p-4 ml-0 md:ml-32">
    <div class="flex-1">
      <h1 class="text-3xl font-bold mb-4">Mon Panier</h1>
      <div>
        <div class="mt-4">
          <CartComponent
              v-for="item in cart"
              :key="item.id"
              :productImage="item.Product.product_photo"
              :productCategory="item.Product.product_category"
              :productDescription="item.Product.product_title"
              :productPrice="item.Product.product_price"
              :productQuantity="item.quantity"
              :cardLink="`/product/${item.Product.id}`"
              @update="(newQuantity) => updateQuantity(item.Product.id, newQuantity)"
          >
            <template #actions>
              <Button @click="() => removeItem(item.id)" variant="secondary" class="mt-2 mb-auto">Supprimer</Button>
            </template>
          </CartComponent>
        </div>
      </div>
    </div>
    <div class="w-96 absolute md:right-20 mt-4 md:mt-0">
      <div class="w-full max-w-md p-4 bg-white shadow-md rounded-lg">
        <h2 class="text-2xl font-bold mb-4">Récapitulatif</h2>
        <div v-for="item in cart" :key="item.id" class="flex justify-between mb-2">
          <span>{{ item.Product.product_title }} x{{ item.quantity }}</span>
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
          <span>{{ 6 }} €</span>
        </div>
        <div v-if="discountAmount > 0" class="flex justify-between border-t pt-2 mt-2 font-bold">
          <span>Remise appliquée</span>
          <span>-{{ discountAmount.toFixed(2) }} €</span>
        </div>
        <div class="flex justify-between border-t pt-2 mt-2 font-bold">
          <span>Total TTC</span>
          <span>{{ total.toFixed(2) }} €</span>
        </div>
        <div class="mt-4 text-sm">
          <p>Paiement sécurisé</p>
          <p>En passant commande vous acceptez nos Conditions générales d'utilisation, nos Conditions générales de vente et notre politique de protection des données</p>
        </div>
        <div class="mt-4">
          <input type="text" v-model="promoCode" placeholder="Code promo" class="w-full p-2 border rounded" />
          <Button @click="applyPromoCode" size="medium" class="mt-2">Appliquer le code promo</Button>
        </div>
        <div v-if="errorMessage" class="mt-4 text-red-500">
          <p>{{ errorMessage }}</p>
        </div>
        <div v-if="discountPercentage > 0" class="mt-4">
          <p>Remise appliquée : -{{ discountPercentage }}%</p>
        </div>
        <div class="text-center mt-4">
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
