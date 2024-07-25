<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { usePromoCodeStore } from "@/stores/promoCodeStore";
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
} from "@internationalized/date";
import { Calendar as CalendarIcon } from "lucide-vue-next";

import { cn } from "@/lib/utils";
import { AddPromoCodeSchema } from "@/z-schemas/PromoCodeSchema";
import { Save } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const promoCodeStore = usePromoCodeStore();
const productStore = useProductsStore();
const products = ref([]);
const categories = ref<string[]>([]);
const selectedType = ref({});

type FieldType = "string" | "number" | "select" | "date";

interface PromoCodeField {
  value: string | number;
  type: FieldType;
  placeholder: string;
  options?: string[];
}

const promoCodeInfo = ref<Record<string, PromoCodeField>>({
  code: {
    value: "",
    type: "string",
    placeholder: "Entrer votre code promo...",
  },
  discount: {
    value: 0,
    type: "number",
    placeholder: "Entrer un pourcentage de réduction...",
  },
  expiry_date: {
    value: "",
    type: "date",
    placeholder: "Entrer une date d'expiration...",
  },
  product_id: {
    value: "",
    type: "select",
    placeholder: "Choisir un produit...",
  },
  category: {
    value: "",
    type: "select",
    placeholder: "Choisir une catégorie...",
    options: [],
  },
});

const df = new DateFormatter("fr-FR", {
  dateStyle: "short",
});

const flattenValues = (obj: Record<string, PromoCodeField>) => {
  const result: Record<string, string | number> = {};

  for (const key in obj) {
    result[key] = obj[key].value;
  }
  return result;
};

onMounted(async () => {
  await productStore.fetchProducts();
  products.value = productStore.products.map((product) => ({
    value: product._id,
    label: product.product_title,
  }));

  // Extract unique categories
  const categorySet = new Set(
    productStore.products.map((product) => product.product_category)
  );
  categories.value = Array.from(categorySet);

  promoCodeInfo.value.category.options = categories.value;
});

const { values, errors, isSubmitting, httpError, handleSubmit } = useForm({
  schema: AddPromoCodeSchema,
  initialValues: {
    ...flattenValues(promoCodeInfo.value),
  },
  onSubmit: async (values) => {
    await promoCodeStore.createPromoCode(values);
    router.push({ name: "AdminPromoCodes" });
  },
});

const getLabel = (key: string) => {
  switch (key) {
    case "code":
      return "Code promo*";
    case "discount":
      return "Réduction en pourcentage*";
    case "expiry_date":
      return "Date d'expiration*";
    case "product_id":
      return "Produit";
    case "category":
      return "Catégorie";
    default:
      return key;
  }
};
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Ajouter un code promo</span>
      <span class="text-md text-text-200"
        >Remplissez les détails du code promo à ajouter.</span
      >
    </span>
    <Button
      class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
      @click="handleSubmit"
      :disabled="isSubmitting"
    >
      <Save class="icon w-6 h-6 mr-2 text-primary-200" />
      Enregistrer
    </Button>
  </div>
  <form @submit.prevent="handleSubmit" class="max-w-full flex flex-col mt-6">
    <div class="flex w-full gap-x-2">
      <Card class="w-full p-4">
        <CardHeader class="p-2">
          <CardTitle class="text-text-100 font-medium text-md mb-4"
            >Information Code Promo</CardTitle
          >
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div>
              <Select v-model="selectedType.value">
                <SelectTrigger>
                  <SelectValue placeholder="Appliquer sur..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Options</SelectLabel>
                    <SelectItem value="product">Produit</SelectItem>
                    <SelectItem value="category">Catégorie</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div
              v-for="(field, key) in promoCodeInfo"
              :key="key"
              class="grid gap-2"
            >
              <template v-if="key !== 'product_id' && key !== 'category'">
                <Label :for="key.toString()">{{
                  getLabel(key.toString())
                }}</Label>
                <Input
                  v-if="field.type === 'string'"
                  :id="key"
                  v-model="values[key].value"
                  :placeholder="field.placeholder"
                  type="text"
                />
                <Input
                  v-if="field.type === 'number'"
                  :id="key"
                  v-model.number="values[key].value"
                  :placeholder="field.placeholder"
                  type="number"
                />
                <Popover v-if="field.type == 'date'">
                  <PopoverTrigger as-child>
                    <Button
                      variant="outline"
                      :class="
                        cn(
                          'w-full justify-start text-left font-normal bg-transparent border',
                          !values[key].value && 'text-muted-foreground'
                        )
                      "
                    >
                      <CalendarIcon class="mr-2 h-4 w-4" />
                      {{
                        values[key].value
                          ? df.format(
                              values[key].value.toDate(getLocalTimeZone())
                            )
                          : field.placeholder
                      }}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent class="w-auto p-0">
                    <Calendar v-model="values[key].value" initial-focus />
                  </PopoverContent>
                </Popover>
              </template>
              <template
                v-if="key === 'product_id' && selectedType.value === 'product'"
              >
                <Label :for="key.toString()">{{
                  getLabel(key.toString())
                }}</Label>
                <Select v-model="values[key].value">
                  <SelectTrigger>
                    <SelectValue :placeholder="field.placeholder"></SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Options</SelectLabel>
                      <SelectItem
                        v-for="option in products"
                        :key="option.value"
                        :value="option.value.toString()"
                      >
                        {{ option.label }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </template>
              <template
                v-if="key === 'category' && selectedType.value === 'category'"
              >
                <Label :for="key.toString()">{{
                  getLabel(key.toString())
                }}</Label>
                <Select v-model="values[key].value">
                  <SelectTrigger>
                    <SelectValue :placeholder="field.placeholder" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Options</SelectLabel>
                      <SelectItem
                        v-for="option in field.options"
                        :key="option"
                        :value="option"
                      >
                        {{ option }}
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </template>
              <span v-if="errors[key]" class="text-red-500 text-sm">{{
                errors[key]
              }}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    <span v-if="httpError" class="text-red-500 text-sm">{{ httpError }}</span>
  </form>
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
