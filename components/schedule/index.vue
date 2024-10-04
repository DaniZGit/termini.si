<template>
  <div>
    <div v-if="status == 'idle' || status == 'pending'">
      <div
        class="w-full h-full flex flex-col items-center justify-center gap-y-8 mt-32 px-4"
      >
        <h4 class="text-2xl font-medium text-secondary">
          Nalaganje terminov...
        </h4>
        <UiLoader></UiLoader>
      </div>
    </div>
    <div v-else-if="slotsExist">
      <ScheduleViewDaily
        v-if="displayType == 'daily'"
        v-model:timetables="timetables"
        @select="(e, id) => emit('select', e, id)"
      ></ScheduleViewDaily>
      <ScheduleViewWeekly
        v-else-if="displayType == 'weekly'"
        v-model:timetables="timetables"
        @select="(e, id) => emit('select', e, id)"
      ></ScheduleViewWeekly>
      <ScheduleViewGrouped
        v-else-if="displayType == 'grouped'"
        v-model:timetables="timetables"
        @select="(e, id) => emit('select', e, id)"
      ></ScheduleViewGrouped>
      <div v-else class="text-center">
        Display type is not handled:
        <span class="font-bold">{{ displayType }}</span>
      </div>
    </div>
    <div
      v-else
      class="text-center flex flex-col items-center gap-y-8 mt-32 px-4"
    >
      <h4 class="text-2xl font-medium text-neutral-darkGray">
        Trenutno ni terminov za izbrani datum
      </h4>
      <Icon
        name="i-ic:baseline-calendar-month"
        size="64"
        class="text-neutral-darkGray"
      />
    </div>

    <!-- Cart -->
    <div
      v-show="cartStore.slots.length || cartStore.ogSlots.length"
      class="fixed bottom-0 left-0 right-0 flex justify-center"
    >
      <UiShadowPanel
        class="relative inline-flex justify-center items-center gap-x-2 text-secondary z-30 py-2"
      >
        <UiButton
          class="py-1 px-2 relative"
          :disabled="!canOpenCartModal"
          @click="showCartModal = true"
        >
          <Icon
            :name="
              canOpenCartModal
                ? 'i-ic:baseline-calendar-month'
                : 'i-svg-spinners-bars-rotate-fade'
            "
            size="22"
            class="text-neutral-white"
          />
          <span
            class="absolute -top-2.5 -right-2.5 flex justify-center items-center aspect-square h-7 w-auto text-sm text-neutral-white bg-secondary rounded-full"
          >
            {{ cartStore.slots.length }}
          </span>
        </UiButton>
      </UiShadowPanel>
    </div>

    <!-- Cart Modal -->
    <ModalCart v-model:visible="showCartModal"></ModalCart>

    <!-- Login Required Modal -->
    <ModalLoginRequired
      v-model:visible="showLoginRequiredModal"
    ></ModalLoginRequired>
  </div>
</template>

<script lang="ts" setup>
  import type { AsyncDataRequestStatus } from "#app";
  import type { PropType } from "vue";
  import type { ApiInstitutionDisplayType } from "~/types/institution";
  import type { Timetable } from "~/types/misc";

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
    status: {
      type: String as PropType<AsyncDataRequestStatus>,
    },
  });

  const emit = defineEmits<{
    select: [event: Event, id: string];
  }>();

  onMounted(async () => {
    // realtime data - maybe can move this outside the onmounted hook - https://github.com/Intevel/nuxt-directus/issues/264
    // const client = useDirectusRealtime();
    // await client.connect();
    // const { subscription } = await client.subscribe("slots", {
    //   event: "update",
    //   query: {
    //     fields: ["id", "available", "date.id"],
    //   },
    // });
    // for await (const item of subscription) {
    //   console.log("slot update", item);
    //   if (!item.data || !timetables.value) continue;
    //   const changedSlots = item.data as ApiSlot[];
    //   changedSlots.forEach((changedSlot) => {
    //     timetables.value.forEach((timetable) => {
    //       const slot = timetable.slots?.find(
    //         (slot) => slot.id == changedSlot.id
    //       );
    //       if (slot) slot.available = changedSlot.available;
    //     });
    //   });
    // }
  });

  const slotsExist = computed(() => {
    if (!timetables.value) return false;

    const slotsAmount = timetables.value.reduce((sum, timetable) => {
      if (!timetable.slots?.length) return sum;
      return sum + timetable.slots.length;
    }, 0);

    return slotsAmount > 0;
  });

  const showCartModal = ref(false);
  const showLoginRequiredModal = ref(false);
  const onSlotSelected = (slot: TimeTableSlot) => {
    // if user is not logged in, display "log in first" modal
    if (!user.value) {
      showLoginRequiredModal.value = true;
      return;
    }

    // add to cart store
    // cartStore.slots.push(slot);
  };

  const onSlotUnselected = (slot: TimeTableSlot) => {
    // const slotIndex = cartStore.slots.findIndex((s) => s.id == slot.id);
    // if (slotIndex >= 0) {
    //   cartStore.slots.splice(slotIndex, 1);
    // }
  };

  const canOpenCartModal = computed(
    () =>
      cartStore.addToCartStatus != "pending" &&
      cartStore.slots.length == cartStore.ogSlots.length
  );
</script>

<style></style>
