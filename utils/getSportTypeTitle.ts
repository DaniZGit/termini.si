export default (type: string | null) => {
  switch (type) {
    case "tennis":
      return "Tennis";
    case "badminton":
      return "Badminton";
  }

  return "Typeless";
};
