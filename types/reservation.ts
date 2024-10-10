import type { ApiSlot } from "./schedule";
import type { ApiUser } from "./user";

export type ApiReservation = {
  id: string;
  user: ApiUser;
  slot: ApiSlot;
};
