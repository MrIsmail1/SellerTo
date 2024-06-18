<script setup lang="ts">
import { useRoute } from "vue-router";
import Button from "@/components/ui/button/Button.vue";
import { Plus } from "lucide-vue-next";
import LineChartCardComponent from "@/components/common/LineChartCardComponent.vue";
import LineChartComponent from "@/components/common/LineChartComponent.vue";

import { WalletMinimal } from "lucide-vue-next";
import { Store } from "lucide-vue-next";
import { Calculator } from "lucide-vue-next";

const route = useRoute();
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
    >
      <Plus class="icon w-6 h-6 mr-2 text-primary-200" />
      Widget
    </Button>
  </div>
  <div class="flex flex-col mt-6 gap-6">
    <div class="grid grid-cols-3 gap-3">
      <LineChartCardComponent
        title="Revenus totals"
        amount="€800.00"
        :icon="WalletMinimal"
        :chartData="[
          { year: 2010, count: 10 },
          { year: 2011, count: 20 },
          { year: 2012, count: 15 },
          { year: 2013, count: 25 },
          { year: 2014, count: 22 },
          { year: 2015, count: 30 },
          { year: 2016, count: 28 },
        ]"
      />
      <LineChartCardComponent
        title="Ventes totals"
        amount="€800.00"
        :icon="Store"
        :chartData="[
          { year: 2010, count: -10 },
          { year: 2011, count: -20 },
          { year: 2012, count: -15 },
          { year: 2013, count: -25 },
          { year: 2014, count: -22 },
          { year: 2015, count: -30 },
        ]"
      />
      <LineChartCardComponent
        title="Dépenses totals"
        amount="€800.00"
        :icon="Calculator"
        :chartData="[
          { year: 2010, count: 10 },
          { year: 2011, count: 20 },
          { year: 2012, count: 15 },
          { year: 2013, count: 25 },
          { year: 2014, count: 22 },
          { year: 2015, count: 30 },
          { year: 2016, count: 28 },
        ]"
      />
    </div>
    <div class="grid grid-cols-1 h-1/2">
      <LineChartComponent
        title="Revenus de ventes"
        amount="€800.00"
        :icon="Store"
        :chartData="[
          { year: 2010, count: 10 },
          { year: 2011, count: 20 },
          { year: 2012, count: 15 },
          { year: 2013, count: 25 },
          { year: 2014, count: 22 },
          { year: 2015, count: 30 },
          { year: 2016, count: 28 },
        ]"
      />
    </div>
  </div>
</template>

<style scoped>
.button:hover .icon {
  color: white;
}
</style>
