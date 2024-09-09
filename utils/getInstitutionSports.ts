import type { ApiInstitution } from "~/types/institution";
import type { ApiSport } from "~/types/sport";

export default (institution: ApiInstitution) => {
  // const sports: Record<string, ApiSport> = {};
  const sports: ApiSport[] = [];
  institution.courts?.forEach((court) => {
    if (court.sport) {
      if (!sports.some((s) => s.id == court.sport?.id))
        sports.push(court.sport);
    }
  });

  return sports;
};
