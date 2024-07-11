<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import { useProductsStore } from "@/stores/productsStore";
import type { Product } from "@/z-schemas/ProductSchema";
import { ProductSchema } from "@/z-schemas/ProductSchema";
import { z } from "zod";

import { Save } from "lucide-vue-next";
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"; // Assume these components exist

const router = useRouter();
const route = useRoute();
const productsStore = useProductsStore();

const productId = route.params.id;

const productDetails = ref<Product | null>(null);
const basicProductInfo = ref<Record<string, ProductField>>({});
const productSpecifications = ref<Record<string, ProductField>>({});
const additionalProductDetails = ref<Record<string, ProductField>>({});
const errors = ref<Record<string, string>>({});
const files = ref<File[]>([]);
const emblaMainApi = ref(null);
const emblaThumbnailApi = ref(null);
const selectedIndex = ref(0);

type FieldType = "string" | "number" | "boolean" | "file";

interface ProductField {
  value: string | number | boolean | File[];
  type: FieldType;
  placeholder: string;
}

const initializeFormFields = (product: Product) => {
  basicProductInfo.value = {
    product_photo: {
      value: [],
      type: "file",
      placeholder: "Ajouter des photos du produit...",
    },
    product_title: {
      value: product.product_title || "",
      type: "string",
      placeholder: "Saisir le titre du produit..",
    },
    product_url: {
      value: product.product_url || "",
      type: "string",
      placeholder: "Saisir l'URL du produit...",
    },
    product_price: {
      value: product.product_price || "",
      type: "number",
      placeholder: "Saisir le prix du produit......",
    },
    product_minimum_offer_price: {
      value: product.product_minimum_offer_price || "",
      type: "number",
      placeholder: "Saisir le prix minimum d'offre...",
    },
    product_category: {
      value: product.product_category || "",
      type: "string",
      placeholder: "Saisir la catégorie du produit...",
    },
    delivery: {
      value: product.delivery || "",
      type: "string",
      placeholder: "Saisir le délai de livraison...",
    },
    product_stock: {
      value: product.product_stock || "",
      type: "number",
      placeholder: "Saisir le stock du produit...",
    },
    is_best_seller: {
      value: product.is_best_seller || false,
      type: "boolean",
      placeholder: "Indiquer si meilleure vente...",
    },
  };

  productSpecifications.value = {
    brand: {
      value: product.brand || "",
      type: "string",
      placeholder: "Saisir la marque",
    },
    itemModelNumber: {
      value: product.itemModelNumber || "",
      type: "string",
      placeholder: "Saisir le numéro de modèle...",
    },
    color: {
      value: product.color || "",
      type: "string",
      placeholder: "Saisir la couleur...",
    },
    operatingSystem: {
      value: product.operatingSystem || "",
      type: "string",
      placeholder: "Saisir le système d'exploitation...",
    },
    computerHardwarePlatform: {
      value: product.computerHardwarePlatform || "",
      type: "string",
      placeholder: "Saisir la plateforme matérielle...",
    },
    keyboardDescription: {
      value: product.keyboardDescription || "",
      type: "string",
      placeholder: "Saisir la description du clavier...",
    },
    processorBrand: {
      value: product.processorBrand || "",
      type: "string",
      placeholder: "Saisir la marque du processeur...",
    },
    typeOfProcessor: {
      value: product.typeOfProcessor || "",
      type: "string",
      placeholder: "Saisir le type de processeur...",
    },
    speedOfProcessor: {
      value: product.speedOfProcessor || "",
      type: "string",
      placeholder: "Saisir la vitesse du processeur...",
    },
    numberOfHearts: {
      value: product.numberOfHearts || "",
      type: "string",
      placeholder: "Saisir le nombre de cœurs...",
    },
    sizeRam: {
      value: product.sizeRam || "",
      type: "string",
      placeholder: "Saisir la taille de la RAM...",
    },
    sizeSsd: {
      value: product.sizeSsd || "",
      type: "string",
      placeholder: "Saisir la taille du SSD...",
    },
    typeOfStorage: {
      value: product.typeOfStorage || "",
      type: "string",
      placeholder: "Saisir le type de stockage...",
    },
    sizeScreen: {
      value: product.sizeScreen || "",
      type: "string",
      placeholder: "Saisir la taille de l'écran...",
    },
    gpu: {
      value: product.gpu || "",
      type: "string",
      placeholder: "Saisir le GPU",
    },
    gpuRam: {
      value: product.gpuRam || "",
      type: "string",
      placeholder: "Saisir la RAM du GPU...",
    },
    connectivityType: {
      value: product.connectivityType || "",
      type: "string",
      placeholder: "Saisir le type de connectivité...",
    },
    wirelessTechnologyType: {
      value: product.wirelessTechnologyType || "",
      type: "string",
      placeholder: "Saisir le type de technologie sans fil...",
    },
    computerHardwareInterface: {
      value: product.computerHardwareInterface || "",
      type: "string",
      placeholder: "Saisir l'interface matérielle...",
    },
    connectorType: {
      value: product.connectorType || "",
      type: "string",
      placeholder: "Saisir le type de connecteur...",
    },
    softwareIncluded: {
      value: product.softwareIncluded || "",
      type: "string",
      placeholder: "Saisir les logiciels inclus...",
    },
    itemDimensionsLxWxH: {
      value: product.itemDimensionsLxWxH || "",
      type: "string",
      placeholder: "Saisir les dimensions de l'article (LxWxH)",
    },
    weight: {
      value: product.weight || "",
      type: "string",
      placeholder: "Saisir le poids...",
    },
    resolution: {
      value: product.resolution || "",
      type: "string",
      placeholder: "Saisir la résolution...",
    },
  };

  additionalProductDetails.value = {
    series: {
      value: product.series || "",
      type: "string",
      placeholder: "Saisir la série...",
    },
    keyboardAndLanguage: {
      value: product.keyboardAndLanguage || "",
      type: "string",
      placeholder: "Saisir le clavier et la langue...",
    },
  };
};

onMounted(async () => {
  await productsStore.getProductById(productId);
  const product = productsStore.product;
  productDetails.value = product;
  initializeFormFields(product);
});

const handleFileChange = (event) => {
  files.value = Array.from(event.target.files);
};

const onThumbClick = (index: number) => {
  if (emblaMainApi.value) {
    emblaMainApi.value.scrollTo(index);
    selectedIndex.value = index;
  }
};

const deleteImage = async (imageUrl: string) => {
  await productsStore.deleteProductImage(productId, imageUrl);
  const product = await productsStore.fetchProductById(productId);
  productDetails.value = product;
};

const save = async () => {
  try {
    const productData = {
      product_title: basicProductInfo.value.product_title.value,
      product_url: basicProductInfo.value.product_url.value,
      product_price: basicProductInfo.value.product_price.value,
      product_minimum_offer_price:
        basicProductInfo.value.product_minimum_offer_price.value,
      product_category: basicProductInfo.value.product_category.value,
      delivery: basicProductInfo.value.delivery.value,
      product_stock: basicProductInfo.value.product_stock.value,
      is_best_seller: basicProductInfo.value.is_best_seller.value,
      ...Object.fromEntries(
        Object.entries(productSpecifications.value).map(([key, field]) => [
          key,
          field.value,
        ])
      ),
      ...Object.fromEntries(
        Object.entries(additionalProductDetails.value).map(([key, field]) => [
          key,
          field.value,
        ])
      ),
    };

    // Validate productData against the schema
    ProductSchema.parse(productData);

    if (files.value.length > 0) {
      await productsStore.updateProductWithImages(
        productId,
        productData,
        files.value
      );
    } else {
      await productsStore.updateProduct(productId, productData);
    }
    if (productsStore.imageUploadError) {
      errors.value["product_photo"] = productsStore.imageUploadError;
    }
    router.push({ name: "AdminProducts" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      errors.value = {};
      error.errors.forEach((err) => {
        errors.value[err.path[0]] = err.message;
      });
    }
  }
};

// Function to format labels in French
const getLabel = (key: string) => {
  switch (key) {
    case "product_title":
      return "Nom du produit*";
    case "product_price":
      return "Prix du produit*";
    case "product_star_rating":
      return "Évaluation du produit";
    case "product_url":
      return "URL du produit";
    case "product_photo":
      return "Photo du produit*";
    case "product_minimum_offer_price":
      return "Prix minimum de l'offre*";
    case "product_category":
      return "Catégorie du produit*";
    case "is_best_seller":
      return "Meilleure vente";
    case "delivery":
      return "Livraison*";
    case "product_stock":
      return "Stock du produit*";
    case "brand":
      return "Marque";
    case "itemModelNumber":
      return "Numéro de modèle";
    case "color":
      return "Couleur";
    case "operatingSystem":
      return "Système d'exploitation";
    case "computerHardwarePlatform":
      return "Plateforme matériel informatique";
    case "keyboardDescription":
      return "Description du clavier";
    case "processorBrand":
      return "Marque du processeur";
    case "typeOfProcessor":
      return "Type de processeur";
    case "speedOfProcessor":
      return "Vitesse du processeur";
    case "numberOfHearts":
      return "Nombre de coeurs";
    case "sizeRam":
      return "Taille RAM";
    case "sizeSsd":
      return "Taille SSD";
    case "typeOfStorage":
      return "Type de stockage";
    case "sizeScreen":
      return "Taille de l'écran";
    case "gpu":
      return "GPU";
    case "gpuRam":
      return "RAM du GPU";
    case "connectivityType":
      return "Type de connectivité";
    case "wirelessTechnologyType":
      return "Type de technologie sans fil";
    case "computerHardwareInterface":
      return "Interface matériel informatique";
    case "connectorType":
      return "Type de connecteur";
    case "softwareIncluded":
      return "Logiciel inclus";
    case "itemDimensionsLxWxH":
      return "Dimensions L x l x H";
    case "weight":
      return "Poids";
    case "resolution":
      return "Résolution";
    case "series":
      return "Série";
    case "keyboardAndLanguage":
      return "Clavier et langue";
    default:
      return key; // fallback to key name if no specific label found
  }
};
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Modifier un produit</span>
      <span class="text-md text-text-200"
        >Modifiez les détails du produit.</span
      >
    </span>
    <Button
      class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
      @click="save"
    >
      <Save class="icon w-6 h-6 mr-2 text-primary-200" />
      Enregistrer
    </Button>
  </div>

  <form @submit.prevent="save" class="max-w-full flex flex-col mt-6">
    <div class="flex w-full gap-x-2">
      <div class="flex flex-col w-1/2 gap-y-2">
        <Card class="h-fit p-3">
          <CardHeader class="p-2">
            <CardTitle class="text-text-100 font-medium text-md mb-4"
              >Informations de base</CardTitle
            >
          </CardHeader>
          <CardContent>
            <div class="grid gap-4">
              <div
                v-for="(field, key) in basicProductInfo"
                :key="key"
                class="grid gap-2"
              >
                <Label :for="key.toString()">{{
                  getLabel(key.toString())
                }}</Label>
                <Input
                  v-if="field.type === 'string'"
                  :id="key"
                  v-model="field.value"
                  :placeholder="field.placeholder"
                  type="text"
                />
                <Input
                  v-if="field.type === 'number'"
                  :id="key"
                  v-model.number="field.value"
                  :placeholder="field.placeholder"
                  type="number"
                />
                <Checkbox
                  v-if="field.type === 'boolean'"
                  :id="key.toString()"
                  v-model="field.value"
                />
                <Input
                  v-if="key === 'product_photo'"
                  :id="key"
                  type="file"
                  multiple
                  :placeholder="field.placeholder"
                  @change="handleFileChange($event)"
                />
                <span v-if="errors[key]" class="text-red-500 text-sm">
                  {{ errors[key] }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card class="p-4">
          <CardHeader class="p-2">
            <CardTitle class="text-text-100 font-medium text-md mb-4"
              >Informations complémentaires</CardTitle
            >
          </CardHeader>
          <CardContent>
            <div class="grid gap-4">
              <div
                v-for="(field, key) in additionalProductDetails"
                :key="key"
                class="grid gap-2"
              >
                <Label :for="key.toString()">{{
                  getLabel(key.toString())
                }}</Label>
                <Input
                  v-if="field.type === 'string'"
                  :id="key"
                  v-model="field.value"
                  :placeholder="field.placeholder"
                  type="text"
                />
                <Input
                  v-if="field.type === 'number'"
                  :id="key"
                  v-model.number="field.value"
                  :placeholder="field.placeholder"
                  type="number"
                />
                <Checkbox
                  v-if="field.type === 'boolean'"
                  :id="key.toString()"
                  v-model="field.value"
                />
                <span v-if="errors[key]" class="text-red-500 text-sm">
                  {{ errors[key] }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div class="w-full md:w-1/2">
        <Card class="h-fit p-3">
          <CardHeader class="p-2">
            <CardTitle class="text-text-100 font-medium text-md mb-4">
              Photos du produit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div v-if="productDetails" class="flex justify-center mt-3">
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
                        <button
                          @click="deleteImage(photo)"
                          class="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                        >
                          ✕
                        </button>
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
            </div>
          </CardContent>
        </Card>
        <Card class="mt-4">
          <CardHeader class="p-2">
            <CardTitle class="text-text-100 font-medium text-md mb-4"
              >Spécifications technique</CardTitle
            >
          </CardHeader>
          <CardContent>
            <div class="grid gap-4">
              <div
                v-for="(field, key) in productSpecifications"
                :key="key"
                class="grid gap-2"
              >
                <Label :for="key.toString()">{{
                  getLabel(key.toString())
                }}</Label>
                <Input
                  v-if="field.type === 'string'"
                  :id="key"
                  v-model="field.value"
                  :placeholder="field.placeholder"
                  type="text"
                />
                <Input
                  v-if="field.type === 'number'"
                  :id="key"
                  v-model.number="field.value"
                  type="number"
                  :placeholder="field.placeholder"
                />
                <Checkbox
                  v-if="field.type === 'boolean'"
                  :id="key.toString()"
                  v-model="field.value"
                />
                <span v-if="errors[key]" class="text-red-500 text-sm">
                  {{ errors[key] }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </form>
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
