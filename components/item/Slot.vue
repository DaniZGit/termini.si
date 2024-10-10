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
      {{ getPriceNice(slot?.slot_definition.price.toString()) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { TimetableSlot } from "~/types/misc";

  const cartStore = useCartStore();

  const selected = computed(() => {
    return cartStore.slots.some(
      (slot) => props.slot && doSlotsMatch(slot, props.slot)
    );
  });

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

  const onClick = () => {
    if (
      !props.slot ||
      cartStore.addToCartStatus === "pending" ||
      (props.status != "available" &&
        !cartStore.slots.some(
          (slot) => props.slot && doSlotsMatch(slot, props.slot)
        ))
    )
      return;

    // selected.value = !selected.value;
    selected.value
      ? emit("unselected", props.slot)
      : emit("selected", props.slot);
  };
</script>

<style></style>
