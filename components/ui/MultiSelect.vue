<template>
  <ClientOnly>
    <Multiselect
      v-model="value"
      :options="options"
      :multiple="multiple"
      :track-by="trackBy"
      :label="label"
      :searchable="searchable"
      :allow-empty="allowEmpty"
      :show-labels="showLabels"
      :preselect-first="true"
      placeholder="Izberi"
      @select="(selectedValue: any, id: any) => emit('select', selectedValue, id)"
      @remove="(removedValue: any, id: any) => emit('remove', removedValue, id)"
    >
      <template #option="props" name="option">
        <slot name="option" :option="props.option"> gay </slot>
        <!-- <span class="option__title">{{ props.option.title }}</span> -->
      </template>
      <template #singleLabel="props" name="singleLabel">
        <slot name="singleLabel" :option="props.option"> ha gay </slot>
        <!-- <span class="option__desc">{{ props.option.title.at(0) }}</span> -->
      </template>
    </Multiselect>
  </ClientOnly>
</template>

<script lang="ts" setup>
  import Multiselect from "vue-multiselect";

  const value = defineModel();
  const props = defineProps({
    options: null,
    multiple: Boolean,
    trackBy: String,
    label: String,
    searchable: Boolean,
    allowEmpty: Boolean,
    showLabels: Boolean,
  });

  const emit = defineEmits<{
    select: [value: any, id: any];
    remove: [value: any, id: any];
  }>();
</script>

<style></style>
