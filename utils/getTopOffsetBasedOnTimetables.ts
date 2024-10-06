import type { Timetable, TimetableSlot } from "~/types/misc";

export default (
  timetables: Timetable[],
  slot: TimetableSlot,
  slotCellHeight: number
) => {
  let slotMinutes = timeToMins(slot.time_start);
  let minTimeMinutes = getMinTimeAcrossTimetables(timetables);

  const topOffset =
    ((slotMinutes - minTimeMinutes) / 60) *
    slotCellHeight *
    (60 / getMinSlotDurationAcrossTimetables(timetables));

  return topOffset;
};
