<script setup lang="ts">
import DialogComponent from "@/components/common/DialogComponent.vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteHandler } from "@/handlers/useDeleteHandler";
import type { Row } from "@tanstack/vue-table";
import { Ellipsis } from "lucide-vue-next";
import { useRouter } from "vue-router";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
  viewRoute: string;
  editRoute: string;
  deleteRoute: string;
  deleteFunction: (id: number) => Promise<void>;
}

const props = defineProps<DataTableRowActionsProps<any>>();
const router = useRouter();
const { showDialog, dialogMessage, handleDelete, closeDialog } =
  useDeleteHandler();

const rowId = props.row.original._id
  ? props.row.original._id
  : props.row.original.id;

const navigateTo = (route: string) => {
  router.push(route);
};
const deleteItem = async (rowId: number) => {
  await handleDelete(() => props.deleteFunction(rowId));
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
      <DropdownMenuItem @click="navigateTo(props.viewRoute + '/' + rowId)">
        Visualiser
      </DropdownMenuItem>
      <DropdownMenuItem @click="navigateTo(props.editRoute + '/' + rowId)">
        Modifier
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="deleteItem(rowId)">
        Supprimer
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
