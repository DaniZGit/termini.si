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
          <h2 class="text-2xl text-secondary font-bold">Termini</h2>
          <Icon
            name="i-ic:outline-cancel"
            size="28"
            class="text-secondary"
            @click="onClose"
          />
        </div>

        <div class="row-span-10 flex flex-col gap-y-2">
          <div v-if="!cartStore.slots.length" class="my-auto text-center">
            <span class="text-neutral-darkGray">
              Trenutno ni izbranih terminov. Poišči ustanovo preko
            </span>
            <NuxtLink to="/institutions" class="link" @click="visible = false">
              iskalnika.
            </NuxtLink>
          </div>

          <div>
            {{ cartStore.slots }}
          </div>
          <!-- <CartItems
            v-else
            :slots="cartStore.slots"
            :removable="true"
            @remove="onSlotRemove"
          ></CartItems> -->
          <hr class="border-primary border-2 rounded-full mt-auto" />

          <div class="flex justify-between text-secondary">
            <span class="font-semibold">Skupna cena</span>
            <span class="font-semibold underline underline-offset-2">
              {{ getTotalAmount().toFixed(2) }} €
            </span>
          </div>

          <div v-if="getUserPlans().length">
            <div class="flex flex-wrap justify-between items-center gap-y-1">
              <div>
                <UiFormCheckbox
                  v-model="usePlan"
                  label="Uporabi paket"
                  id="use-plan"
                >
                </UiFormCheckbox>
              </div>
              <div class="flex items-center gap-x-0.5">
                <select
                  v-model="selectedPlan"
                  class="text-neutral-darkGray border-2 border-secondary rounded-lg px-1 py-0.5"
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
              <span> Število rezervacij na voljo v paketu: </span>
              <span class="font-bold">
                {{ selectedPlan.total_reservations }}.
              </span>
            </div>
            <div v-else class="text-left text-neutral-red text-sm pt-1">
              <span>
                Ker ne uporabljate paketa, se upoštevajo pravila
                <span class="underline underline-offset-2">
                  privzetega paketa
                </span>
                inštitucije za rezervacijo terminov in se v tem primeru
                odštejejo žetoni.
              </span>
            </div>
          </div>
        </div>

        <UiButton
          class="w-full h-full flex items-center justify-center gap-x-2 self-end"
          :disabled="!canReserve"
          @click="onReservation"
        >
          <span class="uppercase">{{
            reservationStatus == "idle"
              ? "Rezerviraj"
              : reservationStatus == "pending"
              ? "V teku rezerviranja"
              : "Rezervirano"
          }}</span>
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
  import type { ApiPlanUser } from "~/types/plan";
  import type { ApiSlot } from "~/types/schedule";

  const { user } = useDirectusUsers();
  const stateStore = useStateStore();
  const cartStore = useCartStore();
  const route = useRoute();

  const modal = ref<HTMLElement | null>(null);
  const visible = defineModel("visible", {
    default: false,
  });

  onClickOutside(modal, () => {
    visible.value = false;
  });

  const getTotalAmount = () => {
    const total = cartStore.slots.reduce((sum, slot) => {
      return sum + slot.slot_definition.price;
    }, 0);

    return total;
  };

  // const onSlotRemove = (slot: ApiSlot) => {
  //   const index = cartStore.slots.findIndex((s) => s.id == slot.id);
  //   if (index >= 0) cartStore.slots.splice(index, 1);
  // };

  const usePlan = ref(true);
  const selectedPlan = ref<ApiPlanUser | null>(null);
  const getUserPlans = () => {
    const slug = route.params.slug;
    const type = route.params.type;

    return user.value?.plans.filter((plan: ApiPlanUser) => {
      if (typeof plan.plans_id !== "object") return false;

      return (
        plan.plans_id &&
        plan.plans_id.service?.institution.slug === slug &&
        plan.plans_id.service.type === type
      );
    });
  };

  watch(visible, () => {
    const userPlans = getUserPlans();

    if (userPlans.length) {
      if (selectedPlan.value !== userPlans.at(0)) {
        selectedPlan.value = userPlans.at(0);
      }

      usePlan.value = true;
    }
  });

  const canReserve = computed(() => {
    if (reservationStatus.value !== "idle") return false;
    if (!user.value) return false;
    if (!usePlan.value && user.value.tokens < getTotalAmount()) return false;
    if (
      usePlan &&
      (!getUserPlans().length ||
        !selectedPlan.value ||
        selectedPlan.value.total_reservations < cartStore.slots.length)
    )
      return false;

    return true;
  });

  const reservationStatus = ref<"idle" | "pending" | "success">("idle");
  const onReservation = async () => {
    reservationStatus.value = "pending";
    let body = {};
    if (usePlan.value && typeof selectedPlan.value?.plans_id === "object")
      body = {
        plan_id: selectedPlan.value.plans_id.id,
      };

    try {
      await cartStore.reserveTimeSlots(body);
      reservationStatus.value = "success";
      cartStore.slots = [];
    } catch (_error: any) {
      const error: ApiError = _error;
      if (error.type == "cart_reservation_slot_change") {
        console.log(
          "Time slot has been reerved in the mean time, recheck with user if hes sure to complete reservation"
        );
      } else {
        console.log("Some other error");
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
