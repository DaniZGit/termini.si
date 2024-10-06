import { isAfter, isBefore, isEqual } from "date-fns";
import type { TimetableSlot } from "~/types/misc";

export default (slot1: TimetableSlot, slot2: TimetableSlot) => {
  // Check if one slot starts before the other ends and ends after the other starts
  const firstTimeStartDate = timeToDate(slot1.time_start);
  const firstTimeEndDate = timeToDate(slot1.time_end);
  const secondTimeStartDate = timeToDate(slot2.time_start);
  const secondTimeEndDate = timeToDate(slot2.time_end);

  return (
    (isBefore(firstTimeStartDate, secondTimeEndDate) ||
      isEqual(firstTimeStartDate, secondTimeEndDate)) &&
    (isAfter(firstTimeEndDate, secondTimeStartDate) ||
      isEqual(firstTimeEndDate, secondTimeStartDate))
  );
};
