<template>
  <div>
    <div v-if="loading">
      <div
        class="w-full h-full flex flex-col items-center justify-center gap-y-8 my-16 px-4"
      >
        <h4 class="text-2xl font-medium text-secondary">
          {{ $t("schedule-loading-title") }}
        </h4>
        <UiLoader></UiLoader>
      </div>
    </div>
    <div v-else-if="slotsExist">
      <ScheduleViewDaily
        v-if="displayType == 'daily'"
        v-model:timetables="timetables"
        @select="(variant, id) => emit('select', variant, id)"
        @remove="(variant, id) => emit('remove', variant, id)"
        @slot-select="onSlotSelected"
        @slot-unselect="onSlotUnselected"
      ></ScheduleViewDaily>
      <ScheduleViewWeekly
        v-else-if="displayType == 'weekly'"
        v-model:timetables="timetables"
        @select="(variant, id) => emit('select', variant, id)"
        @remove="(variant, id) => emit('remove', variant, id)"
        @slot-select="onSlotSelected"
        @slot-unselect="onSlotUnselected"
      ></ScheduleViewWeekly>
      <ScheduleViewGrouped
        v-else-if="displayType == 'grouped'"
        v-model:timetables="timetables"
        @slot-select="onSlotSelected"
        @slot-unselect="onSlotUnselected"
      ></ScheduleViewGrouped>
      <div v-else class="text-center">
        {{ $t("schedule-type-unhandled") }}
        <span class="font-bold">{{ displayType }}</span>
      </div>
    </div>
    <div
      v-else
      class="text-center flex flex-col items-center gap-y-8 mt-32 px-4"
    >
      <h4 class="text-2xl font-medium text-neutral-darkGray">
        {{ $t("schedule-empty-slots-title") }}
      </h4>
      <Icon
        name="i-ic:baseline-calendar-month"
        size="64"
        class="text-neutral-darkGray"
      />
    </div>

    <!-- Login Required Modal -->
    <ModalLoginRequired
      v-model:visible="showLoginRequiredModal"
    ></ModalLoginRequired>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { ApiInstitutionDisplayType } from "~/types/institution";
  import type { Timetable, TimetableSlot } from "~/types/misc";
  import type { ApiVariant } from "~/types/service";

  const { user } = useDirectusAuth();
  const cartStore = useCartStore();
  const timetables = defineModel("timetables", {
    type: Array as PropType<Array<Timetable>>,
    required: true,
  });

  const props = defineProps({
    displayType: {
      type: String as PropType<ApiInstitutionDisplayType>,
    },
    loading: {
      type: Boolean,
    },
  });

  const emit = defineEmits<{
    select: [variant: ApiVariant, timetableId: string];
    remove: [variant: ApiVariant, timetableId: string];
  }>();

  const slotsExist = computed(() => {
    if (!timetables.value) return false;

    const slotsAmount = timetables.value.reduce((sum, timetable) => {
      if (!timetable.slots.length) return sum;
      return sum + timetable.slots.length;
    }, 0);

    return slotsAmount > 0;
  });

  const showLoginRequiredModal = ref(false);
  const onSlotSelected = (slot: TimetableSlot) => {
    // if user is not logged in, display "log in first" modal
    if (!user.value) {
      showLoginRequiredModal.value = true;
      return;
    }

    // add the slot to the cart
    cartStore.slots.push(slot);
  };

  const onSlotUnselected = (slot: TimetableSlot) => {
    // find the unselected slot and remove it
    const slotIndex = cartStore.slots.findIndex((s) => doSlotsMatch(slot, s));
    if (slotIndex >= 0) {
      cartStore.slots.splice(slotIndex, 1);
    }
  };
</script>

<style></style>
