<script setup lang="ts">
import { type HTMLAttributes, computed } from 'vue'
import { DialogTitle, type DialogTitleProps } from 'radix-vue'
import { cn } from '@/lib/utils'
import Hr from '@/components/common/HrComponent.vue'

const props = defineProps<DialogTitleProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = computed(() => {
  const { class: _, ...delegated } = props

  return delegated
})
</script>

<template>
  <DialogTitle
    :class="cn('text-lg font-semibold text-slate-950 dark:text-slate-50 text-center', props.class)"
    v-bind="delegatedProps"
  >
  
    <slot />
  </DialogTitle>
  <Hr/>
</template>
