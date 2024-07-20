<script setup lang="ts">
import CardSellComponent from "@/components/CardSellComponent.vue";
import BreadCrumbComponent from "@/components/common/BreadCrumbComponent.vue";
import Hr from "@/components/common/HrComponent.vue";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Button from "@/components/ui/button/Button.vue";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { useProductsStore } from "@/stores/productsStore";
import { watchOnce } from "@vueuse/core";
import { Box, CreditCard, Headset, ShieldCheck, Truck } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import AddUserAlert from '@/components/alert/AddUserAlert.vue';


const emblaMainApi = ref<CarouselApi>();
const emblaThumbnailApi = ref<CarouselApi>();
const selectedIndex = ref(0);

function onSelect() {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  selectedIndex.value = emblaMainApi.value.selectedScrollSnap();
  emblaThumbnailApi.value.scrollTo(emblaMainApi.value.selectedScrollSnap());
}

function onThumbClick(index: number) {
  if (!emblaMainApi.value || !emblaThumbnailApi.value) return;
  emblaMainApi.value.scrollTo(index);
}

watchOnce(emblaMainApi, (emblaMainApi) => {
  if (!emblaMainApi) return;

  onSelect();
  emblaMainApi.on("select", onSelect);
  emblaMainApi.on("reInit", onSelect);
});

const route = useRoute();
const productsStore = useProductsStore();
const cartStore = useCartStore();
const productId = route.params.id;

onMounted(async () => {
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts();
  }
});

const accordionItems = [
  {
    value: "item-1",
    title: "Is it accessible?",
    content: "Yes. It adheres to the WAI-ARIA design pattern.",
  },
  {
    value: "item-2",
    title: "Is it unstyled?",
    content:
      "Yes. It's unstyled by default, giving you freedom over the look and feel.",
  },
  {
    value: "item-3",
    title: "Can it be animated?",
    content: "Yes! You can use the transition prop to configure the animation.",
  },
];

const productDetail = computed(() =>
  productsStore.products.find((product) => product._id == productId)
);
const loading = computed(() => productsStore.loading);
const error = computed(() => productsStore.error);
const similarProducts = computed(() => {
  if (productDetail.value) {
    return productsStore.products
      .filter(
        (product) =>
          product.product_category === productDetail.value.product_category &&
          product._id !== productDetail.value._id
      )
      .slice(0, 8);
  }
  return [];
});

const addToCart = async () => {
  await cartStore.addToCart(productId);
};
</script>

<template>
  <main>
    <BreadCrumbComponent />
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">
      Erreur: {{ error }}
    </div>
    <div
      v-else-if="productDetail"
      class="flex flex-col justify-between md:flex-row gap-8 mt-8"
    >
      <div class="w-full md:w-1/3">
        <div class="w-full sm:w-auto center">
          <Carousel
            class="relative w-full max-w-xs"
            @init-api="(val) => (emblaMainApi = val)"
          >
            <CarouselContent>
              <CarouselItem
                v-for="(photo, index) in productDetail.imageUrls"
                :key="index"
              >
                <img
                  :src="photo"
                  alt="Product Image"
                  class="w-full h-auto object-cover rounded-lg"
                />
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>

          <Carousel
            class="relative w-full max-w-xs mt-4"
            @init-api="(val) => (emblaThumbnailApi = val)"
          >
            <CarouselContent class="flex gap-1 ml-0">
              <CarouselItem
                v-for="(photo, index) in productDetail.imageUrls"
                :key="index"
                class="pl-0 basis-1/4 cursor-pointer"
                @click="onThumbClick(index)"
              >
                <img
                  :src="photo"
                  alt="Thumbnail Image"
                  class="w-full h-auto object-cover rounded-lg"
                  :class="index === selectedIndex ? '' : 'opacity-50'"
                />
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div class="w-full md:w-1/2">
        <h1 class="text-2xl font-bold mb-4">
          {{ productDetail.product_title }}
        </h1>
        <p class="mb-2">
          <strong>Description:</strong> {{ productDetail.product_description }}
        </p>
        <p class="mb-2">
          <strong>Prix:</strong> {{ productDetail.product_price }} €
        </p>

        <AddUserAlert :userId="1" :productId="productDetail._id" />

        <Button @click="addToCart" class="mt-4">Ajouter au panier</Button>
        <Accordion type="single" class="w-full">
          <AccordionItem>
            <AccordionTrigger>
              <Sheet>
                <SheetTrigger>Spécifications techniques</SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Spécifications techniques</SheetTitle>
                    <h2>{{ productDetail.product_title }}</h2>
                    <SheetDescription>
                      <h4 class="mt-2">Marchand vérifié</h4>
                      <p>
                        Tous les produits vendus sur SellerTo proviennent de
                        reconditionneurs experts et vérifiés, qui s'engagent à
                        tester chaque appareil selon notre charte qualité.
                        Chaque produit est 100% fonctionnel, parfaitement
                        nettoyé et garanti.
                      </p>
                      <ul class="mt-4">
                        <li v-if="productDetail.brand">
                          <strong>Marque:</strong> {{ productDetail.brand }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.itemModelNumber">
                          <strong>Numéro de modèle:</strong>
                          {{ productDetail.itemModelNumber }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.color">
                          <strong>Couleur:</strong> {{ productDetail.color }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.operatingSystem">
                          <strong>Système d'exploitation:</strong>
                          {{ productDetail.operatingSystem }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.computerHardwarePlatform">
                          <strong>Plateforme matérielle:</strong>
                          {{ productDetail.computerHardwarePlatform }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.keyboardDescription">
                          <strong>Description du clavier:</strong>
                          {{ productDetail.keyboardDescription }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.processorBrand">
                          <strong>Marque du processeur:</strong>
                          {{ productDetail.processorBrand }} <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.typeOfProcessor">
                          <strong>Type de processeur:</strong>
                          {{ productDetail.typeOfProcessor }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.speedOfProcessor">
                          <strong>Vitesse du processeur:</strong>
                          {{ productDetail.speedOfProcessor }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.numberOfHearts">
                          <strong>Nombre de coeurs:</strong>
                          {{ productDetail.numberOfHearts }} <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.sizeRam">
                          <strong>Taille de la RAM:</strong>
                          {{ productDetail.sizeRam }} <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.sizeSsd">
                          <strong>Taille du SSD:</strong>
                          {{ productDetail.sizeSsd }} <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.typeOfStorage">
                          <strong>Type de stockage:</strong>
                          {{ productDetail.typeOfStorage }} <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.sizeScreen">
                          <strong>Taille de l'écran:</strong>
                          {{ productDetail.sizeScreen }} <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.gpu">
                          <strong>GPU:</strong> {{ productDetail.gpu }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.gpuRam">
                          <strong>RAM du GPU:</strong>
                          {{ productDetail.gpuRam }} <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.connectivityType">
                          <strong>Type de connectivité:</strong>
                          {{ productDetail.connectivityType }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.wirelessTechnologyType">
                          <strong>Type de technologie sans fil:</strong>
                          {{ productDetail.wirelessTechnologyType }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.computerHardwareInterface">
                          <strong>Interface matérielle:</strong>
                          {{ productDetail.computerHardwareInterface }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.connectorType">
                          <strong>Type de connecteur:</strong>
                          {{ productDetail.connectorType }} <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.softwareIncluded">
                          <strong>Logiciels inclus:</strong>
                          {{ productDetail.softwareIncluded }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.itemDimensionsLxWxH">
                          <strong>Dimensions:</strong>
                          {{ productDetail.itemDimensionsLxWxH }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.weight">
                          <strong>Poids:</strong> {{ productDetail.weight }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.resolution">
                          <strong>Résolution:</strong>
                          {{ productDetail.resolution }} <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.series">
                          <strong>Série:</strong> {{ productDetail.series }}
                          <Hr class="my-4" />
                        </li>
                        <li v-if="productDetail.keyboardAndLanguage">
                          <strong>Clavier et langue:</strong>
                          {{ productDetail.keyboardAndLanguage }}
                          <Hr class="my-4" />
                        </li>
                      </ul>
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" class="w-full">
          <AccordionItem>
            <AccordionTrigger>
              <Sheet>
                <SheetTrigger>Garanties & Assistance</SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Garanties & Assistance</SheetTitle>
                    <h2>{{ productDetail.product_title }}</h2>
                    <div class="flex flex-col gap-4 mt-4">
                      <div class="flex gap-4">
                        <div>
                          <ShieldCheck class="w-6 h-6" />
                        </div>
                        <div>
                          <h7 class="font-semibold"
                            >Garantie commerciale 12 mois</h7
                          >
                          <br />
                          <h7
                            >En cas de panne le produit est réparé sans frais.
                            Si la réparation n’est pas possible, le produit est
                            échangé. Olé.</h7
                          >
                        </div>
                      </div>
                      <div class="flex gap-4">
                        <div>
                          <Box class="w-6 h-6" />
                        </div>
                        <div>
                          <h7 class="font-semibold"
                            >30 jours pour tester le produit</h7
                          >
                          <br />
                          <h7
                            >Vous avez 30 jours après réception du produit pour
                            l'utiliser. S'il ne correspond pas à vos attentes,
                            on vous le rembourse aussi sec.</h7
                          >
                        </div>
                      </div>
                      <div class="flex gap-4">
                        <div>
                          <Truck class="w-6 h-6" />
                        </div>
                        <div>
                          <h7 class="font-semibold"
                            >Livraison standard offerte</h7
                          >
                          <br />
                          <h7>On vous livre rapidement et gratuitement.</h7>
                        </div>
                      </div>
                      <div class="flex gap-4">
                        <div>
                          <Headset class="w-6 h-6" />
                        </div>
                        <div>
                          <h7 class="font-semibold">Service client réactif</h7>
                          <br />
                          <h7
                            >Comptez sur nous pour vous répondre dans un délai
                            de 1 jour ouvré !</h7
                          >
                        </div>
                      </div>
                      <div class="flex gap-4">
                        <div>
                          <CreditCard class="w-6 h-6" />
                        </div>
                        <div>
                          <h7 class="font-semibold"
                            >Paiement en plusieurs fois</h7
                          >
                          <br />
                          <h7
                            >Validez votre panier pour découvrir nos options de
                            paiement en plusieurs fois.</h7
                          >
                        </div>
                      </div>
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
        <Accordion type="single" class="w-full">
          <AccordionItem>
            <AccordionTrigger>
              <Sheet>
                <SheetTrigger>Questions fréquentes</SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Questions fréquentes</SheetTitle>
                    <Accordion
                      type="single"
                      class="w-full"
                      collapsible
                      :default-value="defaultValue"
                    >
                      <AccordionItem
                        v-for="item in accordionItems"
                        :key="item.value"
                        :value="item.value"
                      >
                        <AccordionTrigger>{{ item.title }}</AccordionTrigger>
                        <AccordionContent> ezffezlkm </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <SheetDescription>
                      This action cannot be undone. This will permanently delete
                      your account and remove your data from our servers.
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
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
