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
import { useOrdersStore } from "@/stores/orderStore";
import { useProductsStore } from "@/stores/productsStore";
import { WidgetSchema } from "@/z-schemas/WidgetSchema";
import { X } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import Button from "../ui/button/Button.vue";

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
const dataTypes = [
  "Nombre de commandes",
  "Meilleur ventes",
  "Revenue totales",
  "Nouveaux clients",
  "Stock",
];
const displayModes = ["Carte", "Graphique simple"];

const orderStore = useOrdersStore();
const productsStore = useProductsStore();

const initialValues = {
  chartType: chartTypes[0],
  timeFrame: timeFrames[0],
  dataType: dataTypes[0],
  displayMode: displayModes[0],
};

const bestSalesOption = ref({});
const selectedProductOrCategory = ref({});

const emit = defineEmits(["close", "chartDataFetched"]);

const { values, errors, isSubmitting, httpError, handleSubmit, setValues } =
  useForm({
    schema: WidgetSchema,
    initialValues,
    onSubmit: async (values) => {
      try {
        if (bestSalesOption.value) {
          values.bestSalesOption = bestSalesOption.value;
        }
        if (selectedProductOrCategory.value) {
          values.selectedProductOrCategory = selectedProductOrCategory.value;
        }
        await orderStore.getDashboardData(values);
        const data = orderStore.dashboardData;
        console.log(data);
        emit("chartDataFetched", { values });
        emit("close");
      } catch (error) {
        console.error(error);
        httpError.value = error.message || "Une erreur est survenue";
      }
    },
  });

const products = ref([]);
const categories = computed(() => {
  const uniqueCategories = new Set(
    products.value.map((product) => product.product_category)
  );
  return Array.from(uniqueCategories);
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
            <label
              for="chartType"
              class="block text-sm font-medium text-gray-700"
              >Type de Graphique</label
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

          <div v-if="values.chartType.value === 'Ligne'">
            <label
              for="displayMode"
              class="block text-sm font-medium text-gray-700"
              >Mode d'affichage</label
            >
            <Select v-model="values.displayMode.value">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Modes d'affichage</SelectLabel>
                  <SelectItem
                    v-for="mode in displayModes"
                    :key="mode"
                    :value="mode"
                  >
                    {{ mode }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.displayMode" class="text-red-500 text-xs mt-1">
              {{ errors.displayMode }}
            </p>
          </div>

          <div>
            <label
              for="timeFrame"
              class="block text-sm font-medium text-gray-700"
              >Période</label
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

          <div>
            <label
              for="dataType"
              class="block text-sm font-medium text-gray-700"
              >Données à Utiliser</label
            >
            <Select v-model="values.dataType.value">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Données</SelectLabel>
                  <SelectItem
                    v-for="data in dataTypes"
                    :key="data"
                    :value="data"
                  >
                    {{ data }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.dataType" class="text-red-500 text-xs mt-1">
              {{ errors.dataType }}
            </p>
          </div>

          <div v-if="values.dataType.value === 'Meilleur ventes'">
            <label
              for="bestSalesOption"
              class="block text-sm font-medium text-gray-700"
              >Sélectionnez une option</label
            >
            <Select v-model="bestSalesOption.value">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Options</SelectLabel>
                  <SelectItem value="product">Produit</SelectItem>
                  <SelectItem value="category">Catégorie</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p v-if="errors.bestSalesOption" class="text-red-500 text-xs mt-1">
              {{ errors.bestSalesOption }}
            </p>
          </div>

          <div
            v-if="
              bestSalesOption.value === 'product' &&
              values.dataType.value === 'Meilleur ventes'
            "
          >
            <label
              for="selectedProduct"
              class="block text-sm font-medium text-gray-700"
              >Sélectionnez un produit</label
            >
            <Select v-model="selectedProductOrCategory.value">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Produits</SelectLabel>
                  <SelectItem
                    v-for="product in products"
                    :key="product._id"
                    :value="product._id"
                  >
                    {{ product.product_title }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p
              v-if="errors.selectedProductOrCategory"
              class="text-red-500 text-xs mt-1"
            >
              {{ errors.selectedProductOrCategory }}
            </p>
          </div>

          <div
            v-if="
              bestSalesOption.value === 'category' &&
              values.dataType.value === 'Meilleur ventes'
            "
          >
            <label
              for="selectedCategory"
              class="block text-sm font-medium text-gray-700"
              >Sélectionnez une catégorie</label
            >
            <Select v-model="selectedProductOrCategory.value">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Catégories</SelectLabel>
                  <SelectItem
                    v-for="category in categories"
                    :key="category"
                    :value="category"
                  >
                    {{ category }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p
              v-if="errors.selectedProductOrCategory"
              class="text-red-500 text-xs mt-1"
            >
              {{ errors.selectedProductOrCategory }}
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
