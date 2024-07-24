<template>
  <div class="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-bold mb-6 text-gray-900">Envoyer une Newsletter</h1>
    <form @submit.prevent="handleSendNewsletter" class="space-y-6">
      <div>
        <label for="subject" class="block text-sm font-medium text-gray-700">Sujet:</label>
        <input type="text" id="subject" v-model="subject" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
      </div>
      <div>
        <label for="message" class="block text-sm font-medium text-gray-700">Message:</label>
        <textarea id="message" v-model="message" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
      </div>
      <button type="submit" class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">Envoyer</button>
    </form>
    <p v-if="responseMessage" class="mt-4 text-green-600">{{ responseMessage }}</p>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useNewsletterStore } from '@/stores/newsletterStore';

const newsletterStore = useNewsletterStore();
const subject = ref('');
const message = ref('');
const responseMessage = ref('');

const handleSendNewsletter = async () => {
  newsletterStore.subject = subject.value;
  newsletterStore.message = message.value;
  await newsletterStore.sendNewsletter();
  responseMessage.value = newsletterStore.responseMessage;

  // Clear the input fields
  subject.value = '';
  message.value = '';
};
</script>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>



<!--<template>-->
<!--  <div>-->
<!--    <h1>Envoyer une Newsletter</h1>-->
<!--    <form @submit.prevent="handleSubmit">-->
<!--      <div>-->
<!--        <label for="subject">Sujet:</label>-->
<!--        <input type="text" id="subject" v-model="values.subject" :placeholder="getLabel('subject')" required>-->
<!--        <span v-if="errors.subject" class="text-red-500 text-sm">{{ errors.subject }}</span>-->
<!--      </div>-->
<!--      <div>-->
<!--        <label for="message">Message:</label>-->
<!--        <textarea id="message" v-model="values.message" :placeholder="getLabel('message')" required></textarea>-->
<!--        <span v-if="errors.message" class="text-red-500 text-sm">{{ errors.message }}</span>-->
<!--      </div>-->
<!--      <button type="submit" :disabled="isSubmitting">Envoyer</button>-->
<!--    </form>-->
<!--    <p v-if="responseMessage">{{ responseMessage }}</p>-->
<!--    <p v-if="httpError" class="text-red-500 text-xs mt-2">{{ httpError }}</p>-->
<!--  </div>-->
<!--</template>-->

<!--<script lang="ts" setup>-->
<!--import { ref } from 'vue';-->
<!--import { useForm } from '@/composables/useForm';-->
<!--import { useNewsletterStore } from '@/stores/newsletterStore';-->
<!--import NewsletterSchema from "@/z-schemas/NewsletterShema";-->

<!--const newsletterStore = useNewsletterStore();-->

<!--type FieldType = "string";-->

<!--interface NewsletterField {-->
<!--  value: string;-->
<!--  type: FieldType;-->
<!--  placeholder: string;-->
<!--}-->

<!--const newsletterInfo = ref<Record<string, NewsletterField>>({-->
<!--  subject: {-->
<!--    value: "",-->
<!--    type: "string",-->
<!--    placeholder: "Saisir le sujet"-->
<!--  },-->
<!--  message: {-->
<!--    value: "",-->
<!--    type: "string",-->
<!--    placeholder: "Saisir le message"-->
<!--  }-->
<!--});-->

<!--const flattenValues = (obj: Record<string, NewsletterField>) => {-->
<!--  const result: Record<string, string> = {};-->

<!--  for (const key in obj) {-->
<!--    result[key] = obj[key].value;-->
<!--  }-->
<!--  return result;-->
<!--};-->

<!--const { values, errors, isSubmitting, httpError, handleSubmit } = useForm({-->
<!--  schema: NewsletterSchema,-->
<!--  initialValues: {-->
<!--    ...flattenValues(newsletterInfo.value)-->
<!--  },-->
<!--  onSubmit: async (values) => {-->
<!--    newsletterStore.subject = values.subject;-->
<!--    newsletterStore.message = values.message;-->
<!--    await newsletterStore.sendNewsletter();-->
<!--  },-->
<!--});-->

<!--const responseMessage = ref('');-->

<!--const getLabel = (key: string) => {-->
<!--  switch (key) {-->
<!--    case "subject":-->
<!--      return "Saisir le sujet...";-->
<!--    case "message":-->
<!--      return "Saisir le message...";-->
<!--    default:-->
<!--      return key;-->
<!--  }-->
<!--};-->
<!--</script>-->

<!--<style scoped>-->
<!--.text-red-500 {-->
<!--  color: red;-->
<!--}-->
<!--</style>-->