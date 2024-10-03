import { add, format, isBefore, parse } from "date-fns";

export type TimeTableSlot = {
  time_start: string;
  time_end: string;
  duration: number;
  price: number;
};

export default (
  timeStart: string,
  timeEnd: string,
  duration: number,
  price: number
) => {
  // Convert time strings to Date objects (use any reference date)
  const referenceDate = new Date(2024, 9, 1); // Any valid date
  const startTime = parse(timeStart, "HH:mm:ss", referenceDate);
  const endTime = parse(timeEnd, "HH:mm:ss", referenceDate);

  const slots: TimeTableSlot[] = [];
  let currentTime = startTime;

  while (isBefore(currentTime, endTime)) {
    const nextSlot = add(currentTime, { minutes: duration });
    if (
      isBefore(nextSlot, endTime) ||
      nextSlot.getTime() === endTime.getTime()
    ) {
      slots.push({
        time_start: format(currentTime, "HH:mm"),
        time_end: format(nextSlot, "HH:mm"),
        duration: duration,
        price: price,
      });
    }
    currentTime = nextSlot;
  }

  return slots;
};
