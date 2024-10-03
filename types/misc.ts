import type { LocationQueryValue } from "vue-router";
import type { TimeTableSlot } from "~/utils/generateSlots";
import type { ApiVariant } from "./service";

export type InstitutionsFilter = {
  sort: string;
  checkedCities: LocationQueryValue[] | null;
};

export type Timetable = {
  id: string;
  title: string;
  subtitle?: string;
  date: string;
  slots: TimeTableSlot[] | null;
  variants: ApiVariant[] | null;
};
