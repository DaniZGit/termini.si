import type { ApiTranslation } from "~/types/translation";

export default <T extends ApiTranslation[]>(
  translations: T | undefined,
  fieldName: string
) => {
  const { locale, locales } = useI18n();
  const currLocale = locales.value.find((l) => l.code == locale.value);
  const translation = translations?.find(
    (translation) => currLocale?.language == translation.languages_code
  );

  if (translation && Object.hasOwn(translation, fieldName))
    return translation[fieldName];
  return "";
};
