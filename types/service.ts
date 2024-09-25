import type { ApiCourt } from "./court";
import type { ApiImage } from "./image";
import type { ApiInstitution } from "./institution";
import type { ApiPlan } from "./plan";
import type { ApiSchedule } from "./schedule";

export type ApiService = {
  id: string;
  content: string;
  display_type: "daily" | "weekly";
  institution: ApiInstitution;
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
  sports: ApiSport[] | null;
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
  schedule: ApiSchedule | null;
  plans: ApiPlan[] | null;
};

export type ApiFitness = {
  id: string;
  title: string;
  service: ApiService;
  schedule: ApiSchedule | null;
};

export type ApiSport = {
  id: string;
  title: string;
  image: ApiImage;
  courts: ApiCourt[];
  service: ApiService;
  schedule: ApiSchedule | null;
  plans: ApiPlan[] | null;
};

export type ApiWellness = {
  id: string;
  title: string;
  service: ApiService;
  schedule: ApiSchedule | null;
  plans: ApiPlan[] | null;
};
