<script lang="ts" setup>
import {
  Calculator,
  ShoppingCart,
  Store,
  Users,
  WalletMinimal,
  X,
} from "lucide-vue-next";
import { computed, defineProps } from "vue";
import Button from "../ui/button/Button.vue";

const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  dataType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["remove"]);

const iconComponents = {
  Calculator,
  Store,
  WalletMinimal,
  Users,
  ShoppingCart,
};

const IconComponent = computed(() => iconComponents[props.icon]);
</script>

<template>
  <div
    class="relative bg-transparent border border-accent-200 rounded-lg p-5 flex items-center shadow-lg z-50"
  >
    <Button
      class="absolute -top-3 right-2 p-1 bg-transparent hover:bg-transparent"
      @click="$emit('remove')"
    >
      <X class="w-4 h-4 text-text-100" />
    </Button>
    <div class="flex items-center gap-x-4">
      <span class="bg-bg-200 rounded-full p-3">
        <component :is="IconComponent" class="text-accent-100" />
      </span>
      <div class="flex flex-col">
        <span class="text-text-200 text-sm text-nowrap">{{ dataType }}</span>
        <span class="text-accent-100 text-xl font-bold">{{
          amount == null ? 0 : amount
        }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
canvas {
  max-width: 100%;
  height: 100%;
}
</style>
