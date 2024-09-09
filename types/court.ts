import type { ApiCartReservation } from "./cart";
import type { ApiInstitution } from "./institution";
import type { ApiSport } from "./sport";
import type { ApiTransaction } from "./transaction";
import type { ApiUser } from "./user";

export type ApiCourt = {
  id: string;
  title: string;
  sport: ApiSport | null;
  institution: ApiInstitution;
  schedule_days: ApiScheduleDay[];
};

export type ApiScheduleDay = {
  id: string;
  date: string;
  time_slots: ApiTimeSlot[];
  court: ApiCourt;
};

export type ApiTimeSlot = {
  id: string;
  start_time: string;
  end_time: string;
  price: string;
  status: "available" | "unavailable";
  current_temp: number;
  schedule_day: ApiScheduleDay;
  cart_reservation: Partial<ApiCartReservation>;
  booked_by_user: null | Partial<ApiUser>;
  transactions: null | Array<{
    transactions_id: ApiTransaction;
  }>;
};
