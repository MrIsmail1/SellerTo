<script setup lang="ts">
import { defineProps, onMounted, ref, watch } from "vue";
import Chart from "chart.js/auto";

// Define props
const props = defineProps({
  title: String,
  amount: String,
  icon: Object,
  chartData: Array as () => { year: number; count: number }[],
});

const chartContainer = ref(null);
let chartInstance = ref(null);

const determineLineColor = (data) => {
  if (data.length < 2) return "rgb(75, 192, 192)";

  // Determine if the last data point is higher or lower than the first
  const isAscending = data[data.length - 1].count >= data[0].count;
  return isAscending ? "rgb(75, 192, 192)" : "rgb(192, 75, 75)"; // Ascending: green, Descending: red
};

const createChart = () => {
  if (!chartContainer.value) return;

  const labels = props.chartData.map((item) => item.year);
  const lineColor = determineLineColor(props.chartData);

  const config = {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Revenus de ventes",
          data: props.chartData.map((item) => item.count),
          fill: false,
          borderColor: lineColor, // Dynamic line color
          tension: 0.1,
          pointRadius: 0, // Remove the dots
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
  };

  if (chartContainer.value) {
    chartInstance.value = new Chart(chartContainer.value, config);
  }
};

onMounted(() => {
  createChart();
});

watch(
  () => props.chartData,
  () => {
    if (chartInstance.value) {
      chartInstance.value.destroy();
      createChart();
    }
  }
);
</script>

<template>
  <div
    class="bg-transparent border border-accent-200 rounded-lg p-3 flex justify-around items-center shadow-lg"
  >
    <div class="flex items-center gap-x-4">
      <span class="bg-bg-200 rounded-full p-3">
        <component :is="icon" class="text-accent-100" />
      </span>
      <div class="flex flex-col">
        <span class="text-text-200 text-sm">{{ title }}</span>
        <span class="text-accent-100 text-xl font-bold">{{ amount }}</span>
      </div>
    </div>
    <div class="mt-5">
      <canvas ref="chartContainer" class="lg:w-4/5"></canvas>
    </div>
  </div>
</template>
