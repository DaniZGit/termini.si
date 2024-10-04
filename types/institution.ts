import type { ApiCity } from "./city";
import type { ApiImage } from "./image";
import type { ApiService } from "./service";

export type ApiInstitutionDisplayType = "daily" | "weekly" | "grouped";

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
  display_type: ApiInstitutionDisplayType;
  thumbnail: ApiImage | null;
  images: {
    directus_files_id: ApiImage;
  }[];
  services: ApiService[] | null;
};
