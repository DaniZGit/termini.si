<template>
  <div class="flex items-center gap-x-2">
    <input
      v-model="input"
      type="checkbox"
      :name="name"
      :id="id"
      :value="value"
      class="checkbox"
    />
    <label
      :for="id"
      class="text-md text-neutral-darkGray font-semibold hover:cursor-pointer"
    >
      {{ label }}
    </label>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";

  const input = defineModel();

  const props = defineProps({
    label: {
      type: String,
      default: "label text",
    },
    name: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
    },
  });
</script>

<style></style>
