import type { Timetable } from "~/types/misc";

export default (timetables: Timetable[]) => {
  let minDuration = 24 * 60; // 24h -> mins

  timetables.forEach((timetable) => {
    if (!timetable.slots?.length) return;

    timetable.slots.forEach((slot) => {
      const slotStartTimeMins = timeToMins(slot.time_start);
      const slotEndTimeMins = timeToMins(slot.time_end);
      if (slotEndTimeMins - slotStartTimeMins < minDuration)
        minDuration = slotEndTimeMins - slotStartTimeMins;
    });
  });

  return minDuration;
};
