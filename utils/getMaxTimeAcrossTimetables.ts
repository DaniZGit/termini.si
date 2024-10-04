import type { Timetable } from "~/types/misc";

export default (timetables: Timetable[]) => {
  let maxTime = 0; // in minutes

  timetables.forEach((timetable) => {
    if (!timetable.slots?.length) return;

    timetable.slots.forEach((slot) => {
      const slotStartTimeMins = timeToMins(slot.time_end);
      if (slotStartTimeMins > maxTime) maxTime = slotStartTimeMins;
    });
  });

  return maxTime;
};
