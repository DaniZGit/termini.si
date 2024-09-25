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
      v-for="plan in plans"
      :key="plan.id"
      :plan="plan"
      :bought="user?.plans?.some((p) => p.plans_id.id == plan.id)"
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

  const props = defineProps({
    plans: {
      type: Array as PropType<ApiPlan[]>,
    },
  });

  const { user } = useDirectusAuth();

  const plansContainer = ref<HTMLElement | null>(null);
  const showPlanDetailModal = ref(false);
  const selectedPlan = ref<Partial<ApiPlan> | null>(null);
  const planToggle = ref(false);
  const onPlanClick = (plan: Partial<ApiPlan>) => {
    selectedPlan.value = plan;
    showPlanDetailModal.value = true;
  };

  const isPlansContainerOverflown = () => {
    if (!props.plans) return false;

    return props.plans.length > 2;
  };

  const onExpand = () => {
    if (!isPlansContainerOverflown()) return;

    planToggle.value = !planToggle.value;
  };
</script>

<style></style>
