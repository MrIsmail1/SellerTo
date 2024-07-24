<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "@/composables/useForm";
import { useProductsStore } from "@/stores/productsStore";
import { useWidgetsStore } from "@/stores/widgetStore";
import { WidgetSchema } from "@/z-schemas/WidgetSchema";
import { X } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import Button from "../ui/button/Button.vue";
import Label from "../ui/label/Label.vue";

const displayTypes = ["KPI", "Chart"];
const chartTypes = ["Ligne", "Camembert"];
const timeFrames = [
  "-1h",
  "-12h",
  "-1d",
  "-1w",
  "-1m",
  "-3m",
  "-6m",
  "-1y",
  "-3y",
];
const steps = {
  "-1h": ["2 minutes", "5 minutes", "10 minutes", "20 minutes", "30 minutes"],
  "-12h": ["1 heure", "2 heures", "3 heures", "6 heures", "12 heures"],
  "-1d": ["1 heure", "3 heures", "6 heures", "12 heures", "24 heures"],
  "-1w": ["1 jour", "2 jours", "3 jours", "5 jours", "7 jours"],
  "-1m": ["1 jour", "3 jours", "1 semaine", "2 semaines", "4 semaines"],
  "-3m": ["1 semaine", "2 semaines", "3 semaines", "1 mois", "3 mois"],
  "-6m": ["2 semaines", "1 mois", "2 mois", "3 mois", "6 mois"],
  "-1y": ["1 mois", "2 mois", "3 mois", "6 mois", "12 mois"],
  "-3y": ["6 mois", "1 an", "2 ans", "3 ans"],
};
const dataTypes = {
  count_products: "Total produits", // vendu
  ca_product: "Chiffre d'affaire produit",
  count_orders: "Total commandes",
  ca_orders: "Chiffre d'affaire commandes",
  count_users: "Total utilisateurs",
};

const selectedStep = ref(null);
const selectedProduct = ref(null);
const products = ref([]);

const productsStore = useProductsStore();
const widgetsStore = useWidgetsStore();

const initialValues = {
  displayType: displayTypes[0],
  chartType: chartTypes[0],
  timeFrame: timeFrames[0],
  dataType: Object.keys(dataTypes)[0],
  selectedStep: null,
  selectedProduct: null,
};

const emit = defineEmits(["close", "fetchDashboard"]);

const { values, errors, isSubmitting, httpError, handleSubmit, setValues } =
  useForm({
    schema: WidgetSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        if (selectedStep) {
          values.selectedStep = selectedStep.value;
        }
        if (selectedProduct) {
          values.selectedProduct = selectedProduct.value;
        }
        if (values.displayType === "KPI") {
          delete values.chartType;
          delete values.selectedStep;
        }
        await widgetsStore.createWidget(values);
        emit("fetchDashboard");
        emit("close");
      } catch (error) {
        console.error(error);
        httpError.value = error.message || "Une erreur est survenue";
      }
    },
  });

const availableSteps = computed(() => {
  return steps[values.timeFrame.value] || [];
});

onMounted(async () => {
  await productsStore.fetchProducts();
  products.value = productsStore.products;
});
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-8 rounded shadow-lg w-full max-w-md relative">
      <Button
        @click="$emit('close')"
        class="absolute bg-transparent top-2 right-2 cursor-pointer hover:bg-transparent"
      >
        <X class="w-5 h-5 text-text-200 hover:text-primary-100" />
      </Button>
      <div>
        <h2 class="text-2xl font-bold mb-4">Ajouter un Widget</h2>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div>
            <Label
              for="displayType"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Type d'affichage</Label
            >
            <Select v-model="values.displayType.value">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Types d'affichage</SelectLabel>
                  <SelectItem
                    v-for="type in displayTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.displayType" class="text-red-500 text-xs mt-1">
              {{ errors.displayType }}
            </p>
          </div>

          <div v-if="values.displayType.value === 'Chart'">
            <Label
              for="chartType"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Type de Graphique</Label
            >
            <Select v-model="values.chartType.value">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Types de Graphique</SelectLabel>
                  <SelectItem
                    v-for="type in chartTypes"
                    :key="type"
                    :value="type"
                  >
                    {{ type }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.chartType" class="text-red-500 text-xs mt-1">
              {{ errors.chartType }}
            </p>
          </div>

          <div>
            <Label
              for="timeFrame"
              class="block text-sm font-medium text-gray-700"
              >Période</Label
            >
            <Select v-model="values.timeFrame.value">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Période</SelectLabel>
                  <SelectItem
                    v-for="frame in timeFrames"
                    :key="frame"
                    :value="frame"
                  >
                    {{ frame }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.timeFrame" class="text-red-500 text-xs mt-1">
              {{ errors.timeFrame }}
            </p>
          </div>

          <div
            v-if="
              availableSteps.length > 0 && values.displayType.value === 'Chart'
            "
          >
            <Label for="step" class="block text-sm font-medium text-gray-700"
              >Intervalle</Label
            >
            <Select v-model="selectedStep">
              <SelectTrigger>
                <SelectValue placeholder="Choisir un intervalle..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Intervalle</SelectLabel>
                  <SelectItem
                    v-for="step in availableSteps"
                    :key="step"
                    :value="step"
                  >
                    {{ step }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.selectedStep" class="text-red-500 text-xs mt-1">
              {{ errors.selectedStep }}
            </p>
          </div>

          <div>
            <Label
              for="dataType"
              class="block text-sm font-medium text-gray-700"
              >Données à utiliser</Label
            >
            <Select v-model="values.dataType.value">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem
                    v-for="(label, key) in dataTypes"
                    :key="key"
                    :value="key"
                  >
                    {{ label }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.dataType" class="text-red-500 text-xs mt-1">
              {{ errors.dataType }}
            </p>
          </div>

          <div v-if="values.dataType.value === 'ca_product'">
            <Label
              for="selectedProduct"
              class="block text-sm font-medium text-gray-700 mb-1"
              >Produit</Label
            >
            <Select v-model="selectedProduct">
              <SelectTrigger>
                <SelectValue placeholder="Choisir un produit..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="product in products"
                    :key="product._id"
                    :value="product._id.toString()"
                  >
                    {{ product.product_title }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.selectedProduct" class="text-red-500 text-xs mt-1">
              {{ errors.selectedProduct.message }}
            </p>
          </div>

          <div class="flex justify-end space-x-4 mt-4">
            <Button
              @click="$emit('close')"
              class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white hover:border-primary-200"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              :disabled="isSubmitting"
              class="button bg-transparent border text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
            >
              Valider
            </Button>
          </div>
          <p v-if="httpError" class="text-red-500 text-xs mt-2">
            {{ httpError }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
