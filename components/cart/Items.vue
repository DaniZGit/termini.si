<template>
  <div class="flex flex-col overflow-y-auto text-neutral-darkGray">
    <div
      v-for="(groupedByDateSlots, date) in getGroupedSlots()"
      :key="date"
      class="flex flex-col pb-2"
    >
      <div class="flex gap-x-2">
        <h2 class="text-lg font-semibold capitalize">
          {{ format(date, "dd. MM. yyyy (EEEE)", { locale: sl }) }}
        </h2>
      </div>
      <div v-for="(group, groupKey) in groupedByDateSlots">
        <h4 class="font-medium">
          {{ group.service.title }} ({{ group.variant.title }})
        </h4>
        <div
          v-for="slot in group.slots"
          :key="slot.id"
          class="flex justify-between pl-2"
        >
          <div class="flex items-center gap-x-1">
            <span>
              {{ slot.time_start.substring(0, 5) }}
              -
              {{ slot.time_end.substring(0, 5) }}
            </span>
          </div>
          <div class="flex items-center gap-x-1">
            <span>
              {{ getPriceNice(slot.slot_definition.price.toString()) }}
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
  import { format } from "date-fns";
  import { sl } from "date-fns/locale";
  import type { TimetableSlot } from "~/types/misc";
  import type { ApiService, ApiVariant } from "~/types/service";

  const props = defineProps({
    slots: Array as PropType<TimetableSlot[]>,
    removable: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits<{
    remove: [slot: TimetableSlot];
  }>();

  const getGroupedSlots = () => {
    if (!props.slots) return {};

    let groupedSlots: Record<
      string,
      Record<
        string,
        {
          service: ApiService;
          variant: ApiVariant;
          slots: TimetableSlot[];
        }
      >
    > = {};

    props.slots.forEach((slot) => {
      const date = slot.date;
      const groupKey = `${slot.slot_definition.variant.service.id}_${slot.slot_definition.variant.id}`;

      if (groupedSlots[date]) {
        if (groupedSlots[date][groupKey]) {
          groupedSlots[date][groupKey].slots.push(slot);
        } else {
          groupedSlots[date][groupKey] = {
            service: slot.slot_definition.variant.service,
            variant: slot.slot_definition.variant,
            slots: [slot],
          };
        }
      } else {
        groupedSlots[date] = {};
        groupedSlots[date][groupKey] = {
          service: slot.slot_definition.variant.service,
          variant: slot.slot_definition.variant,
          slots: [slot],
        };
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
      Object.keys(sorted[key]).forEach((groupKey) => {
        sorted[key][groupKey].slots = sorted[key][groupKey].slots.sort(
          (a, b) => {
            if (a.time_start < b.time_start) return -1;
            else if (a.time_start > b.time_start) return 1;
            return 0;
          }
        );
      });
    });

    return sorted;
  };

  const onRemove = (slot: TimetableSlot) => {
    emit("remove", slot);
  };
</script>

<style></style>
