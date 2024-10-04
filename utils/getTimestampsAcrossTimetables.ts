import type { Timetable } from "~/types/misc";

export default (timetables: Timetable[]) => {
  const minMaxTimeDiff =
    (getMaxTimeAcrossTimetables(timetables) -
      getMinTimeAcrossTimetables(timetables)) /
    getMinSlotDurationAcrossTimetables(timetables);
  return [...Array(Math.floor(minMaxTimeDiff) + 1).keys()];
};
