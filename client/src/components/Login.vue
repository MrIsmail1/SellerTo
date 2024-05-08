<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
</script>


<template>
  <Card class="mx-auto max-w-sm">
    <CardHeader>
      <CardTitle class="text-2xl">
        Connexion
      </CardTitle>
      <CardDescription>
        Entrez votre email ci-dessous pour vous connecter à votre compte
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            v-model="authStore.email"
            id="email"
            type="email"
            placeholder="m@exemple.com"
            required
          />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Mot de passe</Label>
            <a href="/forgotpassword" class="ml-auto inline-block text-sm underline">
              Mot de passe oublié ?
            </a>
          </div>
          <Input v-model="authStore.password" id="password" type="password" required />
        </div>
        <Button @click="authStore.login" type="submit" class="w-full">
          Se connecter
        </Button>
        <p v-if="authStore.errorMessage">{{ authStore.errorMessage }}</p>
        <!-- Optionnellement, ajouter un bouton pour la connexion via Google ou autre méthode
        <Button variant="outline" class="w-full">
          Se connecter avec Google
        </Button>
        -->
      </div>
      <div class="mt-4 text-center text-sm">
        Vous n'avez pas de compte ?
        <a href="/register" class="underline">
          Inscrivez-vous
        </a>
      </div>
    </CardContent>
  </Card>
</template>