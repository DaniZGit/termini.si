import type { Timetable } from "~/types/misc";

export default (timetables: Timetable[]) => {
  let minTime = 24 * 60; // in minutes

  timetables.forEach((timetable) => {
    if (!timetable.slots?.length) return;

    timetable.slots.forEach((slot) => {
      const slotStartTimeMins = timeToMins(slot.time_start);
      if (slotStartTimeMins < minTime) minTime = slotStartTimeMins;
    });
  });

  return minTime;
};
