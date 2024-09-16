<template>
  <div class="flex justify-between" @click="onExpand">
    <div class="flex items-center gap-x-2">
      <h2 class="text-2xl font-semibold text-secondary">Paketi</h2>
      <Icon name="i-ic:outline-info" size="22" class="text-secondary" />
    </div>
    <div>
      <Icon
        name="i-ic:baseline-expand-more"
        size="32"
        class="text-secondary"
        :class="{ '-rotate-90': !planToggle }"
      />
    </div>
  </div>
  <div
    ref="plansContainer"
    class="flex flex-wrap gap-x-2 gap-y-2 overflow-scroll pt-2"
    :class="{
      'flex-nowrap pb-2 pr-2': !planToggle,
      'border-r-2 border-primary': isPlansContainerOverflown() && !planToggle,
    }"
  >
    <ItemPlan
      :plan="defaultPlan"
      :bought="true"
      class="text-nowrap"
      @click="onPlanClick(defaultPlan)"
    ></ItemPlan>

    <ItemPlan
      v-for="plan in service?.plans"
      :key="plan.id"
      :plan="plan"
      :bought="false"
      class="text-nowrap"
      @click="onPlanClick(plan)"
    ></ItemPlan>

    <!-- Plan Detail Modal -->
    <ModalPlanDetail
      v-model:visible="showPlanDetailModal"
      :plan="selectedPlan"
    ></ModalPlanDetail>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiPlan } from "~/types/plan";
  import type { ApiService } from "~/types/service";

  const props = defineProps({
    service: {
      type: Object as PropType<ApiService>,
      required: true,
    },
  });

  const plansContainer = ref<HTMLElement | null>(null);
  const showPlanDetailModal = ref(false);
  const selectedPlan = ref<Partial<ApiPlan> | null>(null);
  const planToggle = ref(false);
  const onPlanClick = (plan: Partial<ApiPlan>) => {
    selectedPlan.value = plan;
    showPlanDetailModal.value = true;
  };

  const defaultPlan = computed(() => ({
    title: "Privzeto",
    total_reservations_per_day: props.service?.total_reservations_per_day,
    days_in_advance_to_reserve: props.service?.days_in_advance_to_reserve,
    note: "Ta paket imajo vsi uporabniki in vsebuej privzete vrednost za število rezervacij na dan in za koliko dni vnaprej lahko navadni uporabnik rezervira",
  }));

  const isPlansContainerOverflown = () => {
    if (!props.service.plans) return false;

    return props.service.plans.length > 1;
  };

  const onExpand = () => {
    if (!isPlansContainerOverflown()) return;

    planToggle.value = !planToggle.value;
  };
</script>

<style></style>
