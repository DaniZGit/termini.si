import type { ApiTimeSlot } from "./court";

export type ApiTransaction = {
  id: string;
  date_created: string;
  date_updated: string | null;
  type: "booking" | "topup" | "canceling";
  status: "success" | "pending" | "failed";
  user: string;
  stripe_payment_id: string | null;
  time_slots: null | Array<{
    time_slots_id: ApiTimeSlot;
  }>;
};
