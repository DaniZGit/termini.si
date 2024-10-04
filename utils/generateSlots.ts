import { add, format, isBefore } from "date-fns";

export type TimeTableSlot = {
  time_start: string;
  time_end: string;
  duration: number;
  price: number;
};

export default (
  timeStart: string | Date,
  timeEnd: string | Date,
  duration: number,
  price: number
) => {
  // Convert time strings to Date objects (use any reference date)
  const startTime =
    typeof timeStart == "string" ? timeToDate(timeStart) : timeStart;
  const endTime = typeof timeEnd == "string" ? timeToDate(timeEnd) : timeEnd;

  const slots: TimeTableSlot[] = [];
  let currentTime = startTime;

  while (isBefore(currentTime, endTime)) {
    const nextSlot = add(currentTime, { minutes: duration });
    if (
      isBefore(nextSlot, endTime) ||
      nextSlot.getTime() === endTime.getTime()
    ) {
      slots.push({
        time_start: format(currentTime, "HH:mm:ss"),
        time_end: format(nextSlot, "HH:mm:ss"),
        duration: duration,
        price: price,
      });
    }
    currentTime = nextSlot;
  }

  return slots;
};
