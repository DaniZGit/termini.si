<template>
  <div>
    <label :for="name" class="text-sm text-neutral-darkGray font-semibold">
      {{ label }}
    </label>
    <input
      v-model="input"
      :type="type"
      :name="name"
      :id="id"
      :placeholder="placeholder"
      class="w-full input"
    />
    <span v-if="error" class="text-xs text-neutral-red">
      {{ error }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import type { Prop, PropType } from "vue";

  const input = defineModel();

  const props = defineProps({
    label: {
      type: String,
      default: "label text",
    },
    type: {
      type: String,
      default: "text",
    },
    name: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    error: {
      type: String as PropType<String | undefined>,
      default: "",
    },
  });
</script>

<style></style>
