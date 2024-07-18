<script setup lang="ts">
import DataTable from "@/components/common/DataTableComponent.vue";
import { columns } from "@/components/datatable-columns/User";

import Button from "@/components/ui/button/Button.vue";
import { useUsersStore } from "@/stores/userStore";
import type { User } from "@/z-schemas/UserSchema";
import { Plus } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const data = ref<User[]>([]);
const usersStore = useUsersStore();
const router = useRouter();

onMounted(async () => {
  await usersStore.fetchUsers();
  data.value = usersStore.users;
});
</script>
<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Utilisateurs</span>
      <span class="text-md text-text-200">Gérer vos utilisateurs ici.</span>
    </span>
    <Button
      class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
      @click="router.push({ name: 'AdminAddUser' })"
    >
      <Plus class="icon w-6 h-6 mr-2 text-primary-200" />
      Utilisateur
    </Button>
  </div>
  <div class="flex flex-col mt-6">
    <DataTable :columns="columns" :data="data" filterColumn="email" />
  </div>
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
