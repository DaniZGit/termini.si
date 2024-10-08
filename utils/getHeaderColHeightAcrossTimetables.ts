import type { Timetable } from "~/types/misc";

export default (timetables: Timetable[]) => {
  const timetableWithManyVariants = timetables.find(
    (timetable) =>
      timetable.service?.variants && timetable.service.variants.length > 1
  );
  if (timetableWithManyVariants) return 75;

  return 50;
};
