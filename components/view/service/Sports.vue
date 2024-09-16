<template>
  <div class="bg-neutral-white">
    <div v-if="error">error: {{ error }}</div>

    <!-- Schedule -->
    <div v-if="service" class="py-4 flex flex-col gap-y-2">
      <UiDatePicker
        v-model="selectedDate"
        :display-type="service.display_type"
      ></UiDatePicker>
      <ViewSchedule
        :timetables="getTimetables"
        :status="sportCourtsStatus"
      ></ViewSchedule>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { format } from "date-fns";
  import type { PropType } from "vue";
  import type { Timetable } from "~/types/misc";
  import type {
    ApiService,
    ApiServiceTypeSports,
    ApiSportCourt,
  } from "~/types/service";

  const route = useRoute();
  const { readItems } = useDirectusItems();
  const props = defineProps({
    service: {
      type: Object as PropType<ApiService & ApiServiceTypeSports>,
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

  // sport_courts data request
  const {
    data: sportCourts,
    error,
    status: sportCourtsStatus,
  } = await useLazyAsyncData<ApiSportCourt[]>(
    "sport_courts",
    () =>
      readItems("sport_courts", {
        fields: [
          "id",
          "title",
          "schedules.id",
          "schedules.title",
          "schedules.dates.id",
          "schedules.dates.date",
          "schedules.dates.slots.id",
          "schedules.dates.slots.start_time",
          "schedules.dates.slots.end_time",
          "schedules.dates.slots.price",
          "schedules.dates.slots.available",
        ],
        filter: {
          service: {
            institution: {
              slug: {
                _icontains: route.params.slug ?? "",
              },
            },
            type: {
              _icontains: route.params.type ?? "",
            },
          },
        },
        deep: {
          schedules: {
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
      sportCourts.value?.forEach((sportCourt) => {
        if (!sportCourt.schedules?.length) return;

        sportCourt.schedules.forEach((schedule) => {
          schedule.dates?.forEach((date) => {
            if (date.slots?.length) {
              timetables.push({
                title: `${sportCourt.title}`,
                subtitle: `${format(date.date, "dd. M. yyyy").toString()}`,
                date: date.date,
                slots: date.slots,
              });
            }
          });
        });
      });
    } else {
      sportCourts.value?.forEach((sportCourt) => {
        if (
          sportCourt.schedules?.length &&
          sportCourt.schedules[0].dates?.length &&
          sportCourt.schedules[0].dates[0].slots?.length
        ) {
          timetables.push({
            title: `${sportCourt.title}`,
            date: sportCourt.schedules[0].dates[0].date,
            slots: sportCourt.schedules[0].dates[0].slots,
          });
        }
      });
    }

    return timetables;
  });
</script>

<style></style>
