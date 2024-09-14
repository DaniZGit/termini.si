<template>
  <div>wellness</div>
</template>

<script lang="ts" setup>
  import type { ApiService, ApiServiceTypeWellness } from "~/types/service";

  const props = defineProps({
    service: {
      type: Object as PropType<ApiService & ApiServiceTypeWellness>,
      required: true,
    },
  });
</script>

<style></style>
