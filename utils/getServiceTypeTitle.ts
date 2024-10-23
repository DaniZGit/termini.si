export default (service: string | null) => {
  const { t } = useI18n();
  switch (service) {
    case "sports":
      return t("service-type-sports-title");
    case "hairdressing":
      return t("service-type-hairdressing-title");
    case "fitness":
      return t("service-type-fitness-title");
    case "wellness":
      return t("service-type-wellness-title");
    default:
      break;
  }

  return t("service-type-unhandled");
};
