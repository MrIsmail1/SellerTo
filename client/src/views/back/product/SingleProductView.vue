<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import Hr from "@/components/common/HrComponent.vue";
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
import { useProductsStore } from "@/stores/productsStore";
import { watchOnce } from "@vueuse/core";
import {
  Box,
  CreditCard,
  Headset,
  Pencil,
  ShieldCheck,
  Truck,
} from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();

const navigateToEditProduct = () => {
  router.push({ name: "AdminEditProduct", params: { id: productId } }); // Redirect to the edit product page
};
const route = useRoute();
const productsStore = useProductsStore();
const productId = route.params.id;

onMounted(async () => {
  await productsStore.getProductById(productId); // Fetch the product by ID
});

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

const productDetails = computed(() => productsStore.product); // Get the product details
const loading = computed(() => productsStore.loading); // Get the loading state
const error = computed(() => productsStore.error); // Get the error state
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100"
        >Visualisation du produit</span
      >
      <span class="text-md text-text-200">Visualiser votre produit.</span>
    </span>
    <Button
      class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
      @click="navigateToEditProduct"
    >
      <Pencil class="icon w-6 h-6 mr-2 text-primary-200" />
      Modifier
    </Button>
  </div>
  <div class="flex flex-col justify-center w-4/5 h-[80vh] m-auto flex-grow">
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">
      Erreur: {{ error }}
    </div>
    <div
      v-else-if="productDetails"
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
                v-for="(photo, index) in productDetails.imageUrls"
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
                v-for="(photo, index) in productDetails.imageUrls"
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
          {{ productDetails.product_title }}
        </h1>
        <!-- <p class="mb-2"><strong>Catégorie:</strong> {{ productDetails.product_category }}</p> -->
        <p class="mb-2">
          <strong>Description:</strong> {{ productDetails.product_description }}
        </p>
        <p class="mb-2">
          <strong>Prix:</strong> {{ productDetails.product_price }} €
        </p>
        <Accordion type="single" class="w-full">
          <AccordionItem>
            <AccordionTrigger>
              <Sheet>
                <SheetTrigger>Spécifications techniques</SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Spécifications techniques</SheetTitle>
                    <h2>{{ productDetails.product_title }}</h2>
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
                        <li
                          v-for="(
                            value, key
                          ) in productDetails.product_information"
                          :key="key"
                        >
                          <strong>{{ key }}:</strong> {{ value }}
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
                    <h2>{{ productDetails.product_title }}</h2>
                    <div class="flex flex-col gap-4 mt-4">
                      <div class="flex gap-4">
                        <div>
                          <ShieldCheck class="w-6 h-6" />
                        </div>
                        <div>
                          <h6 class="font-semibold">
                            Garantie commerciale 12 mois
                          </h6>
                          <br />
                          <h6>
                            En cas de panne le produit est réparé sans frais. Si
                            la réparation n’est pas possible, le produit est
                            échangé. Olé.
                          </h6>
                        </div>
                      </div>
                      <div class="flex gap-4">
                        <div>
                          <Box class="w-6 h-6" />
                        </div>
                        <div>
                          <h6 class="font-semibold">
                            30 jours pour tester le produit
                          </h6>
                          <br />
                          <h6>
                            Vous avez 30 jours après réception du produit pour
                            l'utiliser. S'il ne correspond pas à vos attentes,
                            on vous le rembourse aussi sec.
                          </h6>
                        </div>
                      </div>
                      <div class="flex gap-4">
                        <div>
                          <Truck class="w-6 h-6" />
                        </div>
                        <div>
                          <h6 class="font-semibold">
                            Livraison standard offerte
                          </h6>
                          <br />
                          <h6>On vous livre rapidement et gratuitement.</h6>
                        </div>
                      </div>
                      <div class="flex gap-4">
                        <div>
                          <Headset class="w-6 h-6" />
                        </div>
                        <div>
                          <h6 class="font-semibold">Service client réactif</h6>
                          <br />
                          <h6>
                            Comptez sur nous pour vous répondre dans un délai de
                            1 jour ouvré !
                          </h6>
                        </div>
                      </div>
                      <div class="flex gap-4">
                        <div>
                          <CreditCard class="w-6 h-6" />
                        </div>
                        <div>
                          <h6 class="font-semibold">
                            Paiement en plusieurs fois
                          </h6>
                          <br />
                          <h6>
                            Validez votre panier pour découvrir nos options de
                            paiement en plusieurs fois.
                          </h6>
                        </div>
                      </div>
                    </div>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </AccordionTrigger>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
.button:hover .icon {
  color: white;
}
</style>
