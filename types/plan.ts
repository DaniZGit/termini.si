import type { ApiService } from "./service";
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
  service: ApiService | null;
  users: ApiPlanUser[] | null;
};

export type ApiPlanUser = {
  id: number;
  plans_id: number | ApiPlan;
  directus_users_id: string | ApiUser;
  total_reservations: number;
};
