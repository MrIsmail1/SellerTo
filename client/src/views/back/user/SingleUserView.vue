<script setup lang="ts">
import Button from "@/components/ui/button/Button.vue";
import { useUsersStore } from "@/stores/userStore";
import { Pencil } from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const userStore = useUsersStore();
const route = useRoute();
const router = useRouter();
const userId = route.params.id as string;
const user = computed(() => userStore.user);
const loading = computed(() => userStore.loading);
const error = computed(() => userStore.error);

const fetchUser = async () => {};

onMounted(async () => {
  await userStore.findUserById(userId);
});

const navigateToEditUser = () => {
  router.push({ name: "AdminEditUsers", params: { id: userId } });
};
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100"
        >Visualisation de l'utilisateur</span
      >
      <span class="text-md text-text-200"
        >Visualiser les détails de l'utilisateur.</span
      >
    </span>
    <Button
      class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
      @click="navigateToEditUser"
    >
      <Pencil class="icon w-6 h-6 mr-2 text-primary-200" />
      Modifier
    </Button>
  </div>
  <div class="flex flex-col mt-6 flex-grow w-full">
    <div v-if="loading" class="text-center">Chargement...</div>
    <div v-else-if="error" class="text-center text-red-500">
      Erreur: {{ error }}
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full" v-else-if="user">
      <div class="bg-white p-6 rounded shadow-lg w-full">
        <h2 class="font-bold text-2xl mb-4 text-text-100">
          Informations personnelles
        </h2>
        <p class="text-lg text-p">Prénom: {{ user?.firstname }}</p>
        <p class="text-lg text-text-200">Nom: {{ user?.lastname }}</p>
        <p class="text-lg text-text-200">Email: {{ user?.email }}</p>
        <p class="text-lg text-text-200">Téléphone: {{ user?.phoneNumber }}</p>
        <p class="text-lg text-text-200">Rôle: {{ user?.role }}</p>
        <p class="text-lg text-text-200">
          Vérifié: {{ user?.isVerified ? "Oui" : "Non" }}
        </p>
        <p class="text-lg text-text-200">
          Tentatives de connexion: {{ user?.loginAttempts }}
        </p>
        <p class="text-lg text-text-200" v-if="user?.lockUntil">
          Verrouillé jusqu'à: {{ new Date(user.lockUntil).toLocaleString() }}
        </p>
        <p class="text-lg text-text-200" v-if="user?.passwordChangedAt">
          Dernière modification du mot de passe:
          {{ new Date(user.passwordChangedAt).toLocaleString() }}
        </p>
      </div>
      <div class="bg-white p-6 rounded shadow-lg w-full h-fit">
        <h2 class="font-bold text-2xl mb-4 text-text-100">
          Adresse de livraison
        </h2>
        <p class="text-lg text-text-200" v-if="!user?.address">
          Aucune adresse renseignée pour cet utilisateur.
        </p>
        <div v-else>
          <p class="text-lg text-text-200">Adresse: {{ user?.address }}</p>
          <p class="text-lg text-text-200">
            Code Postal: {{ user?.postalCode }}
          </p>
          <p class="text-lg text-text-200">Ville: {{ user?.city }}</p>
          <p class="text-lg text-text-200">Pays: {{ user?.country }}</p>
        </div>
      </div>
      <div class="bg-white p-6 rounded shadow-lg w-full">
        <h2 class="font-bold text-2xl mb-4 text-text-100">
          Adresse de facturation
        </h2>
        <p class="text-lg text-text-200" v-if="!user?.billingAddress">
          Aucune adresse renseignée pour cet utilisateur.
        </p>
        <div v-else>
          <p class="text-lg text-text-200">
            Adresse: {{ user?.billingAddress }}
          </p>
          <p class="text-lg text-text-200">
            Code Postal: {{ user?.billingPostalCode }}
          </p>
          <p class="text-lg text-text-200">Ville: {{ user?.billingCity }}</p>
          <p class="text-lg text-text-200">Pays: {{ user?.billingCountry }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
