<template>
  <div class="flex flex-col overflow-y-auto text-neutral-darkGray">
    <div v-for="(groupedSlots, date) in getGroupedSlots()" :key="date">
      <div
        v-for="(slots, courtTitle) in groupedSlots"
        :key="courtTitle"
        class="flex flex-col pb-2"
      >
        <div class="flex gap-x-2">
          <h2 class="text-lg font-semibold">
            {{ courtTitle }}
          </h2>
          <span> ({{ getDateNice(date) }}) </span>
        </div>
        <div
          v-for="slot in slots"
          :key="slot.id"
          class="flex justify-between pl-2"
        >
          <div class="flex items-center gap-x-1">
            <span>
              {{ slot.start_time.substring(0, 5) }}
              -
              {{ slot.end_time.substring(0, 5) }}
            </span>
          </div>
          <div class="flex items-center gap-x-1">
            <span>
              {{ getPriceNice(slot.price) }}
            </span>
            <Icon
              v-if="removable"
              name="i-mdi:close-thick"
              size="20"
              class="text-neutral-gray"
              @click="onRemove(slot)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiTimeSlot } from "~/types/court";

  const props = defineProps({
    timeSlots: Array as PropType<ApiTimeSlot[]>,
    removable: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits<{
    remove: [slot: ApiTimeSlot];
  }>();

  const getGroupedSlots = () => {
    if (!props.timeSlots) return {};

    let groupedSlots: Record<string, Record<string, ApiTimeSlot[]>> = {};

    console.log(props.timeSlots);

    props.timeSlots.forEach((slot) => {
      if (groupedSlots[slot.schedule_day.date]) {
        if (
          groupedSlots[slot.schedule_day.date][slot.schedule_day.court.title]
        ) {
          groupedSlots[slot.schedule_day.date][
            slot.schedule_day.court.title
          ].push(slot);
        } else {
          groupedSlots[slot.schedule_day.date][slot.schedule_day.court.title] =
            [slot];
        }
      } else {
        groupedSlots[slot.schedule_day.date] = {};
        groupedSlots[slot.schedule_day.date][slot.schedule_day.court.title] = [
          slot,
        ];
      }
    });

    let sorted = Object.fromEntries(
      Object.entries(groupedSlots).sort(([a], [b]) => {
        if (a < b) return -1;
        else if (a > b) return 1;
        return 0;
      })
    );

    Object.keys(sorted).forEach((key) => {
      Object.keys(sorted[key]).forEach((courtKey) => {
        sorted[key][courtKey] = sorted[key][courtKey].sort((a, b) => {
          if (a.start_time < b.end_time) return -1;
          else if (a.start_time > b.start_time) return 1;
          return 0;
        });
      });
    });

    console.log(sorted);

    return sorted;
  };

  const onRemove = (slot: ApiTimeSlot) => {
    emit("remove", slot);
  };
</script>

<style></style>
