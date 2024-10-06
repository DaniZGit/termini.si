import type { ApiService } from "./service";

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
  id: string;
  days_of_weeks: DayOfWeek[];
  start_time: string;
  end_time: string;
  available: boolean;
  price: number;
};
