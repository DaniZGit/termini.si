import type { LocationQueryValue } from "vue-router";

export type InstitutionsFilter = {
  sort: string;
  checkedCities: LocationQueryValue[] | null;
};
