<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input/Input.vue";
import Label from "@/components/ui/label/Label.vue";
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
import { useStockStore } from "@/stores/stockStore";
import { Save } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";
import {AddStockSchema} from "@/z-schemas/StockShema";

const router = useRouter();
const stockStore = useStockStore();

type FieldType = "string" | "number" | "select";

interface StockField {
  value: string | number;
  type: FieldType;
  placeholder: string;
  options?: string[];
}

const stockInfo = ref<Record<string, StockField>>({  productId: {
    value: "",
    type: "number",
    placeholder: "Entrer un produit ID ...",
  },
  quantity: {
    value: 0,
    type: "number",
    placeholder: "Entrer une quantité ...",
  },
  operationType: {
    value: "ADD",
    type: "select",
    placeholder: "Sélectionner le type d'opération ...",
    options: ["ADD", "REMOVE"],
  },
});

const flattenValues = (obj: Record<string, StockField>) => {
  const result: Record<string, string | number> = {};

  for (const key in obj) {
    result[key] = obj[key].value;
  }
  return result;
};

const { values, errors, isSubmitting, httpError, handleSubmit } = useForm({
  schema: AddStockSchema,
  initialValues: {
    ...flattenValues(stockInfo.value),
  },
  onSubmit: async (values) => {
    values.productId = Number(values.productId);
    await stockStore.createStock(values);
    await router.push({name: "AdminStocks"});
  },
});

const getLabel = (key: string) => {
  switch (key) {
    case "productId":
      return "Produit ID*";
    case "quantity":
      return "Quantité*";
    case "operationType":
      return "Type d'opération*";
    default:
      return key;
  }
};
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Ajouter un stock</span>
      <span class="text-md text-text-200">Remplissez les détails du stock à ajouter.</span>
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
          <CardTitle class="text-text-100 font-medium text-md mb-4">Information stock</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div v-for="(field, key) in stockInfo" :key="key" class="grid gap-2">
              <Label :for="key.toString()">{{ getLabel(key.toString()) }}</Label>
              <Input
                  v-if="field.type === 'number'"
                  :id="key"
                  v-model.number="values[key]"
                  :placeholder="field.placeholder"
                  type="number"
              />
              <Select
                  v-if="field.type === 'select'"
                  v-model="values[key]"
              >
                <SelectTrigger>
                  <SelectValue :placeholder="field.placeholder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Operation Type</SelectLabel>
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
              <span v-if="errors[key]" class="text-red-500 text-sm">{{ errors[key] }}</span>
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
