<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useUserAlertsStore } from '@/stores/userAlertsStore';
import PersonalInfoModal from '@/components/modal/PersonalInfoModal.vue';
import ChangePasswordModal from '@/components/modal/ChangePasswordModal.vue';

const authStore = useAuthStore();
const userAlertsStore = useUserAlertsStore();
const showModal = ref(false);
const showChangePasswordModal = ref(false);
const modalContent = ref('personal'); // State variable to track which form to show
const newsletterSubscription = ref(false);

const fetchUser = async () => {
  await authStore.fetchUser();
  await fetchNewsletterSubscription();
};

const fetchNewsletterSubscription = async () => {
  const alerts = await userAlertsStore.getAlertsByUserId(authStore.user.id);
  const newsletterAlert = alerts.find(alert => alert.alertId === 4); // Assuming 4 is the ID for the newsletter alert
  newsletterSubscription.value = newsletterAlert ? newsletterAlert.isActive : false;
};

const updatePersonalInfo = async (user) => {
  await authStore.updateUser(user);
  showModal.value = false;
};

const editSection = (section) => {
  modalContent.value = section;
  showModal.value = true;
};

const openChangePasswordModal = () => {
  showChangePasswordModal.value = true;
};

const updateNewsletterSubscription = async () => {
  const updates = {
    userId: authStore.user.id,
    alertId: 1, // Assuming 4 is the ID for the newsletter alert
    isActive: newsletterSubscription.value,
  };
  await userAlertsStore.updateUserAlerts([updates]);
};

onMounted(() => {
  fetchUser();
});
</script>


<template>
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"/>
  <div class="container mx-auto p-4">
    <h1 class="font-bold text-5xl text-center pb-8">Profil</h1>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded shadow-lg relative">
        <h2 class="font-bold text-2xl mb-4">Informations personnelles</h2>
        <p class="text-lg">{{ authStore.user?.firstname }} {{ authStore.user?.lastname }}</p>
        <p class="text-lg">{{ authStore.user?.email }}</p>
        <p class="text-lg">{{ authStore.user?.phoneNumber }}</p>
        <div class="mt-4">
          <button @click="openChangePasswordModal" class="underline mr-16 text-lg ">Modifier mon mot de passe</button>
          <RouterLink to="/account/delete" class="underline text-lg">Supprimer mon compte</RouterLink>
        </div>
        <button @click="editSection('personal')" class="absolute top-4 right-4">
          <span class="material-symbols-outlined">edit</span>
        </button>
      </div>
      <div class="bg-white p-6 rounded shadow-lg relative">
        <h2 class="font-bold text-2xl mb-4">Adresse de livraison</h2>
        <p class="text-lg" v-if="!authStore.user?.address">Vous n'avez renseigné aucune adresse.</p>
        <div v-else>
          <p class="text-lg">{{ authStore.user?.address }}</p>
          <p class="text-lg">{{ authStore.user?.postalCode }} {{ authStore.user?.city }}</p>
          <p class="text-lg">{{ authStore.user?.country }}</p>
        </div>
        <button @click="editSection('shipping')" class="absolute top-4 right-4">
          <span class="material-symbols-outlined">edit</span>
        </button>
      </div>
      <div class="bg-white p-6 rounded shadow-lg relative">
        <h2 class="font-bold text-2xl mb-4">Adresse de facturation</h2>
        <p class="text-lg">Vous n'avez renseigné aucune adresse.</p>
        <button @click="editSection('billing')" class="absolute top-4 right-4">
          <span class="material-symbols-outlined">edit</span>
        </button>
      </div>
      <div class="bg-white p-6 rounded shadow-lg">
        <h2 class="font-bold text-2xl mb-4">Préférences en matière d’e-mail</h2>
        <label class="flex items-center">
          <input type="checkbox" class="form-checkbox text-blue-600" v-model="newsletterSubscription" @change="updateNewsletterSubscription" />
          <span class="ml-2 text-lg">Recevoir notre newsletter sur l'actualité du reconditionné.</span>
        </label>
      </div>
    </div>
    <PersonalInfoModal
        v-if="showModal"
        @close="showModal = false"
        @save="updatePersonalInfo"
        :user="authStore.user"
        :content="modalContent"
    />
    <ChangePasswordModal v-if="showChangePasswordModal" @close="showChangePasswordModal = false" />
  </div>
</template>


<style scoped>
.container {
  max-width: 1200px;
}
</style>
