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
import { usePromoCodeStore } from "@/stores/promoCodeStore";
import { Save } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import {EditPromoCodeSchema} from "@/z-schemas/PromoCodeSchema";

const router = useRouter();
const route = useRoute();
const promoCodeStore = usePromoCodeStore();
const promoCodeId = route.params.id as string;

type FieldType = "string" | "number" | "select";

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
    placeholder: "Entrer votre code promo ...",
  },
  discount: {
    value: 0,
    type: "number",
    placeholder: "Entrer un pourcentage de réduction ...",
  },
  expiry_date: {
    value: "",
    type: "string",
    placeholder: "Entrer une date d'expiration ...",
  },
  product_id: {
    value: "",
    type: "number",
    placeholder: "Entrer un produit id ...",
  },
  category: {
    value: "",
    type: "string",
    placeholder: "Entrer une catégorie ...",
  },
});

const flattenValues = (obj: Record<string, PromoCodeField>) => {
  const result: Record<string, string | number> = {};

  for (const key in obj) {
    result[key] = obj[key].value;
  }
  return result;
};

const { values, errors, isSubmitting, httpError, handleSubmit, setValues } =
    useForm({
      schema: EditPromoCodeSchema,
      initialValues: {
        ...flattenValues(promoCodeInfo.value),
      },
      onSubmit: async (values) => {
        values.product_id = Number(values.product_id);
        await promoCodeStore.updatePromoCode(promoCodeId, values);
        if (!promoCodeStore.error) {
          await router.push({name: "AdminPromoCodes"});
        }
      },
    });

const fetchPromoCode = async () => {
  await promoCodeStore.findPromoCodeById(promoCodeId);
  const promoCode = promoCodeStore.promoCode;
  for (const key in promoCodeInfo.value) {
    if (promoCode.hasOwnProperty(key)) {
      promoCodeInfo.value[key].value = promoCode[key];
    }
  }
  setValues(flattenValues(promoCodeInfo.value));
};

onMounted(fetchPromoCode);

const getLabel = (key: string) => {
  switch (key) {
    case "code":
      return "Code promo*";
    case "discount":
      return "Réduction en pourcentage*";
    case "expiry_date":
      return "Date d'expiration*";
    case "product_id":
      return "Produit ID";
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
      <span class="text-xl font-bold text-text-100">Modifier un code promo</span>
      <span class="text-md text-text-200">Modifier les détails du code promo</span>
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
          <CardTitle class="text-text-100 font-medium text-md mb-4">Information Promo Code </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div v-for="(field, key) in promoCodeInfo" :key="key" class="grid gap-2">
              <Label :for="key.toString()">{{ getLabel(key.toString()) }}</Label>
              <Input
                  v-if="field.type === 'string'"
                  :id="key"
                  v-model="values[key]"
                  :placeholder="field.placeholder"
                  type="text"
              />
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
                  <SelectValue :placeholder="field.placeholder">{{ values[key].value }}</SelectValue>
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
