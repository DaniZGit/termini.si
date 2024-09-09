import type { LocationQueryValue } from "vue-router";

export type InstitutionsFilter = {
  sort: string;
  checkedSports: LocationQueryValue[] | null;
  checkedCities: LocationQueryValue[] | null;
};
