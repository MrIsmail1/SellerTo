<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'vue-router';
import { registerSchema } from '@/z-schemas/authSchema';
import { useForm } from '@/composables/useForm';
import { watch, onMounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

const { values, errors, isSubmitting, httpError, handleSubmit } = useForm({
  schema: registerSchema,
  initialValues: {
    firstname: '',
    lastname: '',
    email: '',
    password: ''
  },
  onSubmit: async (values) => {
    await authStore.register(values);
    if (authStore.successMessage) {
      router.push({
        path: '/success',
        query: {
          title: 'Inscription réussie',
          message: 'Un email de confirmation vous a été envoyé. Veuillez vérifier votre boîte de réception et suivre les instructions pour confirmer votre compte.'
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
      <form @submit.prevent="handleSubmit">
        <div class="grid gap-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="first-name">Prénom</Label>
              <Input id="first-name" placeholder="Max" v-model="values.firstname.value" />
              <p v-if="errors.firstname" class="text-red-500">{{ errors.firstname }}</p>
            </div>
            <div class="grid gap-2">
              <Label for="last-name">Nom</Label>
              <Input id="last-name" placeholder="Robinson" v-model="values.lastname.value" />
              <p v-if="errors.lastname" class="text-red-500">{{ errors.lastname }}</p>
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input id="email" type="email" placeholder="m@exemple.com" v-model="values.email.value" />
            <p v-if="errors.email" class="text-red-500">{{ errors.email }}</p>
          </div>
          <div class="grid gap-2">
            <Label for="password">Mot de passe</Label>
            <Input id="password" type="password" v-model="values.password.value" />
            <p v-if="errors.password" class="text-red-500">{{ errors.password }}</p>
          </div>
          <Button type="submit" class="w-full" :disabled="isSubmitting">
            Créer un compte
          </Button>
        </div>
      </form>
      <p v-if="httpError" class="text-red-500">{{ httpError }}</p>
      <p v-if="authStore.errorMessage" class="text-red-500">{{ authStore.errorMessage }}</p>
      <div class="mt-4 text-center text-sm">
        Vous avez déjà un compte ?
        <RouterLink to="/login" class="underline">
          Connectez-vous
        </RouterLink>
      </div>
    </CardContent>
  </Card>
</template>
