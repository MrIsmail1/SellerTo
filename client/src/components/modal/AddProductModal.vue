<script setup lang="ts">
import { ref } from "vue";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-vue-next";

const emit = defineEmits(["close", "save"]);

const product = ref({
  name: "",
  description: "",
  price: "",
  quantity: "",
});

const save = () => {
  emit("save", product.value);
};

const close = () => {
  emit("close");
};
</script>

<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
      <CardHeader>
        <CardTitle class="text-2xl">Ajouter un produit</CardTitle>
        <CardDescription class="mb-4"
          >Remplissez les détails du produit à ajouter</CardDescription
        >
        <button @click="close" class="absolute top-2 right-2">
          <span><X /></span>
        </button>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="save">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <Label for="product-name">Nom du produit</Label>
              <Input
                id="product-name"
                placeholder="Nom du produit"
                required
                v-model="product.name"
              />
            </div>
            <div class="grid gap-2">
              <Label for="product-description">Description</Label>
              <Textarea
                id="product-description"
                placeholder="Description du produit"
                required
                v-model="product.description"
              />
            </div>
            <div class="grid gap-2">
              <Label for="product-price">Prix</Label>
              <Input
                id="product-price"
                type="number"
                placeholder="Prix"
                required
                v-model="product.price"
              />
            </div>
            <div class="grid gap-2">
              <Label for="product-quantity">Quantité</Label>
              <Input
                id="product-quantity"
                type="number"
                placeholder="Quantité"
                required
                v-model="product.quantity"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-4 mt-4">
            <Button
              type="button"
              variant="secondary"
              size="medium"
              @click="close"
              >Annuler</Button
            >
            <Button type="submit" variant="primary" size="medium"
              >Enregistrer</Button
            >
          </div>
        </form>
      </CardContent>
    </div>
  </div>
</template>
