import type { TimetableSlot } from "~/types/misc";

// function for comparing two slots for complete matching
export default (slot1: TimetableSlot, slot2: TimetableSlot) => {
  const slot1Variants = new Set(slot1.variants.map((v) => v.id));
  const slot2Variants = new Set(slot2.variants.map((v) => v.id));

  return (
    // slot1Variants.difference(slot2Variants).size === 0 &&
    // slot2Variants.difference(slot1Variants).size === 0 &&
    slot1?.date.getTime() == slot2?.date.getTime() &&
    slot1?.time_start == slot2?.time_start &&
    slot1?.time_end == slot2?.time_end
  );
};
