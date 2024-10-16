import type { ApiSlot } from "./schedule";
import type { ApiUser } from "./user";

export type ApiReservationStatus = "held" | "confirmed" | "canceled";

export type ApiReservation = {
  id: string;
  status: ApiReservationStatus;
  user: ApiUser;
  slot: ApiSlot;
};
