import { add, format, isBefore } from "date-fns";
import type { TimetableSlot } from "~/types/misc";
import type { ApiSlotDefinition, ApiVariant } from "~/types/service";

export default (
  date: Date,
  timeStart: string | Date,
  timeEnd: string | Date,
  slotDefinition: ApiSlotDefinition
) => {
  // Convert time strings to Date objects (use any reference date)
  const startTime =
    typeof timeStart == "string" ? timeToDate(timeStart) : timeStart;
  const endTime = typeof timeEnd == "string" ? timeToDate(timeEnd) : timeEnd;

  const slots: TimetableSlot[] = [];
  let currentTime = startTime;

  while (isBefore(currentTime, endTime)) {
    const nextSlot = add(currentTime, { minutes: slotDefinition.duration });
    if (
      isBefore(nextSlot, endTime) ||
      nextSlot.getTime() === endTime.getTime()
    ) {
      slots.push({
        date: format(date, "yyyy-MM-dd"),
        time_start: format(currentTime, "HH:mm:ss"),
        time_end: format(nextSlot, "HH:mm:ss"),
        slot_definition: slotDefinition,
      });
    }
    currentTime = nextSlot;
  }

  return slots;
};
