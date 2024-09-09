import type { ApiInstitution } from "~/types/institution";

export default (institution: ApiInstitution) => {
  return `${institution.address}, ${institution.city?.postal_code} ${institution.city?.title}`;
};
