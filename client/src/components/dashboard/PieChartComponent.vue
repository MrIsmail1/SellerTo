<script lang="ts" setup>
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { Calculator, Store, Users, WalletMinimal, X } from "lucide-vue-next";
import { computed, defineProps, ref, watch } from "vue";
import { Pie } from "vue-chartjs";
import Button from "../ui/button/Button.vue";

ChartJS.register(Tooltip, Legend, ArcElement);

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  dataType: {
    type: String,
    required: true,
  },
});

const pieColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

props.chartData.datasets.forEach((dataset) => {
  dataset.backgroundColor = pieColors;
});

const emit = defineEmits(["remove"]);

const options = ref({
  plugins: {
    legend: {
      display: true,
      position: "bottom", // Set the legend position to bottom
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});

const iconComponents = {
  Calculator: Calculator,
  Store: Store,
  WalletMinimal: WalletMinimal,
  Users: Users,
};

const IconComponent = computed(() => iconComponents[props.icon]);

watch(props.chartData, (newData) => {
  chartData.value = newData;
});
</script>

<template>
  <div
    class="relative bg-transparent border border-accent-200 rounded-lg p-3 flex flex-col shadow-lg"
  >
    <Button
      class="absolute -top-3 right-2 p-1 bg-transparent hover:bg-transparent"
      @click="$emit('remove')"
    >
      <X class="w-4 h-4 text-text-100" />
    </Button>
    <div class="flex items-center gap-x-4">
      <span class="bg-bg-200 rounded-full p-3 ml-2">
        <component :is="IconComponent" class="text-accent-100" />
      </span>
      <div class="flex flex-col items-center">
        <span class="text-text-200 text-md">{{ dataType }}</span>
      </div>
    </div>
    <div class="w-full h-56 pt-3 px-5">
      <Pie :data="chartData" :options="options" />
    </div>
  </div>
</template>

<style scoped>
canvas {
  max-width: 100%;
  height: 100%;
}
</style>
