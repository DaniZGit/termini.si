import type { ApiCity } from "./city";
import type { ApiImage } from "./image";
import type { ApiService } from "./service";
import type { ApiInstitutionTranslation } from "./translation";

export type ApiInstitutionDisplayType = "daily" | "weekly" | "grouped";
export type ApiInstitutionPaymentOptions = string[];

export type ApiInstitution = {
  id: string;
  slug: string;
  city: ApiCity | null;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  display_type: ApiInstitutionDisplayType;
  payment_options: ApiInstitutionPaymentOptions;
  thumbnail: ApiImage | null;
  images: {
    directus_files_id: ApiImage;
  }[];
  services: ApiService[] | null;
  translations: ApiInstitutionTranslation[];
};
