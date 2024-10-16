import { add, format, isBefore, isEqual, startOfDay } from "date-fns";
import type { TimetableSlot } from "~/types/misc";
import type { ApiDayDefinition, ApiSlot } from "~/types/schedule";
import type { ApiSlotDefinition } from "~/types/service";

export default (
  date: Date,
  timeStart: string | Date,
  timeEnd: string | Date,
  dayDefinition: ApiDayDefinition,
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
      let canReserve = true;

      // find intersecting slots
      const { user } = useDirectusAuth();
      let intersectingSlots = reservedSlots.filter(
        (reservedSlot) =>
          !reservedSlot.reservations.some(
            // check if active user has the slot reserved
            (reservation) =>
              reservation.user.id == user.value?.id &&
              (reservation.status == "held" ||
                reservation.status == "confirmed")
          ) &&
          reservedSlot.slot_definition.variant.service.id ==
            slotDefinition.variant.service.id &&
          doDatesMatch(date, reservedSlot.date) &&
          doSlotsIntersect(
            { time_start: currTimeString, time_end: nextSlotTimeString },
            reservedSlot
          )
      );

      // check if adding this slot would excess schedule dayDefinition specified capacity
      let dayDefinitionCapacitySum = intersectingSlots.length;
      if (dayDefinitionCapacitySum + 1 > dayDefinition.capacity) {
        canReserve = false;
      }

      // check if adding this slot would excess slot_definition specified capacity
      let slotDefinitionCapacitySum = intersectingSlots.reduce(
        (sum, intersectingSlot) =>
          sum +
          (intersectingSlot.slot_definition.id == slotDefinition.id ? 1 : 0),
        0
      );
      if (slotDefinitionCapacitySum + 1 > slotDefinition.capacity) {
        canReserve = false;
      }

      // if slot time is reserved, check if intersecting slots are from the same variant
      // const sameVariantIntersectingSlots = intersectingSlots.filter(
      //   (intersectingSlot) =>
      //     intersectingSlot.slot_definition.variant.id ==
      //     slotDefinition.variant.id
      // );
      // if (canReserve || (!canReserve && sameVariantIntersectingSlots.length)) {
      slots.push({
        date: format(date, "yyyy-MM-dd"),
        time_start: currTimeString,
        time_end: nextSlotTimeString,
        slot_definition: slotDefinition,
        is_reserved: !canReserve,
        is_reserved_by_active_user: intersectingSlots.some((intersectingSlot) =>
          intersectingSlot.reservations.some(
            (reservation) => reservation.user.id == user.value?.id
          )
        ),
      });
      // }
    }
    currentTime = nextSlot;
  }

  return slots;
};
