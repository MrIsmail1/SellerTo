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
import { computed, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const productsStore = useProductsStore();

const basicProductInfo = ref<Product>({
  product_photo: null,
  product_title: "",
  product_price: "",
  product_star_rating: "",
  product_url: "",
  product_minimum_offer_price: "",
  product_category: "",
  is_best_seller: false,
  delivery: "",
  product_stock: "",
});

const productSpecifications = ref<Product>({
  brand: "",
  itemModelNumber: "",
  color: "",
  operatingSystem: "",
  computerHardwarePlatform: "",
  keyboardDescription: "",
  processorBrand: "",
  typeOfProcessor: "",
  speedOfProcessor: "",
  numberOfHearts: "",
  sizeRam: "",
  sizeSsd: "",
  typeOfStorage: "",
  sizeScreen: "",
  gpu: "",
  gpuRam: "",
  connectivityType: "",
  wirelessTechnologyType: "",
  computerHardwareInterface: "",
  connectorType: "",
  softwareIncluded: "",
  itemDimensionsLxWxH: "",
  weight: "",
  resolution: "",
});
const additionalProductDetails = ref<Product>({
  series: "",
  keyboardAndLanguage: "",
});

const file = ref(null);
const errors = ref<Record<string, string>>({});

const fileName = computed(() => file.value?.name);
const fileExtension = computed(() =>
  fileName.value?.substr(fileName.value?.lastIndexOf(".") + 1)
);
const fileMimeType = computed(() => file.value?.type);

const uploadFile = (event) => {
  file.value = event.target.files[0];
};

const save = async () => {
  if (file.value) {
    const reader = new FileReader();
    reader.readAsDataURL(file.value);
    reader.onload = async () => {
      const encodedFile = reader.result?.toString().split(",")[1];

      const data = {
        file: encodedFile,
        fileName: fileName.value,
        fileExtension: fileExtension.value,
        fileMimeType: fileMimeType.value,
      };

      // Attach the uploaded file to basicProductInfo
      basicProductInfo.value.product_photo = data;
    };
  }

  const productData = {
    ...basicProductInfo.value,
    ...additionalProductDetails.value,
    ...productSpecifications.value,
  };

  try {
    // Validate productData against the schema
    ProductSchema.parse(productData);
    // If validation passes, proceed with saving
    /* await productsStore.saveProduct(productData);
      console.log("Product saved successfully!");
      router.push("/products"); */
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      errors.value = {};
      error.errors.forEach((err) => {
        errors.value[err.path[0]] = err.message;
      });
    } else {
      console.error("Error saving product:", error);
    }
  }
};

// Function to format labels in French
const getLabel = (key: string) => {
  switch (key) {
    case "product_title":
      return "Nom du produit";
    case "product_price":
      return "Prix du produit";
    case "product_star_rating":
      return "Évaluation du produit";
    case "product_url":
      return "URL du produit";
    case "product_photo":
      return "Photo du produit";
    case "product_minimum_offer_price":
      return "Prix minimum de l'offre";
    case "product_category":
      return "Catégorie du produit";
    case "is_best_seller":
      return "Meilleure vente";
    case "delivery":
      return "Livraison";
    case "product_stock":
      return "Stock du produit";
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
      <span class="text-xl font-bold text-text-100">Ajouter un produit</span>
      <span class="text-md text-text-200"
        >Remplissez les détails du produit à ajouter.</span
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
                v-for="(value, key) in basicProductInfo"
                :key="key"
                class="grid gap-2"
              >
                <Label :for="key">{{ getLabel(key) }}</Label>
                <Input
                  v-if="typeof value === 'string' && key != 'product_photo'"
                  :id="key"
                  v-model="basicProductInfo[key]"
                />
                <Input
                  v-if="typeof value === 'number'"
                  :id="key"
                  type="number"
                  v-model="basicProductInfo[key]"
                />
                <Checkbox
                  v-if="typeof value === 'boolean'"
                  :id="key"
                  v-model="basicProductInfo[key]"
                />
                <Input
                  v-if="key === 'product_photo'"
                  :id="key"
                  type="file"
                  @change="uploadFile"
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
                v-for="(value, key) in additionalProductDetails"
                :key="key"
                class="grid gap-2"
              >
                <Label :for="key">{{ getLabel(key) }}</Label>
                <Input
                  v-if="typeof value === 'string'"
                  :id="key"
                  v-model="additionalProductDetails[key]"
                />
                <Input
                  v-if="typeof value === 'number'"
                  :id="key"
                  type="number"
                  v-model="additionalProductDetails[key]"
                />
                <Checkbox
                  v-if="typeof value === 'boolean'"
                  :id="key"
                  v-model="additionalProductDetails[key]"
                />
                <span v-if="errors[key]" class="text-red-500 text-sm">
                  {{ errors[key] }}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card class="w-1/2">
        <CardHeader class="p-2">
          <CardTitle class="text-text-100 font-medium text-md mb-4"
            >Spécifications technique</CardTitle
          >
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div
              v-for="(value, key) in productSpecifications"
              :key="key"
              class="grid gap-2"
            >
              <Label :for="key">{{ getLabel(key) }}</Label>
              <Input
                v-if="typeof value === 'string'"
                :id="key"
                v-model="productSpecifications[key]"
              />
              <Input
                v-if="typeof value === 'number'"
                :id="key"
                type="number"
                v-model="productSpecifications[key]"
              />
              <Input
                v-if="typeof value === 'boolean'"
                :id="key"
                type="checkbox"
                v-model="productSpecifications[key]"
              />
              <span v-if="errors[key]" class="text-red-500 text-sm">
                {{ errors[key] }}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </form>
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
