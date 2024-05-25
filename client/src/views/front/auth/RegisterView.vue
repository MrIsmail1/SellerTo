<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'vue-router';
import { watch, onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  authStore.clearMessages();
});

watch(() => authStore.successMessage, (newMessage) => {
  if (newMessage) {
    router.push({
          path: '/success',
          query: {
            title: 'Inscription réussie',
            message: 'Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception et suivre les instructions pour confirmer votre compte.'
          }
    });
  }
});
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        S'inscrire
      </CardTitle>
      <CardDescription>
        Entrez vos informations pour créer un compte
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="authStore.register">
        <div class="grid gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="first-name">Prénom</Label>
              <Input id="first-name" placeholder="Max" required v-model="authStore.firstname" />
            </div>
            <div class="grid gap-2">
              <Label for="last-name">Nom</Label>
              <Input id="last-name" placeholder="Robinson" required v-model="authStore.lastname" />
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemple.com" required v-model="authStore.email" />
          </div>
          <div class="grid gap-2">
            <Label for="password">Mot de passe</Label>
            <Input id="password" type="password" v-model="authStore.password" />
          </div>
          <Button type="submit" class="w-full">
            Créer un compte
          </Button>
        </div>
      </form>
      <p v-if="authStore.errorMessage">{{ authStore.errorMessage }}</p>
      <div class="mt-4 text-center text-sm">
        Vous avez déjà un compte ?
        <RouterLink to="/login" class="underline">
          Connectez-vous
        </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>
