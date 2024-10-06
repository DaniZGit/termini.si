import type { Timetable, TimetableSlot } from "~/types/misc";

export default (
  timetables: Timetable[],
  slot: TimetableSlot,
  slotCellHeight: number
) => {
  const startTimeMins = timeToMins(slot.time_start);
  const endTimeMins = timeToMins(slot.time_end);

  const slotDuration = endTimeMins - startTimeMins;
  const minSlotDuration = getMinSlotDurationAcrossTimetables(timetables);

  const topOffset = (slotDuration / minSlotDuration) * slotCellHeight;

  return topOffset;
};
