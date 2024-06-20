<!-- DataTableRowActions.vue -->
<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { computed } from "vue";
import { Ellipsis } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
  onView?: (row: Row<T>) => void;
  onEdit?: (row: Row<T>) => void;
  onDelete?: (row: Row<T>) => void;
}

const props = defineProps<DataTableRowActionsProps<any>>();

const handleView = () => {
  if (props.onView) props.onView(props.row);
};

const handleEdit = () => {
  if (props.onEdit) props.onEdit(props.row);
};

const handleDelete = () => {
  if (props.onDelete) props.onDelete(props.row);
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
      <DropdownMenuItem @click="handleView">Visualiser</DropdownMenuItem>
      <DropdownMenuItem @click="handleEdit">Modifier</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleDelete">
        Delete
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
