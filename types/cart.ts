import type { ApiTimeSlot } from "./court";

export type ApiCartReservation = {
  id: string;
  user_created: string;
  user_updated: string;
  date_created: string;
  date_updated: string;
  time_slots: ApiTimeSlot[];
};
