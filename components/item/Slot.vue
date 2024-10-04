<template>
  <div
    class="flex justify-center items-center absolute top-0 left-0 right-0 border-2 border-neutral-white text-neutral-white"
    :class="
      selected
        ? 'bg-secondary'
        : status != 'available'
        ? 'bg-neutral-gray'
        : 'bg-primary'
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
    <!-- <span
      v-if="slot?.current_temp"
      class="absolute top-0 right-0 text-[10px] p-1"
    >
      {{ slot?.current_temp }} °C
    </span> -->
    <span v-if="title">{{ title }}</span>
    <span v-else>
      {{
        selected ? "Izbrano" : status != "available" ? "Zasedeno" : "Rezerviraj"
      }}
    </span>
    <span class="absolute bottom-0 left-0 text-[10px] p-1">
      {{ slot?.time_end.substring(0, 5) }}
    </span>
    <span class="absolute bottom-0 right-0 text-[10px] p-1">
      {{ getPriceNice(slot?.price.toString()) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { ApiSlot } from "~/types/schedule";
  import type { TimeTableSlot } from "~/utils/generateSlots";

  const cartStore = useCartStore();

  const selected = computed(() => {
    return false;
    // return cartStore.slots.some((slot) => slot.id == props.slot?.id);
  });

  const props = defineProps({
    slot: Object as PropType<TimeTableSlot>,
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
    selected: [slot: TimeTableSlot];
    unselected: [slot: TimeTableSlot];
  }>();

  const onClick = () => {
    if (
      !props.slot ||
      // props.slot.booked_by_user?.id ||
      props.status != "available"
      // && !cartStore.slots.some((slot) => slot.id == props.slot?.id))
    )
      return;

    // selected.value = !selected.value;
    selected.value
      ? emit("unselected", props.slot)
      : emit("selected", props.slot);
  };
</script>

<style></style>
