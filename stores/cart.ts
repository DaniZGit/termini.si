import { defineStore } from "pinia";
import type { TimetableSlot } from "~/types/misc";

export const useCartStore = defineStore("cart", () => {
  const cartReservationID = ref("");
  const slots = ref<TimetableSlot[]>([]);
  const ogSlots = ref<TimetableSlot[]>([]);

  // add to cart functionality
  const slotsQuery = computed(() =>
    slots.value.map((slot) => ({
      date: slot.date,
      time_start: slot.time_start,
      time_end: slot.time_end,
      variant_id: slot.variant.id,
      slot_definition_id: slot.slot_definition.id,
    }))
  );
  const {
    data: addToCartData,
    error: addToCartError,
    refresh: execAddToCart,
    status: addToCartStatus,
  } = useFetch<{
    slots: TimetableSlot[];
  }>(`/add-to-cart`, {
    baseURL: useRuntimeConfig().public.directus.url,
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${useDirectusUsers().tokens.value?.access_token}`,
    },
    body: {
      slots: slotsQuery,
      // service: serviceId,
    },
    immediate: true,
    watch: false,
  });

  const debouncedSlots = useDebounceFn(async () => {
    await addToCart();
  }, 1000);

  watch(
    () => slots.value.length,
    () => {
      debouncedSlots();
    }
  );

  const addToCart = async () => {
    await execAddToCart();
    ogSlots.value = useCloned(slots).cloned.value;
    return [];

    // let removedSlots: TimetableSlot[] = [];
    if (!addToCartError.value && addToCartData.value) {
      // const newSlotIds = addToCartData.value.slots.map((slot) => slot.id);
      // removedSlots = slots.value.filter(
      //   (slot) => !newSlotIds?.includes(slot.id)
      // );

      slots.value = addToCartData.value?.slots;
      ogSlots.value = useCloned(slots).cloned.value;
    } else {
      console.log(
        "Error while trying to hodl reservations",
        addToCartError.value
      );
      slots.value = useCloned(ogSlots).cloned.value;
    }

    // return Promise.resolve(removedSlots);
    return Promise.resolve([]);
  };

  // slot reservation functionality
  // const {
  //   data: addToCartData,
  //   error: addToCartError,
  //   refresh: execAddToCart,
  //   status: addToCartStatus,
  // } = useFetch<{
  //   slots: ApiSlot[];
  // }>(`/reservation`, {
  //   baseURL: useRuntimeConfig().public.directus.url,
  //   method: "PATCH",
  //   headers: {
  //     Authorization: `Bearer ${useDirectusUsers().tokens.value?.access_token}`,
  //   },
  //   body: {
  //     slots: slotIds,
  //   },
  //   immediate: true,
  //   watch: false,
  // });

  const reserveTimeSlots = async (body = {}) => {
    // first validate cart slots
    const removedSlots = await addToCart();

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

  const {} = useFetch;

  return {
    slots,
    ogSlots,
    // lastVisitedService,
    cartReservationID,
    addToCart,
    addToCartStatus,
    reserveTimeSlots,
  };
});
