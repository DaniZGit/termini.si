import type { ApiInstitution } from "./institution";
import type { ApiSport } from "./sport";
import type { ApiUser } from "./user";

export type ApiPlan = {
  id: number;
  title: string;
  total_reservations: string;
  total_reservations_per_day: number;
  days_in_advance_to_reserve: number;
  buyable: boolean;
  price: number;
  seasonal: boolean;
  available_from: string | null;
  available_to: string | null;
  note: string | null;
  institution: ApiInstitution;
  sport: ApiSport;
  users: {
    id: number;
    plans_id: number;
    directus_users_id: string;
    total_reservations: number;
  }[];
};

export type ApiPlanUser = {
  id: number;
  plans_id: number | ApiPlan;
  directus_users_id: string;
  total_reservations: number;
};
