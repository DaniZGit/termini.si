import type { LocationQueryValue } from "vue-router";
import type { ApiService, ApiSlotDefinition, ApiVariant } from "./service";
import type { ApiReservation } from "./reservation";

export type InstitutionsFilter = {
  sort: string;
  checkedCities: LocationQueryValue[] | null;
};

export type Timetable = {
  id: string;
  title: string;
  date: Date;
  slots: TimetableSlot[];
  service: ApiService | null;
};

export type TimetableSlot = {
  date: string;
  time_start: string;
  time_end: string;
  slot_definition: ApiSlotDefinition;
  is_reserved: boolean;
  is_reserved_by_active_user: boolean;
};
