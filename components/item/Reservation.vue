<template>
  <div class="group py-2 text-left">
    <div class="flex flex-col">
      <div class="w-full flex justify-between items-center gap-x-2">
        <span class="text-secondary text-lg font-semibold">
          {{ reservation?.schedule_day.court.institution.title }}
        </span>
        <NuxtImg
          :src="useAssetUrl(reservation?.schedule_day.court.sport?.image)"
          class="h-6 w-auto aspect-square object-cover"
          width="100"
          height="100"
        ></NuxtImg>
      </div>
      <div class="flex justify-between">
        <div class="flex flex-col">
          <span>
            {{ reservation?.schedule_day.court.institution.address }},
            {{ reservation?.schedule_day.court.institution.city?.postal_code }}
            {{ reservation?.schedule_day.court.institution.city?.title }}</span
          >
          <span class="font-semibold"
            >{{ getDateNice(reservation?.schedule_day.date) }} ({{
              reservation?.start_time
            }}
            - {{ reservation?.end_time }})</span
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
  import type { ApiTimeSlot } from "~/types/court";

  const props = defineProps({
    reservation: {
      type: Object as PropType<ApiTimeSlot>,
    },
  });
</script>

<style></style>
