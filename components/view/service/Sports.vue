<template>
  <div class="bg-neutral-white">
    <div v-if="error">error: {{ error }}</div>

    <!-- Plans -->
    <div class="px-4 py-4">
      <ViewServicePlans :plans="getPlans"></ViewServicePlans>
    </div>

    <!-- Schedule -->
    <div v-if="service" class="py-4 flex flex-col gap-y-2">
      <UiDatePicker
        v-model="selectedDate"
        :display-type="service.display_type"
      ></UiDatePicker>
      <ViewSchedule
        :timetables="getTimetables"
        :status="sportsStatus"
      ></ViewSchedule>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { format } from "date-fns";
  import type { PropType } from "vue";
  import type { Timetable } from "~/types/misc";
  import type { ApiPlan } from "~/types/plan";
  import type {
    ApiService,
    ApiServiceTypeSports,
    ApiSport,
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
    data: sports,
    error,
    status: sportsStatus,
  } = await useLazyAsyncData<ApiSport[]>(
    "sports",
    () =>
      readItems("sports", {
        fields: [
          "id",
          "title",
          "courts.title",
          "courts.schedule.id",
          "courts.schedule.title",
          "courts.schedule.dates.id",
          "courts.schedule.dates.date",
          "courts.schedule.dates.slots.id",
          "courts.schedule.dates.slots.start_time",
          "courts.schedule.dates.slots.end_time",
          "courts.schedule.dates.slots.price",
          "courts.schedule.dates.slots.available",
          "plans.id",
          "plans.title",
          "plans.total_reservations",
          "plans.total_reservations_per_day",
          "plans.days_in_advance_to_reserve",
          "plans.buyable",
          "plans.price",
          "plans.note",
          "plans.service.id",
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
          courts: {
            schedule: {
              dates: {
                _filter: getDatesFilter.value,
              },
            },
          },
        },
      }),
    {
      watch: [selectedDate],
      immediate: false,
    }
  );

  const getPlans = computed(() => {
    let plans: ApiPlan[] = [];

    if (props.service.plans) plans = plans.concat(props.service.plans);
    sports.value?.forEach((sport) => {
      if (sport.plans) plans = plans.concat(sport.plans);
    });

    console.log("plans", plans);

    return plans;
  });

  const getTimetables = computed(() => {
    const timetables: Timetable[] = [];

    if (Array.isArray(selectedDate.value)) {
      sports.value?.forEach((sport) => {
        if (!sport.courts.length) return;

        sport.courts.forEach((court) => {
          court.schedule?.dates?.forEach((date) => {
            if (date.slots?.length) {
              timetables.push({
                title: `${sport.schedule?.title}`,
                subtitle: `${format(date.date, "dd. M. yyyy").toString()}`,
                date: date.date,
                slots: date.slots,
              });
            }
          });
        });
      });
    } else {
      sports.value?.forEach((sport) => {
        sport.courts.forEach((court) => {
          if (
            court.schedule &&
            court.schedule.dates?.length &&
            court.schedule.dates[0].slots?.length
          ) {
            timetables.push({
              title: `${court.schedule.title}`,
              date: court.schedule.dates[0].date,
              slots: court.schedule.dates[0].slots,
            });
          }
        });
      });
    }

    return timetables;
  });
</script>

<style></style>
