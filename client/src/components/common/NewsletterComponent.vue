<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
</script>

<template>
    <section class="bg-gray-100 mt-6 dark:bg-gray-800 py-12 flex justify-center">
        <div class="center">
            <img class="w-60 mb-2" src="@/assets/Newsletter.jpeg" alt="Newsletter image">
            <h2>Vous voulez recevoir des newsletters <br> sur le meilleur de nos produits</h2>
            <p class="mt-2">Inscrivez-vous pour recevoir nos bons plans et nos actus.</p>
            
                <form class="mt-6 flex gap-6">
                <Input type="email" class="w-full px-4 py-2 " placeholder="Entrez votre adresse e-mail" />
                <Button>S'inscrire</Button>
                </form>

        </div>
    </section>
</template>