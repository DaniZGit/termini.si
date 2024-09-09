<template>
  <div
    class="flex justify-center items-center absolute top-0 left-0 right-0 border-2 border-neutral-white text-neutral-white"
    :class="
      selected
        ? 'bg-secondary'
        : timeSlot?.status === 'unavailable'
        ? 'bg-neutral-gray'
        : 'bg-primary'
    "
    :style="`
      height: ${height}px;
      top: ${topOffset}px;
    `"
    @click="onClick"
  >
    <span class="absolute top-0 left-0 text-[10px] p-1">
      {{ timeSlot?.start_time.substring(0, 5) }}
    </span>
    <span
      v-if="timeSlot?.current_temp"
      class="absolute top-0 right-0 text-[10px] p-1"
    >
      {{ timeSlot?.current_temp }} °C
    </span>
    <span
      >{{
        selected
          ? "Izbrano"
          : timeSlot?.status == "unavailable"
          ? "Zasedeno"
          : "Rezerviraj"
      }}
    </span>
    <!-- <span>Izbrano</span>
    <span>Zasedeno</span>
    <span>Rezerviraj</span> -->
    <span class="absolute bottom-0 left-0 text-[10px] p-1">
      {{ timeSlot?.end_time.substring(0, 5) }}
    </span>
    <span class="absolute bottom-0 right-0 text-[10px] p-1">
      {{ getPriceNice(timeSlot?.price) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { ApiTimeSlot } from "~/types/court";

  const cartStore = useCartStore();

  const selected = computed(() => {
    return cartStore.slots.some((slot) => slot.id == props.timeSlot?.id);
  });

  const props = defineProps({
    timeSlot: Object as PropType<ApiTimeSlot>,
    topOffset: Number,
    height: Number,
  });

  const emit = defineEmits<{
    selected: [timeSlot: ApiTimeSlot];
    unselected: [timeSlot: ApiTimeSlot];
  }>();

  const onClick = () => {
    if (
      !props.timeSlot ||
      props.timeSlot.booked_by_user?.id ||
      (props.timeSlot.status == "unavailable" &&
        !cartStore.slots.some((slot) => slot.id == props.timeSlot?.id))
    )
      return;

    // selected.value = !selected.value;
    selected.value
      ? emit("unselected", props.timeSlot)
      : emit("selected", props.timeSlot);
  };
</script>

<style></style>
