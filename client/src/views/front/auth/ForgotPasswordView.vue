<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { onMounted, watch } from 'vue';
import { forgotPasswordSchema } from '@/z-schemas/authSchema';
import { useForm } from '@/composables/useForm';

const authStore = useAuthStore();
const router = useRouter();

const { values, errors, isSubmitting, httpError, handleSubmit, cancelRequest } = useForm({
  schema: forgotPasswordSchema,
  initialValues: {
    email: ''
  },
  onSubmit: async (values) => {
    await authStore.forgotPassword(values);
    if (authStore.successMessage) {
      router.push({
        path: '/success',
        query: {
          title: 'Réinitialisation réussie',
          message: 'Un email de réinitialisation vous a été envoyé. Veuillez vérifier votre boîte de réception et suivre les instructions pour réinitialiser votre mot de passe.'
        }
      });
    }
  }
});

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
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4">
          <div class="grid gap-2">
            <div class="flex items-center">
              <Input
                v-model="values.email.value"
                id="email"
                type="email"
                placeholder="hamza.mahmood@exemple.com"
                required
              />
              <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
            </div>
          </div>
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            Envoyer
          </Button>
          <Button type="button" class="w-full mt-2" @click="cancelRequest" :disabled="!isSubmitting">
            Annuler
          </Button>
        </div>
      </form>
      <p v-if="httpError" class="text-red-500">{{ httpError }}</p>
      <p v-if="authStore.errorMessage" class="text-red-500">{{ authStore.errorMessage }}</p>
      <div class="mt-4 text-center text-sm">
        Vous n'avez pas de compte ?
        <RouterLink to="/register" class="underline">
          Inscrivez-vous
        </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>
