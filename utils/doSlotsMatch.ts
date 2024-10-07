import type { TimetableSlot } from "~/types/misc";

// function for comparing two slots for complete matching
export default (slot1: TimetableSlot, slot2: TimetableSlot) => {
  return (
    slot1?.variant.id == slot2?.variant.id &&
    slot1?.slot_definition.id == slot2?.slot_definition.id &&
    slot1?.date.getTime() == slot2?.date.getTime() &&
    slot1?.time_start == slot2?.time_start &&
    slot1?.time_end == slot2?.time_end
  );
};
