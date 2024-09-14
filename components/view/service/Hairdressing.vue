<template>
  <div>hairdressing</div>
</template>

<script lang="ts" setup>
  import type { ApiService, ApiServiceTypeHairdressing } from "~/types/service";

  const props = defineProps({
    service: {
      type: Object as PropType<ApiService & ApiServiceTypeHairdressing>,
      required: true,
    },
  });
</script>

<style></style>
