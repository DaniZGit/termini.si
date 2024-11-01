export type ApiTranslation = {
  id: number;
  languages_code: string;
};

export type ApiInstitutionTranslation = ApiTranslation & {
  institutions_id: string;
  title: string;
  slug: string;
  content: string;
};
