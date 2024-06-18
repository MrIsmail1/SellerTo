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
let viewType = ref("yearly"); // Default view type

const determineLineColor = (data) => {
  if (data.length < 2) return "rgb(75, 192, 192)";

  // Determine if the last data point is higher or lower than the first
  const isAscending = data[data.length - 1].count >= data[0].count;
  return isAscending ? "rgb(75, 192, 192)" : "rgb(192, 75, 75)"; // Ascending: green, Descending: red
};

const createChart = () => {
  if (!chartContainer.value) return;

  const labels =
    viewType.value === "monthly"
      ? props.chartData.map((item) => item.year + "-" + item.month)
      : props.chartData.map((item) => item.year);
  const lineColor = determineLineColor(props.chartData);

  const config = {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Revenus de ventes",
          data:
            viewType.value === "monthly"
              ? props.chartData.map((item) => item.count)
              : props.chartData.map((item) => item.count),
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
          display: true,
        },
        y: {
          display: true,
          beginAtZero: true,
        },
      },
      plugins: {
        legend: {
          display: true,
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  };

  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
  chartInstance.value = new Chart(chartContainer.value, config);
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

const viewMonthly = () => {
  viewType.value = "monthly";
  createChart();
};

const viewYearly = () => {
  viewType.value = "yearly";
  createChart();
};
</script>

<template>
  <div class="shadow-lg rounded-lg p-5 border border-accent-200">
    <div class="flex justify-between">
      <div class="flex items-center gap-3">
        <span class="bg-bg-200 rounded-full p-3">
          <component :is="icon" class="text-accent-100" />
        </span>
        <span class="text-text-200 text-md font-bold">{{ title }}</span>
      </div>
      <div class="flex justify-center bg-bg-200 rounded-lg mt-3 space-x-4">
        <button
          @click.stop="viewMonthly"
          :class="{
            'bg-white text-text-100 font-bold': viewType === 'monthly',
            'text-text-200 font-bold': viewType !== 'monthly',
          }"
          class="rounded px-3 py-1 focus:outline-none"
        >
          Mois
        </button>
        <button
          @click.stop="viewYearly"
          :class="{
            'bg-white text-text-100 font-bold': viewType === 'yearly',
            'text-text-200 font-bold': viewType !== 'yearly',
          }"
          class="rounded px-3 py-1 focus:outline-none"
        >
          Année
        </button>
      </div>
    </div>
    <div class="mt-5">
      <canvas ref="chartContainer" class="lg:w-4/5 h-64"></canvas>
    </div>
  </div>
</template>
