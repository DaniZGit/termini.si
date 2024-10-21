<template>
  <div class="group py-2 text-left">
    <div class="flex flex-col">
      <div class="w-full flex justify-between items-center gap-x-2">
        <span class="text-secondary text-lg font-semibold">
          {{ reservation?.slot.slot_definition.variant?.service?.title }}
        </span>
      </div>
      <div class="flex justify-between">
        <div class="flex flex-col">
          <span>
            {{
              reservation?.slot.slot_definition.variant?.service?.institution
                .address
            }},
            {{
              reservation?.slot.slot_definition.variant?.service?.institution
                .city?.postal_code
            }}
            {{
              reservation?.slot.slot_definition.variant?.service?.institution
                .city?.title
            }}</span
          >
          <span class="font-semibold"
            >{{ getDateNice(reservation?.slot.date ?? "") }} ({{
              reservation?.slot.time_start
            }}
            - {{ reservation?.slot.time_end }})</span
          >
        </div>
        <Icon
          name="i-ic:round-keyboard-arrow-right"
          size="26"
          class="self-end group-hover:translate-x-2 transition-transform"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiReservation } from "~/types/reservation";

  const props = defineProps({
    reservation: {
      type: Object as PropType<ApiReservation>,
    },
  });
</script>

<style></style>
