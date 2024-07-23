<script setup lang="ts">
import LineChartCardComponent from "@/components/dashboard/LineChartCardComponent.vue";
import LineChartComponent from "@/components/dashboard/LineChartComponent.vue";
import PieChartComponent from "@/components/dashboard/PieChartComponent.vue";
import WidgetModalComponent from "@/components/dashboard/WidgetModalComponent.vue";
import Button from "@/components/ui/button/Button.vue";
import { useOrdersStore } from "@/stores/orderStore";
import { useWidgetsStore } from "@/stores/widgetStore";
import { Plus } from "lucide-vue-next";
import { onMounted, ref, watch } from "vue";
import { GridItem, GridLayout } from "vue3-grid-layout-next";

const isModalOpen = ref(false);
const layout = ref([]);
const orderStore = useOrdersStore();
const widgetStore = useWidgetsStore();

const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const icons = {
  count_products: "WalletMinimal",
  ca_product: "WalletMinimal",
  count_orders: "Store",
  ca_orders: "Store",
  count_users: "Users",
};

const initialSizes = {
  LineChartCardComponent: { colNum: 4, rowHeight: 4 },
  LineChartComponent: { colNum: 15, rowHeight: 9 },
  PieChartComponent: { colNum: 5, rowHeight: 11 },
};
const dataTypes = {
  count_products: "Total produits",
  ca_product: "Chiffre d'affaire produit",
  count_orders: "Total commandes",
  ca_orders: "Chiffre d'affaire commandes",
  count_users: "Total utilisateurs",
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

const removeWidget = (id) => {
  widgetStore.deleteWidget(id);
  layout.value = layout.value.filter((item) => item.i !== id);
  saveLayoutToLocalStorage();
};

const loadLayoutFromLocalStorage = () => {
  const savedLayout = localStorage.getItem("dashboardLayout");
  if (savedLayout) {
    layout.value = JSON.parse(savedLayout);
  }
};

const fetchWidgetsFromStore = async () => {
  await orderStore.getDashboardData();
  const widgets = orderStore.dashboardData;
  if (!widgets) return;
  layout.value = widgets.map((item, index) => {
    const widget = item.widget;
    const displayType = widget.displayType == "KPI" ? "KPI" : widget.chartType;
    const amount = widget.KPIdata > 0 ? widget.KPIdata : 0;
    return {
      i: widget._id,
      x: widget.x,
      y: widget.y,
      w: initialSizes[getChartComponent(displayType).__name]?.colNum,
      h: initialSizes[getChartComponent(displayType).__name]?.rowHeight,
      type: displayType,
      data: mockData,
      icon: icons[widget.dataType],
      dataType: dataTypes[widget.dataType],
      amount: amount,
    };
  });
  console.log(widgets);
  saveLayoutToLocalStorage();
};

const updateWidgetPositionInStore = async (layout) => {
  if (!layout) return;
  for (const item of layout) {
    const widgetId = item.i;
    const x = item.x;
    const y = item.y;
    await widgetStore.updateWidget(widgetId, { x, y });
  }
};

onMounted(() => {
  loadLayoutFromLocalStorage();
  fetchWidgetsFromStore();
});

const getChartComponent = (type) => {
  if (type === "KPI") {
    return LineChartCardComponent;
  }
  if (type === "Ligne") {
    return LineChartComponent;
  }
  if (type === "Camembert") {
    return PieChartComponent;
  }
};

watch(
  layout,
  (newLayout) => {
    saveLayoutToLocalStorage();
    updateWidgetPositionInStore(newLayout); // Update the positions in the database
  },
  { deep: true }
);
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
      :vertical-compact="false"
      :use-css-transforms="true"
      @layout-updated="(newLayout) => updateWidgetPositionInStore(newLayout)"
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
          :is="getChartComponent(item.type)"
          :chartData="item.data"
          :dataType="item.dataType"
          @remove="removeWidget(item.i)"
          :icon="item.icon"
          :amount="item.amount"
        />
      </GridItem>
    </GridLayout>
  </div>

  <WidgetModalComponent v-if="isModalOpen" @close="closeModal" />
</template>
