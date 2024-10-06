<template>
  <div class="flex gap-x-1">
    <div>
      <div class="grid grid-flow-row overflow-auto border-r-2 border-secondary">
        <Icon
          name="i-ic:baseline-access-time"
          size="26"
          class="m-auto text-secondary"
          :style="`height: ${headerColHeight}px;`"
        />
        <div
          v-for="i in getTimestampsAcrossTimetables(timetables)"
          class="flex justify-center items-start px-2 text-neutral-darkGray font-medium"
          :style="`height: ${slotCellRowHeight}px;`"
        >
          <span class="text-center text-base -translate-y-3">
            {{
              minsToTime(
                getMinTimeAcrossTimetables(timetables) +
                  i * getMinSlotDurationAcrossTimetables(timetables)
              )
            }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="grid grid-flow-col gap-y-4 overflow-auto divide-x-2"
      :style="`grid-auto-columns: ${slotCellColWidth}px;`"
    >
      <div
        v-for="timetable in getSortedTimetables"
        :key="timetable.title"
        class="flex flex-col justify-start text-center"
      >
        <div
          class="flex flex-col justify-center items-center text-center mx-0.5"
          :style="`height: ${headerColHeight}px;`"
        >
          <h4 class="font-semibold text-secondary whitespace-pre-line">
            {{ timetable.title }}
          </h4>
          <h5
            class="text-sm font-semibold text-secondary whitespace-pre-line capitalize"
          >
            ( {{ format(timetable.date, "EEEE", { locale: sl }) }} )
          </h5>
          <select
            v-if="
              timetable.service?.variants &&
              timetable.service?.variants.length > 1
            "
            class="border-2 rounded-full px-2 text-sm w-full"
            @change="emit('select', $event, timetable.id)"
          >
            <option
              v-for="(variant, i) in timetable.service.variants"
              :key="variant.id"
              :value="variant.id"
              :selected="i == 0"
            >
              {{ variant.title }}
            </option>
          </select>
        </div>
        <div class="grow relative">
          <ItemSlot
            v-for="(slot, i) in timetable.slots"
            :key="`${timetable.title}-${slot.time_start}-${slot.time_end}`"
            :slot="slot"
            status="available"
            :top-offset="
              getTopOffsetBasedOnTimetables(timetables, slot, slotCellRowHeight)
            "
            :height="
              getSlotHeightAcrossTimetables(timetables, slot, slotCellRowHeight)
            "
            @selected="(slot: TimetableSlot) => emit('slotSelect', slot)"
            @unselected="(slot: TimetableSlot) => emit('slotUnselect', slot)"
          ></ItemSlot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { format } from "date-fns";
  import { sl } from "date-fns/locale";
  import type { Timetable, TimetableSlot } from "~/types/misc";

  const timetables = defineModel("timetables", {
    type: Array as PropType<Array<Timetable>>,
    required: true,
  });

  const emit = defineEmits<{
    select: [event: Event, id: string];
    slotSelect: [slot: TimetableSlot];
    slotUnselect: [slot: TimetableSlot];
  }>();

  const slotCellRowHeight = 75; // in pixels
  const slotCellColWidth = 120; // in pixels
  const headerColHeight = computed(() => {
    const timetableWithManyVariants = timetables.value.find(
      (timetable) =>
        timetable.service?.variants && timetable.service.variants.length > 1
    );
    if (timetableWithManyVariants) return 75;

    return 50;
  });

  const getSortedTimetables = computed(() => {
    return timetables.value.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      if (aDate.getTime() < bDate.getTime()) return -1;
      else if (aDate.getTime() > bDate.getTime()) return 1;
      return 0;
    });
  });
</script>

<style></style>
