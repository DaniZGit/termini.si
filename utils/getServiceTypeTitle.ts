import type { ApiService } from "~/types/service";

export default (service: ApiService) => {
  switch (service.type) {
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
