<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
</script>

<template>
  <Select>
    <SelectTrigger class="w-[180px]">
      <SelectValue placeholder="Meilleures ventes" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="apple">
          Prix décroissant
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>