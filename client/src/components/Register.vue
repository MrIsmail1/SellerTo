<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useAuthStore } from '../stores/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const authStore = useAuthStore();
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
        <a href="/login" class="underline">
          Connectez-vous
        </a>
      </div>
    </CardContent>
  </Card>
</template>








<!-- <script setup lang="ts">
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
</script>

<template>
  <div>
    <input v-model="authStore.firstname" type="text" placeholder="First Name">
    <input v-model="authStore.lastname" type="text" placeholder="Last Name">
    <input v-model="authStore.email" type="email" placeholder="Email">
    <input v-model="authStore.password" type="password" placeholder="Password">
    <button @click="authStore.register">Register</button>
    <p v-if="authStore.errorMessage">{{ authStore.errorMessage }}</p>
  </div>
</template>
 -->