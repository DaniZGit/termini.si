import type { TimetableSlot } from "~/types/misc";

// function for comparing two slots for complete matching
export default (slot1: TimetableSlot, slot2: TimetableSlot) => {
  return (
    slot1.slot_definition.variant.id == slot2.slot_definition.variant.id &&
    slot1.slot_definition.id == slot2.slot_definition.id &&
    new Date(slot1.date).getTime() == new Date(slot2.date).getTime() &&
    slot1.time_start == slot2.time_start &&
    slot1.time_end == slot2.time_end
  );
};
