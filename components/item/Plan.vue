<template>
  <UiButton
    class="text-sm border-2 rounded-full text-neutral-darkGray bg-neutral-white"
    :color="bought ? 'primary' : 'secondary'"
  >
    {{ plan.title }}
  </UiButton>
</template>

<script lang="ts" setup>
  const { user } = useDirectusAuth();
  const props = defineProps(["plan", "bought"]);
</script>

<style></style>
