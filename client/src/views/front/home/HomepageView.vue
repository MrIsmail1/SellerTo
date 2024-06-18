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
      <CarouselItem class="pl-1 md:basis-1/2 lg:basis-1/4" v-for="product in productStore.ramdomProducts" :key="product._id">
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
    <div class="flex justify-between gap-0 md:gap-2 mt-6 flex-col md:flex-row">
      <CardCategoryComponent :cardLink="`/category/macbook`" productImage="https://images.ctfassets.net/mmeshd7gafk1/9MX5iyCngiIXMgzDS29OV/c859d1a63ccad084ed4da5157a9d52b4/MacBook_Air__2022__M2.png" productCategory="Macbook" productDescription="Au prix d'un McMorning. Ou presque." cardImageClass="h-48" cardClass="w-full md:w-1/2 h-80" />
      <CardCategoryComponent cardLink="/category/tablet" productImage="https://images.ctfassets.net/mmeshd7gafk1/4mw1VnREHuLh2fhAkwD1z4/12af6c616fc3cee037de4c06b1e1b465/None_dae26af1-c478-409d-ae33-adc.png" productCategory="Tablettes" productDescription="Jusqu'a -40%? Ça laisse de quoi s'offrir un abonnement Netflix" cardImageClass="h-48" cardClass="w-full md:w-1/2 h-80 mt-2 md:mt-0" />
    </div>
    <div class="flex-col md:flex-row mt-2 flex justify-between gap-2">
      <CardCategoryComponent cardLink="/category/smartphones" productImage="https://images.ctfassets.net/mmeshd7gafk1/3zoZJs9jnGFyk9TrqjPmvy/9999ff6219eef38d34cfbbca77872994/Capture-removebg-preview__4_.png" productCategory="Smartphones" productDescription="Encore plus intelligents que les téléphones neufs." cardImageClass="h-48" cardClass="w-full md:w-1/3 h-80" />
      <CardCategoryComponent cardLink="/category/smart-watch" productImage="https://images.ctfassets.net/mmeshd7gafk1/3YMiDmVjmnXTkri7J7qWW0/a60e0a4ea263557b7707633714f636ff/Apple_Watch_Series_8_-_Black.png" productCategory="Smart Watch" productDescription="Attention ! Elle est un peu en avance sur son temps." cardImageClass="h-48" cardClass="w-full md:w-1/3 h-80" />
      <CardCategoryComponent cardLink="/category/airpods" productImage="https://www.backmarket.fr/cdn-cgi/image/format%3Dauto%2Cquality%3D75%2Cwidth%3D3840/https://d2e6ccujb3mkqf.cloudfront.net/7a591f17-256c-4b8f-8953-38a76665eb69-1_7da968b2-0811-40fc-a2b5-4067fa8bb2e5.jpg" productCategory="Écouteurs" productDescription="Reconditionné par SellerTo." cardImageClass="h-48" cardClass="w-full md:w-1/3 h-80" />
    </div>

    <h2 class="mt-16" >Autres catégories</h2>
    <p>Rien ne se perd, rien ne se crée</p>
    <div class="flex justify-between gap-2 mt-6 flex-col md:flex-row">
      <CardCategoryComponent cardLink="/category/headphone" productImage="https://www.backmarket.fr/cdn-cgi/image/format%3Dauto%2Cquality%3D75%2Cwidth%3D3840/https://d2e6ccujb3mkqf.cloudfront.net/da2f726f-aeed-4547-a9b1-76a0ec0061f0-1_75fafcf9-f07b-4b0f-92db-b770d81c198e.jpg" productCategory="Enceintes" productDescription="Les reconditionnés Enceintes." cardImageClass="h-48" cardClass="w-full md:w-1/2 h-80" />
      <CardCategoryComponent cardLink="/category/Apple" productImage="https://images.ctfassets.net/mmeshd7gafk1/IiseEbDeAuTq5SBNiEwsO/576a06a41e6abf11b6208eaf98c79692/chargeur-certifie.jpeg" productCategory="Accesssoires" productDescription="Reconditionné par Nous." cardImageClass="h-48" cardClass="w-full md:w-1/2 h-80" />
    </div>
    <div class="flex-col md:flex-row mt-2 flex justify-between gap-2">
      <CardCategoryComponent cardLink="/category/huawei" productImage="https://www.backmarket.fr/cdn-cgi/image/format%3Dauto%2Cquality%3D75%2Cwidth%3D3840/https://d2e6ccujb3mkqf.cloudfront.net/10bfc4c6-9c25-42fc-af75-e4b0ed5ab4e3-1_15bf7259-2a6c-45a2-9b82-3a74d881c201.jpg" productCategory="Huawei" productDescription="Reconditionné par Huawei." cardImageClass="h-48" cardClass="w-full md:w-1/3 h-80" />
      <CardCategoryComponent cardLink="/category/coques" productImage="https://images.ctfassets.net/mmeshd7gafk1/3LeBlJeFbyivpS21W2b4Wv/3795b0f8662d46c6a5efa0e0e5eda3b1/BM_coque_noir...png" productCategory="Coques et protections" productDescription="Protection 5 étoiles." cardImageClass="h-48" cardClass="w-full md:w-1/3 h-80" />
      <CardCategoryComponent cardLink="/category/computer" productImage="https://images.ctfassets.net/mmeshd7gafk1/4rah4soJKbLIZaX0YrEIfQ/f597c14deb480c7f41493692e075eede/HP_EliteBook_840_G6.png" productCategory="Ordinateurs portables" productDescription="Pour les inconditionnels de Christian Clavier." cardImageClass="h-48" cardClass="w-full md:w-1/3 h-80" />
    </div>
    <NewsletterComponent />
  </main>
  <Footer />
</template>