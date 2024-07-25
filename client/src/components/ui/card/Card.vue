<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    :class="
      cn(
        'p-4 rounded-lg border border-slate-200 bg-white text-slate-950 shadow-sm focus-within:shadow-md hover:shadow-md overflow-hidden cursor-pointer dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>