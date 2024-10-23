<template>
  <teleport to="body">
    <div
      v-if="visible"
      ref="modal"
      class="fixed top-0 left-0 right-0 bottom-0 z-50"
      :class="{
        'modal-open': visible,
        '!top-16': stateStore.headerIsVisible,
      }"
    >
      <div
        class="absolute top-0 left-0 right-0 bottom-0 bg-neutral-white bg-opacity-80 -z-10 backdrop-blur-md"
      ></div>

      <div
        class="h-full grid grid-flow-row grid-rows-12 gap-y-2 text-neutral-darkGray p-4"
      >
        <div class="row-span-1 flex items-center justify-between">
          <h2 class="text-2xl text-secondary font-bold">
            {{ $t("cart-slots-title") }}
          </h2>
          <Icon
            name="i-ic:outline-cancel"
            size="28"
            class="text-secondary hover:cursor-pointer"
            @click="onClose"
          />
        </div>

        <div class="row-span-10 flex flex-col gap-y-2">
          <div v-if="!cartStore.slots.length" class="my-auto text-center">
            <span class="text-neutral-darkGray">
              {{ $t("cart-empty-message") }}
            </span>
            <NuxtLink to="/institutions" class="link" @click="visible = false">
              {{ $t("cart-empty-search-page-message") }}
            </NuxtLink>
          </div>
          <CartItems
            v-else
            :slots="cartStore.slots"
            :removable="true"
            @remove="onSlotRemove"
          ></CartItems>
          <hr class="border-primary border-2 rounded-full mt-auto" />

          <div class="flex justify-between text-secondary">
            <span class="font-semibold">{{ $t("cart-total-price") }}</span>
            <span class="font-semibold underline underline-offset-2">
              {{ getTotalAmount().toFixed(2) }} €
            </span>
          </div>

          <div
            v-if="
              institution?.payment_options.includes('plans') &&
              getUserPlans().length
            "
          >
            <div class="flex flex-wrap justify-between items-center gap-y-1">
              <div>
                <UiFormCheckbox
                  v-model="usePlan"
                  :label="$t('cart-use-plan-title')"
                  id="use-plan"
                >
                </UiFormCheckbox>
              </div>
              <div class="flex items-center gap-x-0.5">
                <select
                  v-model="selectedPlan"
                  class="text-neutral-darkGray border-2 border-secondary rounded-lg px-1 py-0.5 hover:cursor-pointer"
                >
                  <option
                    v-for="plan in getUserPlans()"
                    :value="plan"
                    class="overflow-clip"
                  >
                    {{ plan.plans_id.title }}
                  </option>
                </select>
              </div>
            </div>
            <div
              v-if="usePlan && selectedPlan"
              class="text-left text-neutral-red text-sm pt-1"
            >
              <span> {{ $t("cart-plan-reservations") }} </span>
              <span class="font-bold">
                {{ selectedPlan.total_reservations }}
              </span>
            </div>
            <div v-else class="text-left text-neutral-red text-sm pt-1">
              <span>
                {{ $t("cart-tokens-disclaimer") }}
                <NuxtLink class="link">{{
                  $t("cart-tokens-disclaimer-link-title")
                }}</NuxtLink>
              </span>
            </div>
          </div>
          <div v-else>
            <div class="flex flex-wrap justify-between items-center gap-y-1">
              <div class="text-left text-neutral-red text-sm pt-1">
                <span>
                  {{ $t("cart-tokens-disclaimer") }}
                  <NuxtLink class="link">{{
                    $t("cart-tokens-disclaimer-link-title")
                  }}</NuxtLink>
                </span>
              </div>
            </div>
          </div>
        </div>

        <UiButton
          class="row-span-1 w-full h-full flex items-center justify-center gap-x-2 self-end"
          :disabled="!canReserve"
          @click="onReservation"
        >
          <span class="uppercase">{{ getButtonText() }}</span>
          <Icon
            :name="
              reservationStatus == 'idle'
                ? 'i-ic:baseline-edit-calendar'
                : reservationStatus == 'pending'
                ? 'i-svg-spinners:bars-scale-fade'
                : 'i-line-md:check-all'
            "
            size="22"
            class="text-neutral-white"
          />
        </UiButton>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
  import { useCartStore } from "~/stores/cart";
  import type { ApiError } from "~/types/error";
  import type { ApiInstitution } from "~/types/institution";
  import type { TimetableSlot } from "~/types/misc";
  import type { ApiPlanUser } from "~/types/plan";

  const { user } = useDirectusUsers();
  const stateStore = useStateStore();
  const cartStore = useCartStore();
  const route = useRoute();
  const { t } = useI18n();

  const modal = ref<HTMLElement | null>(null);
  const visible = defineModel("visible", {
    default: false,
  });

  const { institution } = defineProps<{
    institution: ApiInstitution | null;
  }>();

  onClickOutside(modal, () => {
    visible.value = false;
  });

  const getTotalAmount = () => {
    const total = cartStore.slots.reduce((sum, slot) => {
      return sum + slot.slot_definition.price;
    }, 0);

    return total;
  };

  const onSlotRemove = (slot: TimetableSlot) => {
    const index = cartStore.slots.findIndex((s) => s.id == slot.id);
    if (index != undefined && index >= 0) cartStore.slots.splice(index, 1);
  };

  const usePlan = ref(false);
  const selectedPlan = ref<ApiPlanUser | null>(null);
  const getUserPlans = () => {
    const slug = route.params.slug;

    return user.value?.plans.filter((plan: ApiPlanUser) => {
      if (typeof plan.plans_id !== "object") return false;

      return plan.plans_id && plan.plans_id.service?.institution.slug === slug;
    });
  };

  const getButtonText = () => {
    if (reservationStatus.value == "pending")
      return t("cart-button-title-booking");
    else if (reservationStatus.value == "success")
      return t("cart-button-title-booked");

    if (usePlan.value) {
      if (
        selectedPlan.value?.total_reservations &&
        selectedPlan.value?.total_reservations <= 0
      )
        return t("cart-button-title-lack-of-reservations");
    } else {
      if (user.value?.tokens < getTotalAmount())
        return t("cart-button-title-lack-of-tokens");
    }

    return "Book";
  };

  watch(visible, () => {
    const userPlans = getUserPlans();
    console.log("visible cahnges");

    if (institution?.payment_options.includes("plans")) {
      console.log("institution uses plans");
      if (userPlans.length) {
        if (selectedPlan.value !== userPlans.at(0)) {
          selectedPlan.value = userPlans.at(0);
        }

        usePlan.value = true;
      }
    } else {
      usePlan.value = false;
    }
  });

  const canReserve = computed(() => {
    if (reservationStatus.value !== "idle") return false;
    if (!user.value) return false;

    if (usePlan.value) {
      if (
        !getUserPlans().length ||
        !selectedPlan.value ||
        selectedPlan.value.total_reservations < cartStore.slots.length
      )
        return false;
    } else {
      if (user.value.tokens < getTotalAmount()) return false;
    }

    return true;
  });

  const reservationStatus = ref<"idle" | "pending" | "success">("idle");
  const onReservation = async () => {
    reservationStatus.value = "pending";
    let planID = null;
    if (usePlan.value && typeof selectedPlan.value?.plans_id === "object") {
      planID = selectedPlan.value.plans_id.id;
    }

    try {
      await cartStore.reserveSlots(planID);
      reservationStatus.value = "success";

      // hide modal
      setTimeout(() => {
        visible.value = false;
      }, 1500);
    } catch (_error: any) {
      const error: ApiError = _error;
      if (error.type == "cart_change") {
        console.log(
          "Time slot has been reerved in the mean time, recheck with user if hes sure to complete reservation"
        );
      } else {
        console.log("Some other error", error);
      }

      reservationStatus.value = "idle";
    }
  };

  const onClose = () => {
    if (reservationStatus.value == "pending") return;

    visible.value = false;
    reservationStatus.value = "idle";
  };
</script>

<style>
  body:has(div.modal-open) {
    overflow: hidden !important;
  }
</style>
