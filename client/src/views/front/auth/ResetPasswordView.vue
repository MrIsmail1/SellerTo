<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/stores/authStore';
import { useRoute } from 'vue-router';
import { resetPasswordSchema } from '@/z-schemas/authSchema';
import { useForm } from '@/composables/useForm';

const authStore = useAuthStore();
const route = useRoute();
const token = route.params.token;

const { values, errors, isSubmitting, httpError, handleSubmit, cancelRequest } = useForm({
  schema: resetPasswordSchema,
  initialValues: {
    password: ''
  },
  onSubmit: async (values) => {
    try {
      await authStore.resetPassword({ token, ...values });
    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation du mot de passe', error);
    }
  }
});
</script>

<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Créez un mot de passe fort
      </CardTitle>
      <CardDescription>
        Votre mot de passe doit contenir au moins 12 caractères ainsi qu’une combinaison de chiffres, de lettres et de caractères spéciaux ( !$@%).
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4">
          <div class="grid gap-2">
            <div class="flex items-center">
              <Input
                v-model="values.password.value"
                id="password"
                type="password"
                required
              />
              <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
            </div>
          </div>
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            Réinitialiser votre mot de passe
          </Button>
        </div>
      </form>
      <p v-if="httpError" class="text-red-500">{{ httpError }}</p>
      <p v-if="authStore.errorMessage" class="text-red-500">{{ authStore.errorMessage }}</p>
    </CardContent>
  </Card>
</template>
