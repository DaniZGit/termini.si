import { parse } from "date-fns";

export default (time: string) => {
  const referenceDate = new Date(); // Any valid date
  const timeDate = parse(time, "HH:mm:ss", referenceDate);
  return timeDate;
};
