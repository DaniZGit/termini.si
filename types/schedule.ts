import type { ApiReservation } from "./reservation";
import type { ApiService, ApiSlotDefinition } from "./service";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type ApiSchedule = {
  id: string;
  title: string;
  day_definitions: ApiDayDefinition[] | null;
  services: ApiService[] | null;
};

export type ApiDayDefinition = {
  id: number;
  day_of_week: DayOfWeek;
  time_start: string;
  time_end: string;
  schedule: ApiSchedule | null;
};

export type ApiSlot = {
  date: string;
  time_start: string;
  time_end: string;
  slot_definition: ApiSlotDefinition;
  reservations: ApiReservation[];
};
