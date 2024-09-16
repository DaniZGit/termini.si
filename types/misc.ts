import type { LocationQueryValue } from "vue-router";
import type { ApiSlot } from "./schedule";

export type InstitutionsFilter = {
  sort: string;
  checkedCities: LocationQueryValue[] | null;
};

export type Timetable = {
  title: string;
  subtitle?: string;
  date: string;
  slots: ApiSlot[] | null;
};
