<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Checkbox from "@/components/ui/checkbox/Checkbox.vue";
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
import { useUsersStore } from "@/stores/userStore";
import { AddUserSchema } from "@/z-schemas/UserSchema";
import { Save } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { z } from "zod";

const router = useRouter();
const usersStore = useUsersStore();

type FieldType = "string" | "number" | "boolean" | "select";

interface UserField {
  value: string | number | boolean;
  type: FieldType;
  placeholder: string;
  options?: string[];
}

const userInfo = ref<Record<string, UserField>>({
  firstname: {
    value: "",
    type: "string",
    placeholder: "Saisir le prénom...",
  },
  lastname: {
    value: "",
    type: "string",
    placeholder: "Saisir le nom...",
  },
  email: {
    value: "",
    type: "string",
    placeholder: "Saisir l'email...",
  },
  password: {
    value: "",
    type: "string",
    placeholder: "Saisir le mot de passe...",
  },
  role: {
    value: "User",
    type: "select",
    placeholder: "Choisir le rôle",
    options: ["SuperAdmin", "Admin", "User"],
  },
  isVerified: {
    value: false,
    type: "boolean",
    placeholder: "Indiquer si vérifié...",
  },
});
const flattenValues = (obj: Record<string, UserField>) => {
  const result: Record<string, string | number | boolean> = {};

  for (const key in obj) {
    result[key] = obj[key].value;
  }
  return result;
};

const { values, errors, isSubmitting, httpError, handleSubmit } = useForm({
  schema: AddUserSchema,
  initialValues: {
    ...flattenValues(userInfo.value),
  },
  onSubmit: async (values) => {
    await usersStore.createUser(values);
  },
});

// Function to format labels in French
const getLabel = (key: string) => {
  switch (key) {
    case "firstname":
      return "Prénom*";
    case "lastname":
      return "Nom*";
    case "email":
      return "Email*";
    case "password":
      return "Mot de passe*";
    case "role":
      return "Rôle*";
    case "isVerified":
      return "Vérifié*";
    default:
      return key; // fallback to key name if no specific label found
  }
};
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100"
        >Ajouter un utilisateur</span
      >
      <span class="text-md text-text-200"
        >Remplissez les détails de l'utilisateur à ajouter.</span
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
      <Card class="w-full p-4">
        <CardHeader class="p-2">
          <CardTitle class="text-text-100 font-medium text-md mb-4"
            >Informations de l'utilisateur</CardTitle
          >
        </CardHeader>
        <CardContent>
          <div class="grid gap-4">
            <div v-for="(field, key) in userInfo" :key="key" class="grid gap-2">
              <Label :for="key.toString()">{{
                getLabel(key.toString())
              }}</Label>
              <Input
                v-if="field.type === 'string'"
                :id="key"
                v-model="values[key]"
                :placeholder="field.placeholder"
                type="text"
              />
              <Input
                v-if="field.type === 'password'"
                :id="key"
                v-model="values[key]"
                :placeholder="field.placeholder"
                type="password"
              />
              <Input
                v-if="field.type === 'number'"
                :id="key"
                v-model.number="values[key]"
                :placeholder="field.placeholder"
                type="number"
              />
              <Select v-if="field.type === 'select'" v-model="field.value">
                <SelectTrigger>
                  <SelectValue :placeholder="field.placeholder" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Rôle</SelectLabel>
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
              <div v-if="field.type === 'boolean'" class="flex items-center">
                <Checkbox :id="key.toString()" v-model="values[key]" />
                <Label :for="key.toString()" class="ml-2">{{
                  getLabel(key.toString())
                }}</Label>
              </div>
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

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
