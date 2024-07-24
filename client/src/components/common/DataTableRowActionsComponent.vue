<script setup lang="ts">
import ConfirmModal from "@/components/modal/ConfirmModal.vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Row } from "@tanstack/vue-table";
import { Ellipsis } from "lucide-vue-next";
import { ref } from "vue";
import { useRouter } from "vue-router";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
  viewRoute?: string;
  editRoute?: string;
  deleteFunction?: (id: string) => Promise<void>; // Make deleteFunction optional
}

const props = defineProps<DataTableRowActionsProps<any>>();
const router = useRouter();
const showModal = ref(false);

const rowId = props.row.original._id
  ? props.row.original._id
  : props.row.original.id;

const navigateTo = (route: string) => {
  router.push(route);
};

const deleteItem = async (rowId: string) => {
  showModal.value = true;
};

const confirmDelete = async () => {
  if (props.deleteFunction) {
    try {
      props.deleteFunction(rowId);
      router.go(0);
    } catch (error: any) {
      console.error("Delete error:", error);
    }
  }
  showModal.value = false;
};

const cancelDelete = () => {
  showModal.value = false;
};
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        variant="ghost"
        class="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
      >
        <Ellipsis class="h-4 w-4" />
        <span class="sr-only">Open menu</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-[160px]">
      <DropdownMenuItem
        v-if="props.viewRoute"
        @click="navigateTo(props.viewRoute + '/' + rowId)"
      >
        Visualiser
      </DropdownMenuItem>
      <DropdownMenuItem
        v-if="props.editRoute"
        @click="navigateTo(props.editRoute + '/' + rowId)"
      >
        Modifier
      </DropdownMenuItem>
      <DropdownMenuSeparator v-if="props.deleteFunction && props.editRoute" />
      <DropdownMenuItem v-if="props.deleteFunction" @click="deleteItem(rowId)">
        Supprimer
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <ConfirmModal
    v-if="showModal"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>
