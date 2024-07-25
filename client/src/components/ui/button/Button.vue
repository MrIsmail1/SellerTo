<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Primitive, type PrimitiveProps } from 'radix-vue'
import { cn } from '@/lib/utils'

interface Props extends PrimitiveProps {
  variant?: 'default' | 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  variant: 'default',
  size: 'medium',
})

const buttonVariants = ({ variant, size }: { variant: string; size: string }) => {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      'whitespace-nowrap font-medium ring-offset-white focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300 bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 h-10 px-4 py-2 mt-2 mb-auto': variant === 'default',
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
      'bg-white text-black hover:bg-slate-100 border-black focus:ring-black border-[1px] border-solid border-black': variant === 'secondary',
      'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500': variant === 'danger',
    },
    {
      'px-2.5 py-1.5 text-xs': size === 'small',
      'px-4 py-2 text-sm': size === 'medium',
      'px-6 py-3 text-md': size === 'large',
      'px-6 py-3 text-lg': size === 'xl',
    }
  )
}
</script>

<template>
  <Primitive
    :as="as"
    :as-child="asChild"
    :class="cn(buttonVariants({ variant, size }), props.class)"
  >
    <slot />
  </Primitive>
</template>

<style scoped>
.inline-flex {
  display: inline-flex;
}
</style>
