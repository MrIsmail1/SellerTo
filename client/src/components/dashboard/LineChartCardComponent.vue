<script lang="ts" setup>
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Calculator, Store, Users, WalletMinimal, X } from "lucide-vue-next";
import { computed, defineProps, ref, watch } from "vue";
import { Line } from "vue-chartjs";
import Button from "../ui/button/Button.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale
);

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

const emit = defineEmits(["remove"]);

const isAscending = computed(() => {
  const data = props.chartData.datasets[0].data;
  return data[data.length - 1] > data[0];
});
const lineColor = computed(() => {
  return isAscending.value ? "rgba(75, 192, 192, 1)" : "red";
});

const options = ref({
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
    },
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      display: false,
      grid: {
        display: false,
      },
    },
  },
  elements: {
    point: {
      radius: 0,
    },
    line: {
      borderColor: lineColor.value,
      borderWidth: 2,
      tension: 0.4,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});

const iconComponents = {
  Calculator,
  Store,
  WalletMinimal,
  Users,
};

const IconComponent = computed(() => iconComponents[props.icon]);

watch(props.chartData, (newData) => {
  chartData.value = newData;
});
</script>

<template>
  <div
    class="relative bg-transparent border border-accent-200 rounded-lg p-5 flex items-center shadow-lg"
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
        <span class="text-accent-100 text-xl font-bold">3000</span>
      </div>
    </div>
    <div class="w-full h-12 pt-3 px-3">
      <Line :data="chartData" :options="options" />
    </div>
  </div>
</template>

<style scoped>
canvas {
  max-width: 100%;
  height: 100%;
}
</style>
