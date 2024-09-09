import type { ApiCourt } from "./court";
import type { ApiImage } from "./image";

export type ApiSport = {
  id: number;
  title: string;
  slug: string;
  image: ApiImage;
  courts: ApiCourt[];
};
