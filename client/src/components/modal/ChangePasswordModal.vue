<script setup lang="ts">
import { ref } from 'vue';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import {Button} from "@/components/ui/button";

const emit = defineEmits(['close', 'save']);

const oldPassword = ref('');
const newPassword = ref('');
const authStore = useAuthStore();
const router = useRouter();

const save = async () => {
  await authStore.changePassword(oldPassword.value, newPassword.value);
  await authStore.logout();
  router.push('/login');
  emit('save');
  emit('close');
};

const closeModal = () => {
  oldPassword.value = '';
  newPassword.value = '';
  emit('close');
};
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <CardHeader>
          <CardTitle class="text-2xl">Changer le mot de passe</CardTitle>
          <CardDescription class="mb-4">Modifier votre mot de passe actuel</CardDescription>
          <button @click="closeModal" class="absolute top-2 right-2">
            <span class="material-symbols-outlined">close</span>
          </button>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="save">
            <div class="grid gap-4">
              <div class="grid gap-2">
                <Label for="old-password">Ancien mot de passe</Label>
                <Input id="old-password" type="password" required v-model="oldPassword" />
              </div>
              <div class="grid gap-2">
                <Label for="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" required v-model="newPassword" />
              </div>
            </div>
            <div class="flex justify-end space-x-4 mt-4">
              <Button type="button" variant="secondary" size="medium" @click="closeModal">Annuler</Button>
              <Button type="submit" variant="primary" size="medium">Enregistrer</Button>
            </div>
          </form>
        </CardContent>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
