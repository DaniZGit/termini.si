<template>
  <div>fitness</div>
</template>

<script lang="ts" setup>
  import type { ApiService, ApiServiceTypeFitness } from "~/types/service";

  const props = defineProps({
    service: {
      type: Object as PropType<ApiService & ApiServiceTypeFitness>,
      required: true,
    },
  });
</script>

<style></style>
