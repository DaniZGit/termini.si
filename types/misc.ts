import type { LocationQueryValue } from "vue-router";
import type { TimeTableSlot } from "~/utils/generateSlots";
import type { ApiService, ApiVariant } from "./service";

export type InstitutionsFilter = {
  sort: string;
  checkedCities: LocationQueryValue[] | null;
};

export type Timetable = {
  id: string;
  title: string;
  date: string;
  slots: TimeTableSlot[] | null;
  service: ApiService | null;
};
