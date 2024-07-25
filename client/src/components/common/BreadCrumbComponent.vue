<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from '@/components/ui/breadcrumb'
</script>

<template>
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink as-child>
          <RouterLink to="/">
            Home
          </RouterLink>
        </BreadcrumbLink>
      </BreadcrumbItem>
      <!--  -->
    </BreadcrumbList>
  </Breadcrumb>
</template>