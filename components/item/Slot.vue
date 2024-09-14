<template>
  <div
    class="flex justify-center items-center absolute top-0 left-0 right-0 border-2 border-neutral-white text-neutral-white"
    :class="
      selected
        ? 'bg-secondary'
        : !slot?.available
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
      {{ slot?.start_time.substring(0, 5) }}
    </span>
    <!-- Weather stuff -->
    <!-- <span
      v-if="slot?.current_temp"
      class="absolute top-0 right-0 text-[10px] p-1"
    >
      {{ slot?.current_temp }} °C
    </span> -->
    <span
      >{{ selected ? "Izbrano" : !slot?.available ? "Zasedeno" : "Rezerviraj" }}
    </span>
    <span class="absolute bottom-0 left-0 text-[10px] p-1">
      {{ slot?.end_time.substring(0, 5) }}
    </span>
    <span class="absolute bottom-0 right-0 text-[10px] p-1">
      {{ getPriceNice(slot?.price.toString()) }}
    </span>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { ApiSlot } from "~/types/schedule";

  const cartStore = useCartStore();

  const selected = computed(() => {
    return cartStore.slots.some((slot) => slot.id == props.slot?.id);
  });

  const props = defineProps({
    slot: Object as PropType<ApiSlot>,
    topOffset: Number,
    height: Number,
  });

  const emit = defineEmits<{
    selected: [slot: ApiSlot];
    unselected: [slot: ApiSlot];
  }>();

  const onClick = () => {
    if (
      !props.slot ||
      // props.slot.booked_by_user?.id ||
      (!props.slot.available &&
        !cartStore.slots.some((slot) => slot.id == props.slot?.id))
    )
      return;

    // selected.value = !selected.value;
    selected.value
      ? emit("unselected", props.slot)
      : emit("selected", props.slot);
  };
</script>

<style></style>
