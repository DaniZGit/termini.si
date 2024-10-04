<template>
  <div class="flex items-center justify-between px-2 gap-x-2">
    <Icon
      name="i-ic:round-keyboard-arrow-left"
      size="26"
      class="text-secondary hover:ring-2 ring-accent-lightBlue rounded-sm transition-all"
      @click="onPrevDate"
    />
    <div class="w-full">
      <VueDatePicker
        ref="datePicker"
        v-model="selectedDate"
        :enable-time-picker="false"
        :min-date="new Date()"
        :week-picker="displayType == 'weekly' || displayType == 'grouped'"
        :week-start="1"
        :clearable="false"
        :format="datepickerFormat"
        :auto-apply="true"
        :disable-year-select="true"
        position="center"
        :ui="{
          input: 'text-center',
        }"
      ></VueDatePicker>
    </div>
    <Icon
      name="i-ic:round-keyboard-arrow-right"
      size="26"
      class="text-secondary hover:ring-2 ring-accent-lightBlue rounded-sm transition-all"
      @click="onNextDate"
    />
  </div>
</template>

<script lang="ts" setup>
  import type { DatePickerInstance } from "@vuepic/vue-datepicker";
  import {
    addDays,
    addWeeks,
    endOfWeek,
    max,
    startOfWeek,
    subDays,
    subWeeks,
  } from "date-fns";
  import type { PropType } from "vue";
  import type { ApiInstitutionDisplayType } from "~/types/institution";

  const props = defineProps({
    displayType: {
      type: String as PropType<ApiInstitutionDisplayType>,
      default: "daily",
    },
  });

  // date picker
  const datePicker = ref<DatePickerInstance>(null);
  const selectedDate = defineModel({
    type: Object as PropType<Date | [string, string]>,
    default: new Date(),
  });

  const datepickerFormat = (date: Date) => {
    if (Array.isArray(selectedDate.value)) {
      const fromDate = useDateFormat(selectedDate.value[0], "DD. MM. YYYY", {
        locales: "sl",
      });
      const toDate = useDateFormat(selectedDate.value[1], "DD. MM. YYYY", {
        locales: "sl",
      });

      return `${fromDate.value} - ${toDate.value}`;
    }

    const formattedDate = useDateFormat(date, "DD. MM. YYYY (dddd)", {
      locales: "sl",
    });
    return formattedDate.value;
  };

  onMounted(() => {
    if (props.displayType == "weekly" || props.displayType == "grouped") {
      const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
      const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

      selectedDate.value = [startDate.toISOString(), endDate.toISOString()];
    } else {
      selectedDate.value = new Date();
    }
  });

  const onPrevDate = () => {
    if (Array.isArray(selectedDate.value)) {
      const prevWeekDate = max([
        new Date(),
        subWeeks(selectedDate.value[0], 1),
      ]);

      const startDate = startOfWeek(prevWeekDate, {
        weekStartsOn: 1,
      });
      const endDate = endOfWeek(prevWeekDate, {
        weekStartsOn: 1,
      });

      selectedDate.value = [startDate.toISOString(), endDate.toISOString()];
    } else {
      selectedDate.value = max([new Date(), subDays(selectedDate.value, 1)]);
    }
  };

  const onNextDate = () => {
    if (Array.isArray(selectedDate.value)) {
      const nextWeekDate = addWeeks(selectedDate.value[0], 1);

      const startDate = startOfWeek(nextWeekDate, {
        weekStartsOn: 1,
      });
      const endDate = endOfWeek(nextWeekDate, {
        weekStartsOn: 1,
      });

      selectedDate.value = [startDate.toISOString(), endDate.toISOString()];
    } else {
      selectedDate.value = addDays(selectedDate.value, 1);
    }
  };
</script>

<style></style>
