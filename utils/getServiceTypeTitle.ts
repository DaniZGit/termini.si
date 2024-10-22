export default (service: string | null) => {
  switch (service) {
    case "sports":
      return "Sports";
    case "hairdressing":
      return "Hairdressing";
    case "fitness":
      return "Fitness";
    case "wellness":
      return "Wellness";
    default:
      break;
  }

  return "Typeless Service";
};
