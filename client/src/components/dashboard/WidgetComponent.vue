<script setup lang="ts">
/* import BarChartComponent from "@/components/common/BarChartComponent.vue"; */
import LineChartComponent from "@/components/dashboard/LineChartComponent.vue";
import Button from "@/components/ui/button/Button.vue";
import { defineEmits, defineProps, ref, watch } from "vue";

const props = defineProps({
  id: String,
  type: String,
  data: {
    type: Array,
    default: () => [],
  },
});

const emits = defineEmits(["remove"]);

const chartData = ref(props.data);
const componentType = ref("LineChartComponent");

watch(
  () => props.data,
  (newData) => {
    chartData.value = newData;
  }
);

watch(
  () => props.type,
  (newType) => {
    componentType.value =
      newType === "barChart" ? "BarChartComponent" : "LineChartComponent";
  }
);

const remove = () => {
  emits("remove", props.id);
};
</script>
<template>
  <div class="widget">
    <div class="header">
      <span>Widget {{ id }}</span>
      <Button @click="remove"></Button>
    </div>
    <component :is="componentType" :chartData="chartData" />
  </div>
</template>
