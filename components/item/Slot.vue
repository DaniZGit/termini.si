<template>
  <div
    class="flex justify-center items-center absolute top-0 left-0 right-0 border-2 border-neutral-white text-neutral-white hover:cursor-pointer hover:border-neutral-darkGray hover:z-50"
    :slot="slot?.is_reserved"
    :class="
      getSlotStatus == 'free'
        ? 'bg-primary'
        : getSlotStatus == 'user-held' || getSlotStatus == 'user-confirmed'
        ? 'bg-secondary'
        : 'bg-neutral-gray'
    "
    :style="`
      height: ${height}px;
      width: min(100%, ${width}px);
      top: ${topOffset}px;
      left: ${leftOffset}px;
    `"
    @click="onClick"
  >
    <span class="absolute top-0 left-0 text-[10px] p-1">
      {{ slot?.time_start.substring(0, 5) }}
    </span>
    <!-- Weather stuff -->
    <span class="absolute top-0 right-0 text-[10px] p-1"> {{ 17 }} °C</span>
    <span v-if="title">{{ title }}</span>
    <span v-else>
      {{
        getSlotStatus == "free"
          ? "Rezerviraj"
          : getSlotStatus == "user-held"
          ? "Izbrano"
          : getSlotStatus == "user-confirmed" || getSlotStatus == "other-taken"
          ? "Rezervirano"
          : "Error"
      }}
    </span>
    <span class="absolute bottom-0 left-0 text-[10px] p-1">
      {{ slot?.time_end.substring(0, 5) }}
    </span>
    <span class="absolute bottom-0 right-0 text-[10px] p-1">
      {{ getPriceNice(slot?.slot_definition.price.toString()) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { TimetableSlot } from "~/types/misc";

  const cartStore = useCartStore();

  const props = defineProps({
    slot: Object as PropType<TimetableSlot>,
    status: String as PropType<"available" | "booked">,
    topOffset: Number,
    leftOffset: {
      type: Number,
      default: 0,
    },
    height: Number,
    width: Number,
    title: String,
  });

  const emit = defineEmits<{
    selected: [slot: TimetableSlot];
    unselected: [slot: TimetableSlot];
  }>();

  const selected = computed(() => {
    return cartStore.slots.some(
      (slot) => props.slot && doSlotsMatch(slot, props.slot)
    );
  });

  // "free", "user-held", "user-confirmed", "other-taken"
  const getSlotStatus = computed(() => {
    if (selected.value) return "user-held";
    if (!props.slot || !props.slot?.is_reserved) return "free";
    if (!props.slot.is_reserved_by_active_user) return "other-taken";

    return "user-confirmed";
  });

  const onClick = () => {
    if (
      !props.slot ||
      cartStore.addToCartStatus === "pending" ||
      (getSlotStatus.value != "free" && getSlotStatus.value != "user-held")
    )
      return;

    // selected.value = !selected.value;
    selected.value
      ? emit("unselected", props.slot)
      : emit("selected", props.slot);
  };
</script>

<style></style>
