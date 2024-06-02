<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useProductsStore } from '@/stores/productsStore';
import { debounce } from 'lodash';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  filteredProducts: {
    type: Array,
    required: true
  }
});

const productStore = useProductsStore();
const route = useRoute();
const router = useRouter();

const filters = {
  series: 'Séries',
  sizeSsd: 'Taille du disque dur',
  sizeRam: 'Taille de la mémoire vive',
  sizeScreen: 'Taille de l\'écran',
  typeOfProcessor: 'Type de processeur',
  speedOfProcessor: 'Vitesse du processeur',
  typeOfStorage: 'Technologie du disque dur',
  color: 'Couleur',
  resolution: 'Résolution',
  gpu: 'GPU',
  weight: 'Poids du produit',
  keyboardAndLanguage: 'Langue du clavier'
};

const customTitles = {
  series: 'Modèle',
  sizeSsd: 'Capacité de stockage (Go)',
  sizeRam: 'Mémoire Vive (Go)',
  sizeScreen: 'Taille d\'écran',
  typeOfProcessor: 'Type du processeur',
  speedOfProcessor: 'Vitesse du processeur (GHz)',
  typeOfStorage: 'Type de stockage',
  color: 'Couleur',
  resolution: 'Résolution',
  gpu: 'GPU',
  weight: 'Poids du produit (kg)',
  keyboardAndLanguage: 'Langue du clavier'
};

const availableFilters = computed(() => {
  const result = {};
  for (const [filterKey, field] of Object.entries(filters)) {
    result[filterKey] = ['Peu importe', ...new Set(
        props.filteredProducts
            .map(product => product.product_information?.[field])
            .filter(value => value !== undefined)
    )];
  }
  return result;
});

const minPrice = ref(0);
const maxPrice = ref(2000);

const updatePriceFilter = () => {
  productStore.filters.minPrice = minPrice.value;
  productStore.filters.maxPrice = maxPrice.value;
  updateURLWithFilters();
  debouncedFetchFilteredProducts();
};

const isChecked = (filterType, value) => {
  return productStore.filters[filterType].includes(value) || (value === 'Peu importe' && productStore.filters[filterType].length === 0);
};

const isDisabled = (filterType, value) => {
  return value === 'Peu importe';
};

const updateFilter = (filterType, value) => {
  if (value !== 'Peu importe') {
    if (productStore.filters[filterType].includes(value)) {
      productStore.filters[filterType] = productStore.filters[filterType].filter(v => v !== value);
    } else {
      productStore.filters[filterType].push(value);
    }
  } else {
    productStore.filters[filterType] = [];
  }

  updateURLWithFilters();
  debouncedFetchFilteredProducts();
};

const updateURLWithFilters = () => {
  const query = {...route.query};

  Object.keys(productStore.filters).forEach(filterKey => {
    if (productStore.filters[filterKey].length > 0) {
      query[filterKey] = productStore.filters[filterKey].map(value => encodeURIComponent(value)).join(',');
    } else {
      delete query[filterKey];
    }
  });

  query.minPrice = minPrice.value;
  query.maxPrice = maxPrice.value;

  router.push({query}).catch(err => {});
};

const debouncedFetchFilteredProducts = debounce(() => {
  if (route.query.query) {
    productStore.searchProductByTitleOrDescription(route.query.query);
  } else {
    productStore.fetchFilteredProducts();
  }
}, 300);

watch(() => productStore.filters, (newFilters) => {
  debouncedFetchFilteredProducts();
}, {deep: true});

onMounted(() => {
  if (route.query.minPrice) minPrice.value = route.query.minPrice;
  if (route.query.maxPrice) maxPrice.value = route.query.maxPrice;
});
</script>

<template>
  <div>
    <!-- Filtre de prix -->
    <div class="filter-section">
      <h3>Prix</h3>
      <div class="slider-container">
        <input
            type="range"
            min="0"
            max="2000"
            v-model="minPrice"
            @input="updatePriceFilter"
        />
        <input
            type="range"
            min="0"
            max="2000"
            v-model="maxPrice"
            @input="updatePriceFilter"
        />
        <div>
          Min: {{ minPrice }} €
        </div>
        <div>
          Max: {{ maxPrice }} €
        </div>
      </div>
    </div>
    <!-- Autres filtres -->
    <div v-for="(options, filterKey) in availableFilters" :key="filterKey" class="filter-section">
      <h3>{{ customTitles[filterKey] }}</h3>
      <div v-for="option in options" :key="option" class="filter-option">
        <label :class="{ disabled: isDisabled(filterKey, option) }">
          <input
              type="checkbox"
              :value="option"
              @change="updateFilter(filterKey, option)"
              :checked="isChecked(filterKey, option)"
              :disabled="isDisabled(filterKey, option)"
          />
          {{ option }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slider-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

input[type="range"] {
  width: 80%;
  margin: 10px 0;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-option {
  margin-bottom: 5px;
}

label {
  cursor: pointer;
}

input[type="checkbox"] {
  margin-right: 10px;
}

input[type="checkbox"]:disabled + label {
  color: #888;
}

.disabled {
  color: #888;
}
</style>
