import type { ApiInstitution } from "./institution";
import type { ApiPlan } from "./plan";
import type { ApiSchedule, DayOfWeek } from "./schedule";

export type ApiServiceType = "sports" | "hairdressing" | "wellness" | "fitness";
export type ApiServiceVariantSelection = "single" | "multiple";
export type ApiServiceVariantHandling = "aggregate" | "max_value";

export type ApiService = {
  id: string;
  title: string;
  content: string;
  type: ApiServiceType;
  display_type: "daily" | "weekly";
  variant_selection: ApiServiceVariantSelection;
  variant_handling: ApiServiceVariantHandling;
  institution: ApiInstitution;
  schedule: ApiSchedule | null;
  variants: ApiVariant[] | null;
  plans: ApiPlan[] | null;
};

export type ApiVariant = {
  id: number;
  title: string;
  slot_definitions: ApiSlotDefinition[] | null;
};

export type ApiSlotDefinition = {
  id: number;
  days_of_week: DayOfWeek[];
  time_start: string;
  time_end: string;
  duration: number;
  price: number;
};
