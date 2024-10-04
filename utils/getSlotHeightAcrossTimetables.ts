import type { Timetable } from "~/types/misc";

export default (
  timetables: Timetable[],
  slot: TimeTableSlot,
  slotCellHeight: number
) => {
  const startTimeMins = timeToMins(slot.time_start);
  const endTimeMins = timeToMins(slot.time_end);

  const slotDuration = endTimeMins - startTimeMins;
  const minSlotDuration = getMinSlotDurationAcrossTimetables(timetables);

  const topOffset = (slotDuration / minSlotDuration) * slotCellHeight;

  return topOffset;
};
