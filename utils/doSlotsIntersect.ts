import { isAfter, isBefore, isEqual } from "date-fns";

export default (slot1: TimeTableSlot, slot2: TimeTableSlot) => {
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
