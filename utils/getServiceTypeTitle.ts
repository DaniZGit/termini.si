export default (service: string | null) => {
  switch (service) {
    case "sports":
      return "Šport";
    case "hairdressing":
      return "Frizerstvo";
    case "fitness":
      return "Fitnes";
    case "wellness":
      return "Wellness";
    default:
      break;
  }

  return "Typeless Service";
};
