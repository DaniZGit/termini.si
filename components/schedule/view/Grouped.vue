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
    <div class="grid grid-flow-col gap-y-4 overflow-auto divide-x-2">
      <div
        v-for="(groups, date) in getGroupedTimetables"
        class="flex flex-col"
        :style="`width: ${slotCellColWidth * groups.length}px;`"
      >
        <div
          class="flex flex-col justify-center items-center text-center mx-0.5"
          :style="`height: ${headerColHeight}px;`"
        >
          <h4
            class="font-semibold text-secondary whitespace-pre-line capitalize"
          >
            {{ format(date, "EEEE", { locale: sl }) }}
          </h4>
          <!-- <h5
              class="text-sm font-semibold text-secondary whitespace-pre-line"
            >
              {{ date }}
            </h5> -->
        </div>
        <div
          v-for="(groupedTimetables, groupNum) in groups"
          class="flex flex-col justify-start text-center"
        >
          <div v-for="timetable in groupedTimetables" class="grow relative">
            <ItemSlot
              v-for="(slot, i) in timetable.slots"
              :key="`${timetable.title}-${slot.time_start}-${slot.time_end}`"
              :slot="slot"
              :title="timetable.service?.title"
              :height="
                getSlotHeightAcrossTimetables(
                  timetables,
                  slot,
                  slotCellRowHeight
                )
              "
              :top-offset="
                getTopOffsetBasedOnTimetables(
                  timetables,
                  slot,
                  slotCellRowHeight
                )
              "
              :width="slotCellColWidth"
              :left-offset="slotCellColWidth * groupNum"
              @selected="(slot: TimetableSlot) => emit('slotSelect', slot)"
              @unselected="(slot: TimetableSlot) => emit('slotUnselect', slot)"
            ></ItemSlot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { format, parse } from "date-fns";
  import { sl } from "date-fns/locale";
  import type { Timetable, TimetableSlot } from "~/types/misc";

  const timetables = defineModel("timetables", {
    type: Array as PropType<Array<Timetable>>,
    required: true,
  });

  const emit = defineEmits<{
    slotSelect: [slot: TimetableSlot];
    slotUnselect: [slot: TimetableSlot];
  }>();

  const { width, height } = useWindowSize();
  const headerColHeight = computed(() =>
    getHeaderColHeightAcrossTimetables(timetables.value)
  );
  const slotCellColWidth = computed(
    () =>
      getSlotCellColWidthAcrossTimetables(timetables.value) +
      50 * (width.value / 1000)
  );
  const slotCellRowHeight = computed(
    () =>
      getSlotCellColHeightAcrossTimetables(timetables.value) +
      25 * (height.value / 1500)
  );

  const getGroupedTimetables = computed(() => {
    const groupedTimetables: Record<string, Timetable[][]> = {};
    timetables.value.forEach((timetable) => {
      if (!(timetable.date.toString() in groupedTimetables)) {
        groupedTimetables[timetable.date.toString()] = [[timetable]];
      } else {
        // check in every group if there is free space for this timeslot
        let foundAFreeGroup = false;
        for (
          let i = 0;
          i < groupedTimetables[timetable.date.toString()].length;
          i++
        ) {
          const group = groupedTimetables[timetable.date.toString()][i];
          const timetablesIntersect = group.some((groupTimetable) => {
            const doesIntersect = timetable.slots.some((slot) =>
              groupTimetable.slots.some((groupSlot) =>
                doSlotsIntersect(slot, groupSlot)
              )
            );
            if (doesIntersect) return true; // check next group

            return false;
          });

          if (timetablesIntersect) continue;
          else {
            group.push(timetable);
            foundAFreeGroup = true;
            break;
          }
        }

        // if timetable couldnt join a group, create a new group
        if (!foundAFreeGroup)
          groupedTimetables[timetable.date.toString()].push([timetable]);
      }
    });

    return groupedTimetables;
  });
</script>

<style></style>
