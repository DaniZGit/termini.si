<template>
  <div class="flex justify-between items-center group py-2">
    <div class="flex flex-col">
      <span class="text-secondary text-lg font-semibold">
        {{ $t("transaction-type") }}
      </span>
      <span class="font-semibold"
        >{{ getDateNice(transaction?.date_created ?? "") }}
        ob
        {{ getTimeNice(transaction?.date_created ?? "") }}</span
      >
    </div>
    <Icon
      name="i-ic:round-keyboard-arrow-right"
      size="26"
      class="self-end group-hover:translate-x-2 transition-transform"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { ApiTransaction } from "~/types/transaction";

  const props = defineProps({
    transaction: {
      type: Object as PropType<ApiTransaction>,
    },
  });
</script>

<style></style>
