import type { ApiHairdresser, ApiSportCourt, ApiWellness } from "./service";

export type ApiSchedule = {
  id: string;
  title: string;
  date_definition: ApiDateDefinition[] | null;
  dates: ApiDate[] | null;
  sport_court: ApiSportCourt | null;
  hairdresser: ApiHairdresser | null;
  wellness: ApiWellness | null;
};

export type ApiDateDefinition = {
  id: number;
  day_of_week:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
  slot_defintiions: ApiSlotDefinition[] | null;
  schedule: ApiSchedule;
};

export type ApiSlotDefinition = {
  id: string;
  start_time: string;
  end_time: string;
  available: boolean;
  price: number;
  date_definition: ApiDateDefinition;
};

export type ApiDate = {
  id: string;
  date: string;
  schedule: ApiSchedule;
  slots: ApiSlot[] | null;
};

export type ApiSlot = {
  id: string;
  start_time: string;
  end_time: string;
  available: boolean;
  price: number;
  date: ApiDate;
};
