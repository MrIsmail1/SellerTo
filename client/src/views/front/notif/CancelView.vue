<script setup lang="ts">
import { useRoute } from 'vue-router';
import { Ban } from 'lucide-vue-next';
import { Card } from '@/components/ui/card';
const route = useRoute();
const title = route.query.title || 'Paiement annulé';
const message = route.query.message || 'Votre paiement a été annulé. Si vous avez des questions, veuillez contacter notre support.';
</script>

<template>
    <div class="flex justify-center items-center">
        <Card class="max-w-md w-full text-center p">
            <h1 class="mb-4">{{ title }}</h1>
            <p>{{ message }}</p>
            <div class="flex justify-center"><Ban class="text-red-500 h-10 w-10" /></div>
            <RouterLink to="/" class="inline-block underline">Retour à l'accueil</RouterLink>
        </Card>
    </div>
</template>