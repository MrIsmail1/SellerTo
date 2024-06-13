<script setup lang="ts">
import {ref, watch} from 'vue';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";

const props = defineProps({user: Object, content: String});
const emit = defineEmits(['close', 'save']);

const localUser = ref({...props.user});

const save = () => {
  emit('save', localUser.value);
};

watch(() => props.user, (newUser) => {
  localUser.value = {...newUser};
});
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <CardHeader>
          <CardTitle class="text-2xl">
            {{ content === 'personal' ? ' Informations personnelles' : 'Adresse de livraison' }}
          </CardTitle>
          <CardDescription class="mb-4">
            {{
              content === 'personal' ? 'Modifier vos informations personnel' : 'Modifier votre adresse de livraison'
            }}
          </CardDescription>
          <button @click="$emit('close')" class="absolute top-2 right-2">
            <span class="material-symbols-outlined">close</span>
          </button>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="save">
            <div v-if="content === 'personal'" class="grid gap-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="first-name">Prénom</Label>
                  <Input id="first-name" placeholder="Max" required v-model="localUser.firstname"/>
                </div>
                <div class="grid gap-2">
                  <Label for="last-name">Nom</Label>
                  <Input id="last-name" placeholder="Robinson" required v-model="localUser.lastname"/>
                </div>
              </div>
              <div class="grid gap-2">
                <Label for="email">Email</Label>
                <Input id="email" type="email" placeholder="m@exemple.com" required v-model="localUser.email"/>
              </div>
              <div class="grid gap-2">
                <Label for="phone">Téléphone</Label>
                <Input id="phone" placeholder="06 10 11 12 13" v-model="localUser.phoneNumber"/>
              </div>
            </div>
            <div v-else class="grid gap-4">
                <div class="grid gap-2">
                  <Label for="country">Pays</Label>
                  <Input id="country" placeholder="France" required v-model="localUser.country"/>
                </div>
                <div class="grid gap-2">
                  <Label for="address">Adresse</Label>
                  <Input id="address" placeholder="123 rue de Paris" required v-model="localUser.address"/>
                </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Label for="city">Ville</Label>
                  <Input id="city" placeholder="Paris" required v-model="localUser.city"/>
                </div>
                <div class="grid gap-2">
                  <Label for="postalCode">Code Postal</Label>
                  <Input id="postalCode" placeholder="75000" required v-model="localUser.postalCode"/>
                </div>
              </div>
              <div class="grid gap-2">
                <Label for="phone">Téléphone</Label>
                <Input id="phone" placeholder="06 10 11 12 13" required v-model="localUser.phoneNumber"/>
                <p class="text-sm">On en a juste besoin pour la livraison, au cas où.</p>
              </div>
            </div>
            <div class="flex justify-end space-x-4 mt-4">
              <button type="button" @click="$emit('close')" class="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                Annuler
              </button>
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Enregistrer</button>
            </div>
          </form>
        </CardContent>
      </div>
    </div>
  </Card>
</template>