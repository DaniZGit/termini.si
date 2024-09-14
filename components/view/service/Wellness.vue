<template>
  <div class="bg-neutral-white">
    <div class="text-center px-4 py-4">
      <h1 class="text-3xl font-semibold text-secondary">
        {{ service.institution.title }}
      </h1>
      <h2 class="text-primary font-semibold text-xl">
        ( {{ getServiceTypeTitle(service) }} )
      </h2>
    </div>

    <div v-if="error">error: {{ error }}</div>

    <!-- Schedule -->
    <div class="py-4 flex flex-col gap-y-2">
      <div class="flex items-center">
        <h2 class="px-4 text-2xl font-semibold text-secondary">Termini</h2>
        <div>
          <VueDatePicker
            v-model="selectedDate"
            :enable-time-picker="false"
            :min-date="new Date()"
            :clearable="false"
            :format="datepickerFormat"
            :auto-apply="true"
          ></VueDatePicker>
        </div>
      </div>
      <ViewSchedule :schedules="getSchedules"></ViewSchedule>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { ApiSchedule } from "~/types/schedule";
  import type {
    ApiService,
    ApiServiceTypeWellness,
    ApiSportCourt,
    ApiWellness,
  } from "~/types/service";

  const route = useRoute();
  const { readItems } = useDirectusItems();
  const props = defineProps({
    service: {
      type: Object as PropType<ApiService & ApiServiceTypeWellness>,
      required: true,
    },
  });

  // date picker
  const selectedDate = ref(new Date());
  const formattedDateValue = useDateFormat(selectedDate, "YYYY-MM-DD");
  const datepickerFormat = (date: Date) => {
    const formattedDate = useDateFormat(date, "DD. MM. YYYY (dddd)", {
      locales: "sl",
    });

    return formattedDate.value;
  };

  // wellness data request
  const {
    data: wellness,
    error,
    status,
  } = await useLazyAsyncData<ApiWellness[]>(
    "wellness",
    () =>
      readItems("wellness", {
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
              _filter: {
                date: {
                  _eq: formattedDateValue.value,
                },
              },
              _limit: 1,
            },
          },
        },
      }),
    {
      watch: [selectedDate],
    }
  );

  const getSchedules = computed(() => {
    if (!wellness.value) return {};

    const titleToScheduleMap: Record<string, ApiSchedule> = {};
    wellness.value.forEach((wellns) => {
      if (wellns.schedules?.length)
        titleToScheduleMap[wellns.title] = wellns.schedules[0];
    });

    return titleToScheduleMap;
  });
</script>

<style></style>
