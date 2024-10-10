import { isEqual, startOfDay } from "date-fns";

export default (
  date1: Date | string,
  date2: Date | string,
  includeTime: boolean = false
) => {
  if (includeTime) {
    return isEqual(date1, date2);
  } else {
    // only compare dates, ignore time
    return isEqual(startOfDay(date1), startOfDay(date2));
  }
};
