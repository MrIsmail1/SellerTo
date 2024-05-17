<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
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