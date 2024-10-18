<template>
  <ClientOnly>
    <Multiselect
      ref="multiSelectEl"
      v-model="value"
      :disabled="disabled"
      :options="options"
      :track-by="trackBy"
      :label="label"
      :searchable="searchable"
      :allow-empty="allowEmpty"
      :show-labels="showLabels"
      :hide-selected="hideSelected"
      :preselect-first="true"
      placeholder="Izberi"
      :preventAutofocus="true"
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
  import type { MaybeElementRef } from "@vueuse/core";
  import Multiselect from "vue-multiselect";

  const value = defineModel();
  const multiSelectEl = ref<InstanceType<typeof Multiselect> | null>(null);
  onClickOutside(multiSelectEl as MaybeElementRef, () =>
    multiSelectEl.value?.deactivate()
  );

  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false,
    },
    options: null,
    trackBy: String,
    label: String,
    searchable: {
      type: Boolean,
      default: false,
    },
    allowEmpty: {
      type: Boolean,
      default: false,
    },
    showLabels: {
      type: Boolean,
      default: false,
    },
    hideSelected: {
      type: Boolean,
      default: true,
    },
  });

  const emit = defineEmits<{
    select: [value: any, id: any];
    remove: [value: any, id: any];
  }>();
</script>

<style>
  .multiselect__content-wrapper {
    width: 200px !important;
  }

  .multiselect__content {
    position: static !important;
    z-index: 9999 !important;
  }

  .multiselect {
    min-height: 0px;
  }

  .multiselect__single,
  .multiselect__option {
    font-size: 0.875rem !important ;
    line-height: 1.5rem !important ;
    min-height: 0 !important;
  }

  .multiselect__single {
    margin: 0 !important;
  }

  .multiselect__option {
    padding: 0.5rem !important;
  }

  .multiselect__tags {
    min-height: 0px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 7.5px;
  }

  .multiselect__select {
    height: 40px !important;
  }
</style>
