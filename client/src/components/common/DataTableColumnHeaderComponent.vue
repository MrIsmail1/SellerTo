<script setup lang="ts">
import type { Column } from "@tanstack/vue-table";
import { ArrowDownZA, ArrowUpAZ, ArrowDownUp } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ref } from "vue";

interface DataTableColumnHeaderProps {
  column: Column<any>;
  title: string;
}

const props = defineProps<DataTableColumnHeaderProps>();
const filterValue = ref<string>(
  (props.column.getFilterValue() as string) || ""
);

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  filterValue.value = input.value;
  props.column.setFilterValue(input.value);
};
</script>

<template>
  <div :class="cn('flex flex-col mb-2', $attrs.class ?? '')">
    <div
      v-if="column.getCanSort()"
      class="flex justify-start space-x-2 items-center px-4"
    >
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            variant="ghost"
            size="sm"
            class="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{{ title }}</span>
            <ArrowDownZA
              v-if="column.getIsSorted() === 'desc'"
              class="ml-2 h-4 w-4"
            />
            <ArrowUpAZ
              v-else-if="column.getIsSorted() === 'asc'"
              class="ml-2 h-4 w-4"
            />
            <ArrowDownUp v-else class="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem @click="column.toggleSorting(false)">
            <ArrowUpAZ class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem @click="column.toggleSorting(true)">
            <ArrowDownZA class="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
    <Input
      type="text"
      v-model="filterValue"
      @input="handleInput"
      placeholder="Search..."
      class="h-8 px-2 border border-gray-300 rounded-md w-52"
    />
  </div>
</template>
