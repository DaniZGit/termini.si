import type { ApiTimeSlot } from "~/types/court";

export default (timeSlots: ApiTimeSlot[]) => {
  return timeSlots.sort((a, b) => {
    if (a.start_time < b.start_time) return -1;
    else if (a.start_time > b.start_time) return 1;
    return 0;
  });
};
