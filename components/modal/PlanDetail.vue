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
          <h2 class="text-2xl text-secondary font-bold">{{ plan?.title }}</h2>
          <Icon
            name="i-ic:outline-cancel"
            size="28"
            class="text-secondary"
            @click="onClose"
          />
        </div>

        <div class="row-span-10 flex flex-col gap-y-2">
          <div class="flex flex-col justify-center gap-y-2 text-center my-auto">
            <div v-if="plan?.total_reservations">
              <div class="text-secondary font-semibold text-xl">
                Število rezervacij na voljo
              </div>
              <div class="font-semibold">{{ plan?.total_reservations }}</div>
            </div>

            <div>
              <div class="text-secondary font-semibold text-xl">
                Število rezervacij na dan
              </div>
              <div class="font-semibold">
                {{ plan?.total_reservations_per_day }}
              </div>
            </div>

            <div>
              <div class="text-secondary font-semibold text-xl">
                Število dni vnaprej
              </div>
              <div class="font-semibold">
                {{ plan?.days_in_advance_to_reserve }}
              </div>
            </div>

            <div v-if="plan?.note">
              <div
                class="text-secondary font-semibold text-xl underline underline-offset-2"
              >
                Opomba
              </div>
              <div class="font-semibold">
                {{ plan?.note }}
              </div>
            </div>
          </div>
        </div>

        <UiButton
          v-if="plan?.buyable"
          class="w-full h-full flex items-center justify-center gap-x-2 self-end"
          :disabled="
            userOwnsPlan() || (plan.price && user?.tokens <= plan.price)
          "
          @click="$router.push('/tokens')"
        >
          <span class="uppercase">
            {{ getButtonText() }}
          </span>
        </UiButton>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { ApiPlan } from "~/types/plan";

  const { user } = useDirectusAuth();
  const stateStore = useStateStore();

  const modal = ref<HTMLElement | null>(null);
  const visible = defineModel("visible", {
    default: false,
  });

  const props = defineProps({
    plan: Object as PropType<Partial<ApiPlan>>,
  });

  const userOwnsPlan = () => {
    return props.plan?.users?.some(
      (u) => u.directus_users_id == user.value?.id
    );
  };

  const getButtonText = () => {
    return userOwnsPlan()
      ? "Paket je že v lasti"
      : `Nakup paketa ( ${props.plan?.price?.toFixed(2)} €)`;
  };

  const onClose = () => {
    visible.value = false;
  };
</script>

<style></style>
