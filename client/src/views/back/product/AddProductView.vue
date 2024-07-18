<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import { useProductsStore } from "@/stores/productsStore";
import { ProductSchema } from "@/z-schemas/ProductSchema";

import { useFormHandler } from "@/handlers/useFormHandler"; // import useFormHandler
import { Save } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const productsStore = useProductsStore();

const basicProductInfo = ref({
  product_photo: {
    value: [],
    type: "file",
    placeholder: "Ajouter des photos du produit...",
  },
  product_title: {
    value: "",
    type: "string",
    placeholder: "Saisir le titre du produit..",
  },
  product_url: {
    value: "",
    type: "string",
    placeholder: "Saisir l'URL du produit...",
  },
  product_price: {
    value: "",
    type: "number",
    placeholder: "Saisir le prix du produit......",
  },
  product_minimum_offer_price: {
    value: "",
    type: "number",
    placeholder: "Saisir le prix minimum d'offre...",
  },
  product_category: {
    value: "",
    type: "string",
    placeholder: "Saisir la catégorie du produit...",
  },
  delivery: {
    value: "",
    type: "string",
    placeholder: "Saisir le délai de livraison...",
  },
  product_stock: {
    value: "",
    type: "number",
    placeholder: "Saisir le stock du produit...",
  },
  is_best_seller: {
    value: false,
    type: "boolean",
    placeholder: "Indiquer si meilleure vente...",
  },
});

const productSpecifications = ref({
  brand: { value: "", type: "string", placeholder: "Saisir la marque" },
  itemModelNumber: {
    value: "",
    type: "string",
    placeholder: "Saisir le numéro de modèle...",
  },
  color: { value: "", type: "string", placeholder: "Saisir la couleur..." },
  operatingSystem: {
    value: "",
    type: "string",
    placeholder: "Saisir le système d'exploitation...",
  },
  computerHardwarePlatform: {
    value: "",
    type: "string",
    placeholder: "Saisir la plateforme matérielle...",
  },
  keyboardDescription: {
    value: "",
    type: "string",
    placeholder: "Saisir la description du clavier...",
  },
  processorBrand: {
    value: "",
    type: "string",
    placeholder: "Saisir la marque du processeur...",
  },
  typeOfProcessor: {
    value: "",
    type: "string",
    placeholder: "Saisir le type de processeur...",
  },
  speedOfProcessor: {
    value: "",
    type: "string",
    placeholder: "Saisir la vitesse du processeur...",
  },
  numberOfHearts: {
    value: "",
    type: "string",
    placeholder: "Saisir le nombre de cœurs...",
  },
  sizeRam: {
    value: "",
    type: "string",
    placeholder: "Saisir la taille de la RAM...",
  },
  sizeSsd: {
    value: "",
    type: "string",
    placeholder: "Saisir la taille du SSD...",
  },
  typeOfStorage: {
    value: "",
    type: "string",
    placeholder: "Saisir le type de stockage...",
  },
  sizeScreen: {
    value: "",
    type: "string",
    placeholder: "Saisir la taille de l'écran...",
  },
  gpu: { value: "", type: "string", placeholder: "Saisir le GPU" },
  gpuRam: { value: "", type: "string", placeholder: "Saisir la RAM du GPU..." },
  connectivityType: {
    value: "",
    type: "string",
    placeholder: "Saisir le type de connectivité...",
  },
  wirelessTechnologyType: {
    value: "",
    type: "string",
    placeholder: "Saisir le type de technologie sans fil...",
  },
  computerHardwareInterface: {
    value: "",
    type: "string",
    placeholder: "Saisir l'interface matérielle...",
  },
  connectorType: {
    value: "",
    type: "string",
    placeholder: "Saisir le type de connecteur...",
  },
  softwareIncluded: {
    value: "",
    type: "string",
    placeholder: "Saisir les logiciels inclus...",
  },
  itemDimensionsLxWxH: {
    value: "",
    type: "string",
    placeholder: "Saisir les dimensions de l'article (LxWxH)",
  },
  weight: { value: "", type: "string", placeholder: "Saisir le poids..." },
  resolution: {
    value: "",
    type: "string",
    placeholder: "Saisir la résolution...",
  },
});

const additionalProductDetails = ref({
  series: { value: "", type: "string", placeholder: "Saisir la série..." },
  keyboardAndLanguage: {
    value: "",
    type: "string",
    placeholder: "Saisir le clavier et la langue...",
  },
});

const initialValues = {
  ...basicProductInfo.value,
  ...productSpecifications.value,
  ...additionalProductDetails.value,
};

const { formValues, errors, handleFileChange, handleSubmit } = useFormHandler({
  initialValues,
  schema: ProductSchema,
  redirectRoute: { name: "AdminProducts" },
  onSubmit: async (data) => {
    const files = formValues.value.product_photo.value;
    console.log(files);
    if (files.length > 0) {
      await productsStore.addProductWithImages(data, files);
    } else {
      await productsStore.addProduct(data);
    }
    if (productsStore.imageUploadError) {
      errors.value["product_photo"] = productsStore.imageUploadError;
    }
  },
});

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
      return "Nombre de cœurs";
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
      @click="handleSubmit"
    >
      <Save class="icon w-6 h-6 mr-2 text-primary-200" />
      Enregistrer
    </Button>
  </div>
  <form @submit.prevent="handleSubmit" class="max-w-full flex flex-col mt-6">
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
                <Label :for="key">{{ getLabel(key) }}</Label>
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
                  @change="(event) => handleFileChange(key, event)"
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

      <Card class="w-1/2">
        <CardHeader class="p-2">
          <CardTitle class="text-text-100 font-medium text-md mb-4"
            >Spécifications techniques</CardTitle
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
  </form>
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
