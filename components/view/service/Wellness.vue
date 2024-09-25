<template>
  <div class="bg-neutral-white h-full">
    <div v-if="error">error: {{ error }}</div>

    <!-- Schedule -->
    <div v-if="service" class="py-4 flex flex-col gap-y-2 h-full">
      <UiDatePicker
        v-model="selectedDate"
        :display-type="service.display_type"
      ></UiDatePicker>
      <ViewSchedule
        v-model:timetables="getTimetables"
        :status="wellnessStatus"
      ></ViewSchedule>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { format } from "date-fns";
  import { sl } from "date-fns/locale";
  import type { PropType } from "vue";
  import type { Timetable } from "~/types/misc";
  import type {
    ApiService,
    ApiServiceTypeWellness,
    ApiWellness,
  } from "~/types/service";

  const { readItems } = useDirectusItems();
  const props = defineProps({
    service: {
      type: Object as PropType<ApiService & ApiServiceTypeWellness>,
      required: true,
    },
  });

  // datepicker stuff
  const selectedDate = ref<Date | [string, string]>(new Date());
  const getDatesFilter = computed(() => {
    const filter: Record<string, any> = {};

    if (Array.isArray(selectedDate.value)) {
      // as a week picker
      filter["_and"] = [
        {
          date: {
            _gte: useDateFormat(selectedDate.value[0], "YYYY-MM-DD").value,
          },
        },
        {
          date: {
            _lte: useDateFormat(selectedDate.value[1], "YYYY-MM-DD").value,
          },
        },
      ];
    } else {
      // as a single date picker
      filter["date"] = {
        _eq: useDateFormat(selectedDate.value, "YYYY-MM-DD").value,
      };
    }

    return filter;
  });

  // wellness data request
  const {
    data: wellness,
    error,
    status: wellnessStatus,
  } = await useLazyAsyncData<ApiWellness[]>(
    "wellness",
    () =>
      readItems("wellness", {
        fields: [
          "id",
          "title",
          "schedule.id",
          "schedule.title",
          "schedule.dates.id",
          "schedule.dates.date",
          "schedule.dates.slots.id",
          "schedule.dates.slots.start_time",
          "schedule.dates.slots.end_time",
          "schedule.dates.slots.price",
          "schedule.dates.slots.available",
        ],
        filter: {
          service: {
            id: props.service?.id,
          },
        },
        deep: {
          schedule: {
            dates: {
              _filter: getDatesFilter.value,
            },
          },
        },
      }),
    {
      watch: [selectedDate],
      immediate: false,
    }
  );

  const getTimetables = computed(() => {
    const timetables: Timetable[] = [];

    if (Array.isArray(selectedDate.value)) {
      wellness.value?.forEach((wellns) => {
        if (!wellns.schedule) return;

        wellns.schedule.dates?.forEach((date) => {
          if (date.slots?.length) {
            timetables.push({
              title: `${wellns.title}`,
              subtitle: `${format(date.date, "dd. M. yyyy").toString()}`,
              date: date.date,
              slots: date.slots,
            });
          }
        });
      });
    } else {
      wellness.value?.forEach((wellns) => {
        if (
          wellns.schedule &&
          wellns.schedule.dates?.length &&
          wellns.schedule.dates[0].slots?.length
        ) {
          timetables.push({
            title: `${wellns.title}`,
            date: wellns.schedule.dates[0].date,
            slots: wellns.schedule.dates[0].slots,
          });
        }
      });
    }

    return timetables;
  });
</script>

<style></style>
