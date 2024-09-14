<template>
  <div>
    <div>
      <div v-if="slotsExist" class="flex gap-x-1">
        <div>
          <div
            class="grid grid-flow-row overflow-auto border-r-2 border-secondary"
          >
            <Icon
              name="i-ic:baseline-access-time"
              size="26"
              class="m-auto text-secondary"
              :style="`height: ${slotHeaderRowHeight}px;`"
            />
            <div
              v-for="i in getTimestamps()"
              class="flex justify-center items-start px-2 text-neutral-darkGray font-medium"
              :style="`height: ${slotCellRowHeight}px;`"
            >
              <span class="text-center text-base -translate-y-3">
                {{ minsToTime(getMinTime() + i * getMinSlotDuration()) }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="grid grid-flow-col gap-y-4 overflow-auto"
          :style="`grid-auto-columns: ${slotCellColWidth}px;`"
        >
          <div
            v-for="(schedule, title) in schedules"
            :key="schedule.id"
            class="flex flex-col justify-start text-center"
          >
            <div
              class="flex justify-center items-center"
              :style="`height: ${slotHeaderRowHeight}px;`"
            >
              <h4 class="font-semibold text-secondary">
                {{ title }}
              </h4>
            </div>
            <div class="grow relative">
              <ItemSlot
                v-for="(slot, i) in getSortedSlots(schedule)"
                :key="slot.id"
                :slot="slot"
                :top-offset="getSlotTopOffset(slot)"
                :height="getSlotHeight(slot)"
                @selected="onSlotSelected"
                @unselected="onSlotUnselected"
              ></ItemSlot>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <h4 class="text-lg font-medium text-neutral-darkGray">
          Trenutno ni terminov za izbrani datum
        </h4>
        <Icon
          name="i-ic:baseline-calendar-month"
          size="32"
          class="text-neutral-darkGray"
        />
      </div>
    </div>

    <!-- Login Required Modal -->
    <ModalLoginRequired
      v-model:visible="showLoginRequiredModal"
    ></ModalLoginRequired>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiSchedule, ApiSlot } from "~/types/schedule";

  const { user } = useDirectusAuth();
  const schedules = defineModel("schedules", {
    type: Object as PropType<Record<string, ApiSchedule>>,
    required: true,
  });

  onMounted(async () => {
    // realtime data - maybe can move this outside the onmounted hook - https://github.com/Intevel/nuxt-directus/issues/264
    const client = useDirectusRealtime();

    await client.connect();

    const { subscription } = await client.subscribe("slots", {
      event: "update",
      query: {
        fields: ["id", "available", "date.id"],
      },
    });

    for await (const item of subscription) {
      console.log("slot update", item);
      if (!item.data || !schedules.value) continue;

      const changedSlots = item.data as ApiSlot[];
      changedSlots.forEach((changedSlot) => {
        Object.entries(schedules.value).forEach(([title, schedule]) => {
          const date = schedule.dates?.find(
            (date) => date.id == changedSlot.date.id
          );
          const slot = date?.slots?.find((slot) => slot.id == changedSlot.id);
          if (slot) slot.available = changedSlot.available;
        });
      });
    }
  });

  const slotsExist = computed(() => {
    if (!schedules.value) return false;
    const slotsAmount = Object.entries(schedules.value).reduce(
      (sum, [title, schedule]) => {
        if (!schedule.dates?.length || !schedule.dates[0].slots?.length)
          return sum;
        return sum + schedule.dates[0].slots.length;
      },
      0
    );

    return slotsAmount > 0;
  });

  const showLoginRequiredModal = ref(false);
  const onSlotSelected = (slot: ApiSlot) => {
    // if user is not logged in, display "log in first" modal
    if (!user.value) {
      showLoginRequiredModal.value = true;
      return;
    }

    // add to cart store
    // cartStore.slots.push(timeSlot);
  };

  const onSlotUnselected = () => {
    console.log("unselected");
  };

  // schedule table helper functions
  const slotHeaderRowHeight = 50; // in pixels
  const slotCellRowHeight = 75; // in pixels
  const slotCellColWidth = 120; // in pixels
  const getTimestamps = () => {
    const minMaxTimeDiff = (getMaxTime() - getMinTime()) / getMinSlotDuration();

    return [...Array(Math.floor(minMaxTimeDiff) + 1).keys()];
  };

  // returns min time across all schedules (in minutes)
  const getMinTime = () => {
    let minTime = 24 * 60; // in minutes

    Object.entries(schedules.value).forEach(([title, schedule]) => {
      if (!schedule.dates?.length) return;

      schedule.dates[0].slots?.forEach((slot) => {
        const slotStartTimeMins = timeToMins(slot.start_time);
        if (slotStartTimeMins < minTime) minTime = slotStartTimeMins;
      });
    });

    return minTime;
  };

  // returns max time across all schedules (in minutes)
  const getMaxTime = () => {
    let maxTime = 0; // in minutes

    Object.entries(schedules.value).forEach(([title, schedule]) => {
      if (!schedule.dates?.length) return;

      schedule.dates[0].slots?.forEach((slot) => {
        const slotStartTimeMins = timeToMins(slot.end_time);
        if (slotStartTimeMins > maxTime) maxTime = slotStartTimeMins;
      });
    });

    return maxTime;
  };

  // returns min slot duration across all schedules (in minutes)
  const getMinSlotDuration = () => {
    let minDuration = 24 * 60; // 24h -> mins

    Object.entries(schedules.value).forEach(([title, schedule]) => {
      if (!schedule.dates?.length) return;

      schedule.dates[0].slots?.forEach((slot) => {
        const slotStartTimeMins = timeToMins(slot.start_time);
        const slotEndTimeMins = timeToMins(slot.end_time);
        if (slotEndTimeMins - slotStartTimeMins < minDuration)
          minDuration = slotEndTimeMins - slotStartTimeMins;
      });
    });

    return minDuration;
  };

  const getSlotTopOffset = (slot: ApiSlot) => {
    let slotMinutes = timeToMins(slot.start_time);
    let minTimeMinutes = getMinTime();

    const slotHours = Math.floor(slotMinutes / 60);
    const minTimeHours = Math.floor(minTimeMinutes / 60);

    slotMinutes = slotMinutes % 60;
    minTimeMinutes = minTimeMinutes % 60;

    const topOffset =
      (slotHours - minTimeHours + slotMinutes / 60) *
      slotCellRowHeight *
      (60 / getMinSlotDuration());

    return topOffset;
  };

  const getSlotHeight = (slot: ApiSlot) => {
    const startTimeMins = timeToMins(slot.start_time);
    const endTimeMins = timeToMins(slot.end_time);

    const slotDuration = endTimeMins - startTimeMins;
    const minSlotDuration = getMinSlotDuration();

    const topOffset = (slotDuration / minSlotDuration) * slotCellRowHeight;

    return topOffset;
  };

  const getSortedSlots = (schedule: ApiSchedule) => {
    if (!schedule.dates?.length) return;

    return schedule.dates[0].slots?.sort((a, b) => {
      if (a.start_time < b.start_time) return -1;
      else if (a.start_time > b.start_time) return 1;
      return 0;
    });
  };
</script>

<style></style>
