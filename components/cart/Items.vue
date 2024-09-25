<template>
  <div class="flex flex-col overflow-y-auto text-neutral-darkGray">
    <div
      v-for="(groupedByDateSlots, date) in getGroupedSlots()"
      :key="date"
      class="flex flex-col pb-2"
    >
      <div class="flex gap-x-2">
        <h2 class="text-lg font-semibold">
          {{ getDateNice(date as string) }}
        </h2>
      </div>
      <div v-for="(groupedSlots, title) in groupedByDateSlots">
        <h4 class="font-medium">{{ title }}</h4>
        <div
          v-for="slot in groupedSlots"
          :key="slot.id"
          class="flex justify-between pl-2"
        >
          <div class="flex items-center gap-x-1">
            <span>
              {{ slot.start_time.substring(0, 5) }}
              -
              {{ slot.end_time.substring(0, 5) }}
            </span>
          </div>
          <div class="flex items-center gap-x-1">
            <span>
              {{ getPriceNice(slot.price.toString()) }}
            </span>
            <Icon
              v-if="removable"
              name="i-mdi:close-thick"
              size="20"
              class="text-neutral-gray"
              @click="onRemove(slot)"
            />
          </div>
        </div>
      </div>
      <!-- </div> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiSlot } from "~/types/schedule";

  const props = defineProps({
    slots: Array as PropType<ApiSlot[]>,
    removable: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits<{
    remove: [slot: ApiSlot];
  }>();

  const getGroupedSlots = () => {
    if (!props.slots) return {};

    let groupedSlots: Record<string, Record<string, ApiSlot[]>> = {};

    console.log(props.slots);

    props.slots.forEach((slot) => {
      if (groupedSlots[slot.date.date]) {
        if (groupedSlots[slot.date.date][slot.date.schedule.title]) {
          groupedSlots[slot.date.date][slot.date.schedule.title].push(slot);
        } else {
          groupedSlots[slot.date.date][slot.date.schedule.title] = [slot];
        }
      } else {
        groupedSlots[slot.date.date] = {};
        groupedSlots[slot.date.date][slot.date.schedule.title] = [slot];
      }
    });

    let sorted = Object.fromEntries(
      Object.entries(groupedSlots).sort(([a], [b]) => {
        if (a < b) return -1;
        else if (a > b) return 1;
        return 0;
      })
    );

    Object.keys(sorted).forEach((key) => {
      Object.keys(sorted[key]).forEach((schedule) => {
        sorted[key][schedule] = sorted[key][schedule].sort((a, b) => {
          if (a.start_time < b.end_time) return -1;
          else if (a.start_time > b.start_time) return 1;
          return 0;
        });
      });
    });

    return sorted;
  };

  const onRemove = (slot: ApiSlot) => {
    emit("remove", slot);
  };
</script>

<style></style>
