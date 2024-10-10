import { isAfter, isBefore, isEqual } from "date-fns";
import type { TimetableSlot } from "~/types/misc";

type TimeRange = {
  time_start: string;
  time_end: string;
  [key: string]: any;
};

export default (slot1: TimeRange, slot2: TimeRange) => {
  // Check if one slot starts before the other ends and ends after the other starts
  const firstTimeStartDate = timeToDate(slot1.time_start);
  const firstTimeEndDate = timeToDate(slot1.time_end);
  const secondTimeStartDate = timeToDate(slot2.time_start);
  const secondTimeEndDate = timeToDate(slot2.time_end);

  return (
    (isAfter(firstTimeStartDate, secondTimeStartDate) &&
      isBefore(firstTimeStartDate, secondTimeEndDate)) ||
    ((isAfter(firstTimeStartDate, secondTimeStartDate) ||
      isEqual(firstTimeStartDate, secondTimeStartDate)) &&
      isBefore(firstTimeStartDate, secondTimeEndDate) &&
      isAfter(firstTimeEndDate, secondTimeStartDate) &&
      (isAfter(firstTimeEndDate, secondTimeEndDate) ||
        isEqual(firstTimeEndDate, secondTimeEndDate))) ||
    (isAfter(firstTimeEndDate, secondTimeStartDate) &&
      isBefore(firstTimeEndDate, secondTimeEndDate))
  );
};
