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
          class="flex flex-col justify-center items-center text-center mx-0.5 grow-0"
          :style="`height: ${headerColHeight}px;`"
        >
          <div>
            <h4 class="font-semibold text-secondary whitespace-pre-line">
              {{ timetable.title }}
            </h4>
            <h5
              class="text-sm font-semibold text-secondary whitespace-pre-line capitalize"
            >
              ( {{ format(timetable.date, "EEEE", { locale: sl }) }} )
            </h5>
          </div>
          <ClientOnly>
            <UiMultiSelect
              :disabled="cartStore.addToCartStatus == 'pending'"
              :options="timetable.service?.variants"
              track-by="id"
              label="title"
              @select="(selectedVariant: ApiVariant, id: number) => emit('select', selectedVariant, timetable.id)"
              @remove="(removedVariant: ApiVariant, id: number) => emit('remove', removedVariant, timetable.id)"
            >
              <template #option="props">
                <span>{{ props.option.title }}</span>
              </template>
              <template #singleLabel="props">
                <span class="line-clamp-1">{{ props.option.title }}</span>
              </template>
            </UiMultiSelect>
          </ClientOnly>
        </div>
        <div class="grow relative">
          <ItemSlot
            v-for="(slot, i) in timetable.slots"
            :key="`${timetable.title}-${slot.time_start}-${slot.time_end}`"
            :slot="slot"
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
  import { format, isAfter, isBefore } from "date-fns";
  import { sl } from "date-fns/locale";
  import type { Timetable, TimetableSlot } from "~/types/misc";
  import type { ApiVariant } from "~/types/service";

  const cartStore = useCartStore();

  const timetables = defineModel("timetables", {
    type: Array as PropType<Array<Timetable>>,
    required: true,
  });

  const emit = defineEmits<{
    select: [variant: ApiVariant, timetableId: string];
    remove: [variant: ApiVariant, timetableId: string];
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

  const getSortedTimetables = computed(() => {
    return timetables.value.sort((a, b) => {
      const aDate = new Date(a.date);
      const bDate = new Date(b.date);
      if (isBefore(aDate, bDate)) return -1;
      else if (isAfter(aDate, bDate)) return 1;
      return 0;
    });
  });
</script>

<style scoped></style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
