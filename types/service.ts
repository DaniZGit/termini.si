import type { ApiInstitution } from "./institution";
import type { ApiPlan } from "./plan";
import type { ApiSchedule } from "./schedule";
import type { ApiSport } from "./sport";

export type ApiService = {
  id: string;
  display_type: "daily" | "weekly";
  institution: ApiInstitution;
  total_reservations_per_day: number;
  days_in_advance_to_reserve: number;
  plans: ApiPlan[] | null;
} & (
  | ApiServiceTypeSports
  | ApiServiceTypeHairdressing
  | ApiServiceTypeWellness
  | ApiServiceTypeFitness
);

export type ApiServiceType = "sports" | "hairdressing" | "wellness" | "fitness";

export type ApiServiceTypeSports = {
  type: Extract<ApiServiceType, "sports">;
  sport_courts: ApiSportCourt[] | null;
};

export type ApiServiceTypeHairdressing = {
  type: Extract<ApiServiceType, "hairdressing">;
  hairdressers: ApiHairdresser[] | null;
};

export type ApiServiceTypeWellness = {
  type: Extract<ApiServiceType, "wellness">;
  hairdressers: ApiWellness[] | null;
};

export type ApiServiceTypeFitness = {
  type: Extract<ApiServiceType, "fitness">;
  hairdressers: ApiFitness[] | null;
};

export type ApiHairdresser = {
  id: string;
  title: string;
  service: ApiService;
  schedules: ApiSchedule[] | null;
};

export type ApiFitness = {
  id: string;
  title: string;
  service: ApiService;
  schedules: ApiSchedule[] | null;
};

export type ApiSportCourt = {
  id: string;
  title: string;
  sport: ApiSport;
  service: ApiService;
  schedules: ApiSchedule[] | null;
};

export type ApiWellness = {
  id: string;
  title: string;
  service: ApiService;
  schedules: ApiSchedule[] | null;
};
