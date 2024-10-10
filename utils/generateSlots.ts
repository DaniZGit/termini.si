import { add, format, isBefore, isEqual, startOfDay } from "date-fns";
import type { TimetableSlot } from "~/types/misc";
import type { ApiSlot } from "~/types/schedule";
import type { ApiSlotDefinition } from "~/types/service";

export default (
  date: Date,
  timeStart: string | Date,
  timeEnd: string | Date,
  slotDefinition: ApiSlotDefinition,
  reservedSlots: ApiSlot[]
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
      const currTimeString = format(currentTime, "HH:mm:ss");
      const nextSlotTimeString = format(nextSlot, "HH:mm:ss");
      // check if slot intersects with any of the reservedSlots
      let isReserved = reservedSlots.some(
        (reservedSlot) =>
          reservedSlot.slot_definition.variant.service.id ===
            slotDefinition.variant.service.id &&
          doDatesMatch(date, reservedSlot.date) &&
          doSlotsIntersect(
            { time_start: currTimeString, time_end: nextSlotTimeString },
            reservedSlot
          )
      );

      if (isReserved) {
        console.log("a slot is reserved");
        console.log(reservedSlots);
        console.log(currTimeString, nextSlotTimeString);
      }

      if (!isReserved) {
        slots.push({
          date: format(date, "yyyy-MM-dd"),
          time_start: currTimeString,
          time_end: nextSlotTimeString,
          slot_definition: slotDefinition,
        });
      }
    }
    currentTime = nextSlot;
  }

  return slots;
};
