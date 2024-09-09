import type { ApiCity } from "./city";
import type { ApiCourt } from "./court";
import type { ApiImage } from "./image";
import type { ApiPlan } from "./plan";

export type ApiInstitution = {
  id: string;
  title: string;
  slug: string;
  content: string;
  city: ApiCity | null;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  total_reservations_per_day: number;
  days_in_advance_to_reserve: number;
  plans: ApiPlan[] | null;
  thumbnail: ApiImage | null;
  images: {
    directus_files_id: ApiImage;
  }[];
  courts: ApiCourt[] | null;
};
