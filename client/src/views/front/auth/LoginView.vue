<script setup lang="ts">
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { loginSchema } from '@/z-schemas/authSchema';
import { useForm } from '@/composables/useForm';
import { onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const { values, errors, isSubmitting, httpError, handleSubmit } = useForm({
  schema: loginSchema,
  initialValues: {
    email: '',
    password: ''
  },
  onSubmit: async (values) => {
    await authStore.login(values);
    if (!authStore.errorMessage) {
      router.push('/');
    }
  }
});

onMounted(() => {
  authStore.clearMessages();
});
</script>

<template>
  <Card class="mx-auto max-w-sm mt-16">
    <CardHeader>
      <CardTitle class="text-2xl">
        Connexion
      </CardTitle>
      <CardDescription class="mb-3">
        Entrez votre email ci-dessous pour vous connecter à votre compte
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              v-model="values.email.value"
              id="email"
              type="email"
              placeholder="jeanBernard@gmail.com"
              required
            />
            <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Mot de passe</Label>
              <RouterLink to="/forgotpassword" class="ml-auto inline-block text-sm underline">
                Mot de passe oublié ?
              </RouterLink>
            </div>
            <Input v-model="values.password.value" id="password" type="password" placeholder="••••••••••••••••" required />
            <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
          </div>
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            Se connecter
          </Button>
          <p v-if="httpError" class="text-red-500">{{ httpError }}</p>
          <p v-if="authStore.errorMessage" class="text-red-500">{{ authStore.errorMessage }}</p>
        </div>
      </form>
      <div class="mt-4 text-center text-sm">
        Vous n'avez pas de compte ?
        <RouterLink to="/register" class="underline">
          Inscrivez-vous
        </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>
