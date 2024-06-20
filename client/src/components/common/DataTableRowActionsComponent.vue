<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
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
import { useRouter } from "vue-router";

interface DataTableRowActionsProps<T> {
  row: Row<T>;
  viewRoute: string;
  editRoute: string;
  deleteRoute: string;
}

const props = defineProps<DataTableRowActionsProps<any>>();
const router = useRouter();
const navigateTo = (route: string) => {
  router.push(route);
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
        @click="navigateTo(props.viewRoute + '/' + props.row.id)"
        >Visualiser</DropdownMenuItem
      >
      <DropdownMenuItem
        @click="navigateTo(props.editRoute + '/' + props.row.id)"
        >Modifier</DropdownMenuItem
      >
      <DropdownMenuSeparator />
      <DropdownMenuItem
        @click="navigateTo(props.deleteRoute + '/' + props.row.id)"
      >
        Supprimer
        <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
