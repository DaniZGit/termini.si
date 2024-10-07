import type { LocationQueryValue } from "vue-router";
import type { ApiService, ApiSlotDefinition, ApiVariant } from "./service";

export type InstitutionsFilter = {
  sort: string;
  checkedCities: LocationQueryValue[] | null;
};

export type Timetable = {
  id: string;
  title: string;
  date: string;
  slots: TimetableSlot[] | null;
  service: ApiService | null;
};

export type TimetableSlot = {
  date: Date;
  time_start: string;
  time_end: string;
  duration: number;
  price: number;
  variants: ApiVariant[];
};
