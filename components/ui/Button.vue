<template>
  <button
    :disabled="disabled"
    class="font-bold py-2 px-4 rounded border border-primary hover:bg-accent-lightGreen hover:text-neutral-white transition duration-300 disabled:pointer-events-none disabled:bg-neutral-gray"
    :class="{
      'bg-primary text-neutral-white': color == 'primary',
      'bg-neutral-white text-neutral-darkGray': color == 'secondary',
      'bg-neutral-red text-neutral-white': color == 'error',
    }"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const props = defineProps({
    color: {
      type: String as PropType<"primary" | "secondary" | "error">,
      default: "primary",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  });
</script>

<style></style>
