<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore';
import { onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

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
        title: 'Réinitialisation réussie',
        message: 'Un email de réinitialisation vous a été envoyé. Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe.'
      }
    });
  }
});
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Mot de passe oublié ?
      </CardTitle>
      <CardDescription>
        Entrez votre adresse e-mail et nous vous enverrons un lien pour réinitialiser votre mot de passe.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <div class="flex items-center">
            <Input
            v-model="authStore.email"
            id="email"
            type="email"
            placeholder="hamza.mahmood@exemple.com"
            required
          />
          </div>
        </div>
        <Button @click="authStore.forgotPassword" type="submit" class="w-full">
          Envoyer
        </Button>
        <p v-if="authStore.errorMessage">{{ authStore.errorMessage }}</p>
      </div>
      <div class="mt-4 text-center text-sm">
        Vous n'avez pas de compte ?
        <RouterLink to="/register" class="underline">
          Inscrivez-vous
        </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>