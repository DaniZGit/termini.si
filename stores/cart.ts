import { Body } from "#build/components";
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
      slot_definition: slot.slot_definition.id,
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

    if (!addToCartError.value && addToCartData.value) {
      slots.value = addToCartData.value?.slots;
      ogSlots.value = useCloned(slots).cloned.value;
    } else {
      console.log(
        "Error while trying to hodl reservations",
        addToCartError.value
      );
      slots.value = useCloned(ogSlots).cloned.value;
    }

    return Promise.resolve();
  };

  // slot reservation functionality
  const checkoutBody = ref({ plan_id: null });
  const {
    data: checkoutData,
    error: checkoutError,
    execute: checkoutCart,
    status: checkoutStatus,
  } = useFetch(`/checkout`, {
    baseURL: useRuntimeConfig().public.directus.url,
    method: "POST",
    headers: {
      Authorization: `Bearer ${useDirectusUsers().tokens.value?.access_token}`,
    },
    body: checkoutBody.value,
    immediate: false,
    watch: false,
  });

  const reserveSlots = async (planID: any) => {
    // first validate cart slots
    await addToCart();
    console.log("vaslidated cart", slots.value);
    if (!slots.value.length) {
      return Promise.reject({
        type: "cart_change",
      });
    }

    // all good, we can checkout the slots
    checkoutBody.value.plan_id = planID;
    await checkoutCart();

    if (checkoutError.value) {
      // something went wrong
      return Promise.reject({
        type: "other",
        data: null,
      });
    }

    // update user data/plans/tokens
    useDirectusUsers().readMe();
    slots.value = [];
    return Promise.resolve();
  };

  return {
    slots,
    ogSlots,
    // lastVisitedService,
    cartReservationID,
    addToCart,
    addToCartStatus,
    reserveSlots,
  };
});
