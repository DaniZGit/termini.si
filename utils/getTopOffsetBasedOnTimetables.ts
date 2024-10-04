import type { Timetable } from "~/types/misc";

export default (
  timetables: Timetable[],
  slot: TimeTableSlot,
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
