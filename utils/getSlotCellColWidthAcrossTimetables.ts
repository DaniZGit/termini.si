import type { Timetable } from "~/types/misc";

export default (timetables: Timetable[]) => {
  let longestTitle = "";
  timetables.forEach(
    (timetable) =>
      (longestTitle =
        timetable.service?.title &&
        timetable.service.title.length > longestTitle.length
          ? timetable.service.title
          : longestTitle)
  );
  if (longestTitle.length) return longestTitle.length * 12;

  return 120;
};
