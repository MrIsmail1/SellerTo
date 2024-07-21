<script setup lang="ts">
import LineChartCardComponent from "@/components/dashboard/LineChartCardComponent.vue";
import LineChartComponent from "@/components/dashboard/LineChartComponent.vue";
import PieChartComponent from "@/components/dashboard/PieChartComponent.vue";
import WidgetModalComponent from "@/components/dashboard/WidgetModalComponent.vue";
import Button from "@/components/ui/button/Button.vue";
import { Plus, Store, WalletMinimal } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { GridItem, GridLayout } from "vue3-grid-layout-next";

const isModalOpen = ref(false);
const layout = ref([]);

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const icons = {
  "Nombre de commandes": "WalletMinimal",
  "Meilleur ventes": "WalletMinimal",
  "Revenue totales": "Store",
  Stock: "Store",
  "Nouveaux clients": "Users",
};

const initialSizes = {
  LineChartCardComponent: { colNum: 3, rowHeight: 4 },
  LineChartComponent: { colNum: 15, rowHeight: 10 },
  PieChartComponent: { colNum: 5, rowHeight: 10 },
};

const mockData = {
  labels: ["2010", "2011", "2012", "2013", "2014", "2015", "2016"],
  datasets: [
    {
      label: "Mock Sales Data",
      data: [10, -30, -50, -60, -100, -120, -201, -300],
    },
  ],
};

const saveLayoutToLocalStorage = () => {
  localStorage.setItem("dashboardLayout", JSON.stringify(layout.value));
};

const addChart = (chartData) => {
  const { values, data } = chartData;
  const chartType = getChartComponent(values.chartType, values.displayMode);
  const { colNum, rowHeight } = initialSizes[chartType.__name] || {
    colNum: 12,
    rowHeight: 5,
  };

  const newChart = {
    i: `chart-${layout.value.length + 1}`,
    x: 0,
    y: 0,
    w: colNum,
    h: rowHeight,
    type: values.chartType,
    displayMode: values.displayMode,
    data: mockData,
    icon: icons[values.dataType],
    dataType: values.dataType,
  };
  layout.value.push(newChart);
  saveLayoutToLocalStorage();
};

const removeWidget = (id) => {
  layout.value = layout.value.filter((item) => item.i !== id);
  saveLayoutToLocalStorage();
};

const loadLayoutFromLocalStorage = () => {
  const savedLayout = localStorage.getItem("dashboardLayout");
  if (savedLayout) {
    layout.value = JSON.parse(savedLayout);
  }
};

onMounted(() => {
  loadLayoutFromLocalStorage();
});

const getChartComponent = (type, displayMode) => {
  if (type === "Ligne") {
    return displayMode == "Carte" ? LineChartCardComponent : LineChartComponent;
  }
  if (type === "Camembert") {
    return displayMode == "Carte" && PieChartComponent;
  }
  return LineChartComponent;
};

watch(layout, saveLayoutToLocalStorage, { deep: true });
</script>

<template>
  <div class="flex justify-between w-full">
    <span class="flex flex-col">
      <span class="text-xl font-bold text-text-100">Tableau de bord</span>
      <span class="text-md text-text-200">
        Surveillez vos revenus de ventes ici.
      </span>
    </span>
    <Button
      class="button border bg-transparent text-text-100 border-accent-200 text-md font-medium hover:bg-primary-200 hover:text-white"
      @click="openModal"
    >
      <Plus class="icon w-6 h-6 mr-2 text-primary-200" />
      Widget
    </Button>
  </div>

  <div class="flex flex-col mt-6 gap-6">
    <GridLayout
      :layout="layout"
      :col-num="14"
      :row-height="20"
      :is-draggable="true"
      :is-resizable="true"
      :vertical-compact="true"
      :use-css-transforms="true"
    >
      <GridItem
        v-for="(item, index) in layout"
        :key="item.i"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
      >
        <component
          :is="getChartComponent(item.type, item.displayMode)"
          :chartData="item.data"
          :dataType="item.dataType"
          @remove="removeWidget(item.i)"
          :icon="item.icon"
        />
      </GridItem>
    </GridLayout>
  </div>

  <WidgetModalComponent
    v-if="isModalOpen"
    @close="closeModal"
    @chartDataFetched="addChart"
  />
</template>
