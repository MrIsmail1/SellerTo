 <script setup lang="ts">
import { useRoute } from 'vue-router';
import { onMounted, ref, computed } from 'vue';
import { useOrdersStore } from '@/stores/orderStore';
import { useProductsStore } from '@/stores/productsStore';
import Button from '@/components/ui/button/Button.vue';
import { storeToRefs } from "pinia";
import {Accordion} from "@/components/ui/accordion";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import CardSellComponent from "@/components/CardSellComponent.vue";

const route = useRoute();
const ordersStore = useOrdersStore();
const productsStore = useProductsStore();
const { order, loading, error } = storeToRefs(ordersStore);
const { products } = storeToRefs(productsStore);
const orderId = route.params.id;

onMounted(async () => {
  await ordersStore.fetchOrder(orderId);
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts();
  }
});

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
};

const addDays = (dateString: string, days: number) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date;
};

const isDelivered = (deliveryDate: Date) => {
  const currentDate = new Date();
  return currentDate >= deliveryDate;
};

const buyAgain = (productId: number) => {

};

const orderDetail = computed(() => order.value);
const deliveryLabel = computed(() => {
  if (order.value) {
    const deliveryDate = addDays(order.value.createdAt, 4);
    return isDelivered(deliveryDate) ? 'Livré le :' : 'Sera livré le :';
  }
  return 'Sera livré le :';
});

const similarProducts = computed(() => {
  if (orderDetail.value) {
    return products.value
        .filter(product => product.product_category === orderDetail.value.product.product_category && product._id !== orderDetail.value.product._id)
        .slice(0, 8);
  }
  return [];
});

const accordionItems = [
  { value: 'item-1', title: 'Is it accessible?', content: 'Yes. It adheres to the WAI-ARIA design pattern.' },
  { value: 'item-2', title: 'Is it unstyled?', content: 'Yes. It\'s unstyled by default, giving you freedom over the look and feel.' },
  { value: 'item-3', title: 'Can it be animated?', content: 'Yes! You can use the transition prop to configure the animation.' },
];
</script>

 <template>
   <main>
     <h1 class="font-bold text-5xl my-4 mb-6 pb-6">Ma Commande</h1>
     <div v-if="loading" class="text-center">Chargement...</div>
     <div v-else-if="error" class="text-center text-red-500">Erreur: {{ error }}</div>
     <div v-else-if="orderDetail" class="flex flex-col justify-between md:flex-row gap-8 mt-8">
       <div class="w-full md:w-1/3">
         <img :src="orderDetail.product.product_photo" alt="Product Image" class="w-full h-auto object-cover rounded-lg" />
       </div>
       <div class="w-full md:w-1/2">
         <h1 class="text-2xl font-bold mb-4">{{ orderDetail.product.product_title }}</h1>
         <p class="mb-2"><strong>Prix :</strong> {{ orderDetail.amount }} €</p>
         <p class="mb-2"><strong>Produit commandé le : </strong> {{ formatDate(orderDetail.createdAt) }}</p>
         <p class="mb-2"><strong>{{ deliveryLabel }} </strong> {{ formatDate(addDays(orderDetail.createdAt, 4)) }}</p>
         <p class="mb-2"><strong>Numéro de commande : </strong> {{ orderDetail.trackingCode }}</p>
         <p class="mb-2"><strong>Statut de la commande : </strong> {{ orderDetail.status }}</p>
         <p class="mb-2"><strong>Adresse de livraison :</strong> {{ orderDetail.user.address }}, {{ orderDetail.user.country }} {{ orderDetail.user.city }} {{ orderDetail.user.postalCode }} </p>
         <Button @click="buyAgain(orderDetail.product._id)" class="mt-4">Acheter à nouveau</Button>

         <div class="mt-6">
           <Accordion type="single" class="w-full mt-4">
             <AccordionItem>
               <AccordionTrigger>
                 <Sheet>
                   <SheetTrigger>Garanties & Assistance ></SheetTrigger>
                   <SheetContent>
                     <SheetHeader>
                       <SheetTitle>Garanties & Assistance</SheetTitle>
                       <h2>{{ orderDetail.product.product_title }}</h2>
                       <div class="flex flex-col gap-4 mt-4">
                         <div class="flex gap-4">
                           <div>
                             <ShieldCheck class="w-6 h-6" />
                           </div>
                           <div>
                             <h7 class="font-semibold">Garantie commerciale 12 mois</h7> <br>
                             <h7>En cas de panne le produit est réparé sans frais. Si la réparation n’est pas possible, le produit est échangé. Olé.</h7>
                           </div>
                         </div>
                         <div class="flex gap-4">
                           <div>
                             <Box class="w-6 h-6" />
                           </div>
                           <div>
                             <h7 class="font-semibold">30 jours pour tester le produit</h7> <br>
                             <h7>Vous avez 30 jours après réception du produit pour l'utiliser. S'il ne correspond pas à vos attentes, on vous le rembourse aussi sec.</h7>
                           </div>
                         </div>
                         <div class="flex gap-4">
                           <div>
                             <Truck class="w-6 h-6" />
                           </div>
                           <div>
                             <h7 class="font-semibold">Livraison standard offerte</h7> <br>
                             <h7>On vous livre rapidement et gratuitement.</h7>
                           </div>
                         </div>
                         <div class="flex gap-4">
                           <div>
                             <Headset class="w-6 h-6" />
                           </div>
                           <div>
                             <h7 class="font-semibold">Service client réactif</h7> <br>
                             <h7>Comptez sur nous pour vous répondre dans un délai de 1 jour ouvré !</h7>
                           </div>
                         </div>
                         <div class="flex gap-4">
                           <div>
                             <CreditCard class="w-6 h-6" />
                           </div>
                           <div>
                             <h7 class="font-semibold">Paiement en plusieurs fois</h7> <br>
                             <h7>Validez votre panier pour découvrir nos options de paiement en plusieurs fois.</h7>
                           </div>
                         </div>
                       </div>
                     </SheetHeader>
                   </SheetContent>
                 </Sheet>
               </AccordionTrigger>
             </AccordionItem>
           </Accordion>
           <Accordion type="single" class="w-full mt-4">
             <AccordionItem>
               <AccordionTrigger>
                 <Sheet>
                   <SheetTrigger>Questions fréquentes ></SheetTrigger>
                   <SheetContent>
                     <SheetHeader>
                       <SheetTitle>Questions fréquentes</SheetTitle>
                       <Accordion type="single" class="w-full" collapsible :default-value="defaultValue">
                         <AccordionItem v-for="item in accordionItems" :key="item.value" :value="item.value">
                           <AccordionTrigger>{{ item.title }}</AccordionTrigger>
                           <AccordionContent>
                             {{ item.content }}
                           </AccordionContent>
                         </AccordionItem>
                       </Accordion>
                     </SheetHeader>
                   </SheetContent>
                 </Sheet>
               </AccordionTrigger>
             </AccordionItem>
           </Accordion>
         </div>
       </div>
     </div>
     <h2 class="text-2xl font-bold mt-8">Ça pourrait bien vous intéresser</h2>
     <div class="flex flex-wrap justify-between mt-8 gap-6">
       <template v-for="product in similarProducts" :key="product.id">
         <CardSellComponent cardClass="w-[24rem]" :product="product" />
       </template>
     </div>
   </main>
 </template>