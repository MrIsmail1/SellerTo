<script setup lang="ts">
import {ref} from 'vue';
import {useAuthStore} from '@/stores/authStore';
import {useRouter} from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();
const confirmDelete = ref(false);

const deleteAccount = async () => {
  if (confirmDelete.value) {
    await authStore.deleteAccount();
    router.push('/');
  }
};
</script>

<template>
  <div class="container mx-auto p-4">
    <div class="bg-white pb-10 px-10 pt-4 rounded shadow-lg max-w-4xl mx-auto">
      <h1 class="font-bold text-5xl mb-10">Supprimer mon compte</h1>
      <h4 class="text-2xl mb-6">Aucun retour en arrière n'est possible</h4>
      <p class="text-lg mb-4">
        La suppression de votre compte est une action permanente. Une fois votre compte supprimé, vous ne pouvez plus y
        accéder et il ne peut pas être restauré.
      </p>
      <ul class="list-disc list-inside mb-4">
        <li class="text-lg">Vous n’aurez plus accès aux informations et données stockées dans votre compte.</li>
        <li class="text-lg">Vous cesserez de recevoir des communications de suivi.</li>
        <li class="text-lg">Vous devrez créer un nouveau compte si vous souhaitez passer une nouvelle commande.</li>
      </ul>
      <p class="text-lg mb-4">Si vous cliquez sur « Supprimer le compte », vous serez automatiquement déconnecté de votre compte.</p>
      <div class="pb-6 pt-4">
        <label class="flex items-center mb-4">
          <input type="checkbox" v-model="confirmDelete" class="form-checkbox text-red-600"/>
          <span class="ml-2 text-lg">Oui, je veux supprimer définitivement mon compte.</span>
        </label>
      </div>
      <button @click="deleteAccount" :disabled="!confirmDelete" class="bg-red-600 text-white px-4 py-2 rounded"
              :class="{'opacity-30': !confirmDelete}">
        Supprimer mon compte
      </button>
      <p class="text-lg mb-4 pt-6">Veuillez noter que des données spécifiques peuvent être conservées pendant une certaine
        période si un achat ou
        une revente a eu lieu. Pour plus de détails sur nos pratiques en matière de confidentialité des données, nous
        vous
        encourageons à visiter notre Plateforme et à consulter notre <span class="text-lg underline">Politique de confidentialité</span> mise à jour.</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  min-width: 1200px;
}
</style>