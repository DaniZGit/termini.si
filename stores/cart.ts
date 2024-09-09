import { defineStore } from "pinia";
import type { ApiTimeSlot } from "~/types/court";

export const useCartStore = defineStore(
  "cart",
  () => {
    const cartReservationID = ref("");
    const slots = ref<ApiTimeSlot[]>([]);

    let ogSlots: ApiTimeSlot[] = [];
    let requestTimeout: NodeJS.Timeout;
    watch(
      () => slots.value.length,
      () => {
        clearTimeout(requestTimeout);
        requestTimeout = setTimeout(() => {
          validateCartReservation();
        }, 1000);
      }
    );

    const validateCartReservation = async () => {
      const slotsIds = slots.value.map((slot) => slot.id);
      const freeSlotsIds = ogSlots
        .filter((slot) => !slotsIds.includes(slot.id))
        .map((slot) => slot.id);
      let removedSlots: ApiTimeSlot[] = [];

      try {
        const data = await $fetch<{
          cart_reservation_id: string;
          time_slot_ids: string[];
        }>(`/temporary-cart-reservation`, {
          baseURL: useRuntimeConfig().public.directus.url,
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${
              useDirectusUsers().tokens.value?.access_token
            }`,
          },
          body: {
            freebies: freeSlotsIds,
            hodlers: slotsIds,
          },
        });

        // remove slots that we couldnt hodl
        const hodledSlots = slots.value.filter((slot) =>
          data.time_slot_ids.includes(slot.id)
        );

        removedSlots = slots.value.filter(
          (slot) => !data.time_slot_ids.includes(slot.id)
        );

        slots.value = hodledSlots;
        cartReservationID.value = data.cart_reservation_id;

        ogSlots = useCloned(slots).cloned.value;
      } catch (error) {
        console.log("Error while trying to hodl reservations", error);
        slots.value = useCloned(ogSlots).cloned.value;
      }

      return Promise.resolve(removedSlots);
    };

    const reserveTimeSlots = async (body = {}) => {
      // first validate cart slots
      const removedSlots = await validateCartReservation();

      if (removedSlots.length)
        return Promise.reject({
          type: "cart_reservation_slot_change",
          data: removedSlots,
        });

      try {
        const data = await $fetch(`/reservations`, {
          baseURL: useRuntimeConfig().public.directus.url,
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              useDirectusUsers().tokens.value?.access_token
            }`,
          },
          body: body,
        });

        // update user tokens
        const { readMe } = useDirectusUsers();
        readMe();
      } catch (error) {
        return Promise.reject({
          type: "other",
          data: null,
        });
      }
    };

    return {
      slots,
      cartReservationID,
      validateCartReservation,
      reserveTimeSlots,
    };
  },
  {
    persist: {
      storage: persistedState.localStorage,
    },
  }
);
