<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DataTableToolbarProps {
  table: Table<any>;
  filterPlaceholder?: string;
  filterColumn: string;
  showResetButton?: boolean;
}

const props = defineProps<DataTableToolbarProps>();

const isFiltered = computed(
  () => props.table.getState().columnFilters.length > 0
);

const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  props.table.getColumn(props.filterColumn)?.setFilterValue(input.value);
};
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        :placeholder="props.filterPlaceholder || 'Filter...'"
        :model-value="
          (props.table
            .getColumn(props.filterColumn)
            ?.getFilterValue() as string) ?? ''
        "
        class="h-8 w-[150px] lg:w-[250px]"
        @input="handleInput"
      />
      <Button
        v-if="props.showResetButton && isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="props.table.resetColumnFilters()"
      >
        Reset
      </Button>
    </div>
  </div>
</template>
