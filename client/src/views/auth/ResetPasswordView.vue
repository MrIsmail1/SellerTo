<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/authStore';
import { useRoute } from 'vue-router';

const authStore = useAuthStore();
const route = useRoute();
const token = route.params.token
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
      <div class="grid gap-4">
        <div class="grid gap-2">
          <div class="flex items-center">
            <Input
            v-model="authStore.password"
            id="password"
            type="password"
            required
          />
          </div>
        </div>
        <Button @click="authStore.resetPassword(token)" type="submit" class="w-full">
          Réinitialiser votre mot de passe
        </Button>
        <p v-if="authStore.errorMessage">{{ authStore.errorMessage }}</p>
      </div>
    </CardContent>
  </Card>
</template>