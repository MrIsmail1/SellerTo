<script setup lang="ts">
import Footer from '@/components/common/FooterComponent.vue'
import CardSellComponent from '@/components/CardSellComponent.vue';
import CardCategoryComponent from '@/components/CardCategoryComponent.vue';
import NewsletterComponent from '@/components/common/NewsletterComponent.vue';
import { useProductsStore } from '@/stores/productsStore';
import { onMounted } from 'vue';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const productStore = useProductsStore();

onMounted(() => {
  productStore.fetchProducts();
});

</script>


<template>
  <main>
     <Carousel>
    <CarouselContent>
      <CarouselItem v-for="product in productStore.ramdomProducts" :key="product.id">
        <div class="p-1">
          <CardSellComponent :product="product" />
        </div>
      </CarouselItem>
    </CarouselContent>
    <CarouselPrevious />
    <CarouselNext />
  </Carousel>
    <h2 class="mt-16" >Catégories poids lourds</h2>
    <p>Des appareils encore plus populaires que Teddy Riner.</p>
    <div class="flex justify-between gap-2 mt-6">
      <CardCategoryComponent :cardLink="`/category/macbook`" productImage="https://images.ctfassets.net/mmeshd7gafk1/9MX5iyCngiIXMgzDS29OV/c859d1a63ccad084ed4da5157a9d52b4/MacBook_Air__2022__M2.png" productCategory="Macbook" productDescription="Au prix d'un McMorning. Ou presque." cardImageClass="h-48" cardClass="w-1/2 h-80" />
      <CardCategoryComponent cardLink="/category/tablettes" productImage="https://images.ctfassets.net/mmeshd7gafk1/4mw1VnREHuLh2fhAkwD1z4/12af6c616fc3cee037de4c06b1e1b465/None_dae26af1-c478-409d-ae33-adc.png" productCategory="Tablettes" productDescription="Jusqu'a -40%? Ça laisse de quoi s'offrir un abonnement Netflix" cardImageClass="h-48" cardClass="w-1/2 h-80" />
    </div>
    <div class="mt-2 flex justify-between gap-2">
      <CardCategoryComponent cardLink="/category/smartphones" productImage="https://images.ctfassets.net/mmeshd7gafk1/3zoZJs9jnGFyk9TrqjPmvy/9999ff6219eef38d34cfbbca77872994/Capture-removebg-preview__4_.png" productCategory="Smartphones" productDescription="Encore plus intelligents que les téléphones neufs." cardImageClass="h-48" cardClass="w-1/3 h-80" />
      <CardCategoryComponent cardLink="/category/smart-watch" productImage="https://images.ctfassets.net/mmeshd7gafk1/3YMiDmVjmnXTkri7J7qWW0/a60e0a4ea263557b7707633714f636ff/Apple_Watch_Series_8_-_Black.png" productCategory="Smart Watch" productDescription="Attention ! Elle est un peu en avance sur son temps." cardImageClass="h-48" cardClass="w-1/3 h-80" />
      <CardCategoryComponent cardLink="/category/dyson" productImage="https://images.ctfassets.net/mmeshd7gafk1/584PO33EnPcrhONChnUYFj/49031443d104af83e6301a5b66a50de5/Gen5.png" productCategory="Dyson" productDescription="Reconditionné par Dyson." cardImageClass="h-48" cardClass="w-1/3 h-80" />
    </div>

    <h2 class="mt-16" >Autres catégories</h2>
    <p>Rien ne se perd, rien ne se crée</p>
    <div class="flex justify-between gap-2 mt-6">
      <CardCategoryComponent cardLink="/category/ninja" productImage="https://images.ctfassets.net/mmeshd7gafk1/4GTDiyiL7Z7dxkv5PhZ6L9/dc22512222b945ed515508a81ad77b3c/Ninja_Foodi_AF400_APP.png" productCategory="Ninja" productDescription="Les reconditionnés Ninja." cardImageClass="h-48" cardClass="w-1/2 h-80" />
      <CardCategoryComponent cardLink="/category/kitchen-aid" productImage="https://images.ctfassets.net/mmeshd7gafk1/7IAULAWGcc45gbZOKSyk03/58047c816dcafa9fd8ad39bce252cba9/kitchen_aid_artisian_red.png" productCategory="KitchenAid" productDescription="Reconditionné par KitchenAid." cardImageClass="h-48" cardClass="w-1/2 h-80" />
    </div>
    <div class="mt-2 flex justify-between gap-2">
      <CardCategoryComponent cardLink="/category/moulinex" productImage="https://images.ctfassets.net/mmeshd7gafk1/5XmoAFi1LxnEwFQfxS2OLF/a537ecb44e89b356b904a9128f99d963/Moulinex.png" productCategory="Moulinex" productDescription="Reconditionné par Moulinex." cardImageClass="h-48" cardClass="w-1/3 h-80" />
      <CardCategoryComponent cardLink="/category/coques" productImage="https://images.ctfassets.net/mmeshd7gafk1/3LeBlJeFbyivpS21W2b4Wv/3795b0f8662d46c6a5efa0e0e5eda3b1/BM_coque_noir...png" productCategory="Coques et protections" productDescription="Protection 5 étoiles." cardImageClass="h-48" cardClass="w-1/3 h-80" />
      <CardCategoryComponent cardLink="/category/pc" productImage="https://images.ctfassets.net/mmeshd7gafk1/4rah4soJKbLIZaX0YrEIfQ/f597c14deb480c7f41493692e075eede/HP_EliteBook_840_G6.png" productCategory="Ordinateurs portables" productDescription="Pour les inconditionnels de Christian Clavier." cardImageClass="h-48" cardClass="w-1/3 h-80" />
    </div>
    <NewsletterComponent />
  </main>
  <Footer />
</template>