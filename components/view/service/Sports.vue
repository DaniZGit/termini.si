<template>
  <div class="bg-neutral-white">
    <div class="text-center px-4 py-4">
      <h1 class="text-3xl font-semibold text-secondary">
        {{ service.institution.title }}
      </h1>
      <h2 class="text-primary font-semibold text-xl">
        ( {{ getServiceTypeTitle(service) }} )
      </h2>
    </div>

    <div class="px-4 py-4 flex flex-col gap-y-2">
      <!-- <div
        v-if="institution && getInstitutionSports(institution)"
        class="flex gap-x-2"
      >
        <Icon
          name="i-fluent:sport-16-filled"
          size="18"
          class="shrink-0 my-auto text-secondary"
        />
        <div class="flex items-center flex-wrap gap-x-2 gap-y-1">
          <div
            v-for="sport in getInstitutionSports(institution)"
            :key="sport.id"
          >
            <NuxtLink
              :to="`/institutions?sports=${sport.id}`"
              class="text-neutral-darkGray font-medium ring-2 ring-secondary hover:ring-primary rounded-full px-2 text-sm transition-all"
            >
              {{ sport.title }}
            </NuxtLink>
          </div>
        </div>
      </div> -->
    </div>

    <!-- Plans -->
    <!-- <div class="px-4 py-4 flex flex-col">
      <div class="flex justify-between" @click="planToggle = !planToggle">
        <h2 class="text-2xl font-semibold text-secondary">Paketi</h2>
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
        class="flex flex-wrap gap-x-2 gap-y-2 overflow-scroll pt-2"
        :class="{
          'flex-nowrap border-r-2 border-primary pb-2 pr-2': !planToggle,
        }"
      >
        <ItemPlan
          :plan="defaultPlan"
          :bought="true"
          @click="onPlanClick(defaultPlan)"
        ></ItemPlan>

        <ItemPlan
          v-for="plan in institution?.plans"
          :key="plan.id"
          :plan="plan"
          :bought="plan.users?.some((u) => u.directus_users_id == user?.id)"
          @click="onPlanClick(plan)"
        ></ItemPlan>
      </div>
    </div> -->

    <!-- Courts -->
    <!-- <div class="py-4 flex flex-col gap-y-2">
      <div class="flex items-center">
        <h2 class="px-4 text-2xl font-semibold text-secondary">Igrišča</h2>
        <div>
          <VueDatePicker
            v-model="selectedDate"
            :enable-time-picker="false"
            :min-date="new Date()"
            :clearable="false"
            :format="datepickerFormat"
            :auto-apply="true"
          ></VueDatePicker>
        </div>
      </div>
      <div
        v-if="institution && getInstitutionSports(institution)"
        class="flex flex-nowrap overflow-x-auto border-y-2 border-primary no-scrollbar"
      >
        <div
          v-for="(sport, i) in getInstitutionSports(institution)"
          :key="sport.id"
          class="text-center py-2 border-r-2 border-primary last:border-none text-neutral-darkGray font-semibold transition-colors duration-300 px-4"
          style="flex: 1 0 150px"
          :class="{
            'bg-primary text-neutral-white': sport.id == selectedSport?.id,
          }"
          @click="onSportSelect(sport)"
        >
          <span class="flex justify-center items-center gap-x-2">
            <NuxtImg
              :src="useAssetUrl(sport.image.id)"
              class="aspect-square shrink h-[1em] w-auto"
              height="20"
              width="20"
            ></NuxtImg>
            <span>
              {{ sport.title }}
            </span>
          </span>
        </div>
      </div>

      <div v-if="courts?.length" class="flex gap-x-1">
        <div>
          <div
            class="grid grid-flow-row overflow-auto border-r-2 border-secondary"
          >
            <Icon
              name="i-ic:baseline-access-time"
              size="26"
              class="m-auto text-secondary"
              :style="`height: ${timeSlotHeaderRowHeight}px;`"
            />
            <div
              v-for="i in getTimestamps()"
              class="flex justify-center items-start px-2 text-neutral-darkGray font-medium"
              :style="`height: ${timeSlotCellRowHeight}px;`"
            >
              <span class="text-center text-base -translate-y-3">
                {{
                  minsToTime(
                    getMinTimeAcrossAllCourts() +
                      i * getMinSlotDurationAcrossAllCourts()
                  )
                }}
              </span>
            </div>
          </div>
        </div>
        <div
          class="grid grid-flow-col gap-y-4 overflow-auto"
          :style="`grid-auto-columns: ${timeSlotCellColWidth}px;`"
        >
          <div
            v-for="(court, i) in courts"
            :key="court.id"
            class="flex flex-col justify-start text-center"
          >
            <div
              class="flex justify-center items-center"
              :style="`height: ${timeSlotHeaderRowHeight}px;`"
            >
              <h4 class="font-semibold text-secondary">
                {{ court.title }}
              </h4>
            </div>
            <div class="grow relative">
              <ItemTimeSlot
                v-for="(timeSlot, i) in getSortedTimeSlots(
                  court.schedule_days[0].time_slots
                )"
                :key="timeSlot.id"
                :time-slot="timeSlot"
                :top-offset="calculateTimeSlotTopOffset(timeSlot)"
                :height="calculateTimeSlotHeight(timeSlot)"
                @selected="onTimeSlotSelected"
                @unselected="onTimeSlotUnselected"
              ></ItemTimeSlot>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center">
        <h4 class="text-lg font-medium text-neutral-darkGray">
          Trenutno ni terminov za izbrani datum
        </h4>
        <Icon
          name="i-ic:baseline-calendar-month"
          size="32"
          class="text-neutral-darkGray"
        />
      </div>
    </div> -->

    <!-- Cart -->
    <!-- <div
      v-show="cartStore.slots.length"
      class="fixed bottom-0 left-0 right-0 flex justify-center"
    >
      <UiShadowPanel
        class="relative inline-flex justify-center items-center gap-x-2 text-secondary z-30 py-2"
      >
        <UiButton class="py-1 px-2 relative" @click="showCartModal = true">
          <Icon
            name="i-ic:baseline-calendar-month"
            size="22"
            class="text-neutral-white"
          />
          <span
            class="absolute -top-2.5 -right-2.5 flex justify-center items-center aspect-square h-7 w-auto text-sm text-neutral-white bg-secondary rounded-full"
          >
            {{ cartStore.slots.length }}
          </span>
        </UiButton>
      </UiShadowPanel>
    </div> -->

    <!-- Cart Modal -->
    <!-- <ModalCart v-model:visible="showCartModal"></ModalCart> -->

    <!-- Login Required Modal -->
    <!-- <ModalLoginRequired
      v-model:visible="showLoginRequiredModal"
    ></ModalLoginRequired> -->

    <!-- Plan Detail Modal -->
    <!-- <ModalPlanDetail
      v-model:visible="showPlanDetailModal"
      :plan="selectedPlan"
    ></ModalPlanDetail> -->
  </div>
</template>

<script lang="ts" setup>
  import type { PropType } from "vue";
  import type { ApiService, ApiServiceTypeSports } from "~/types/service";

  const props = defineProps({
    service: {
      type: Object as PropType<ApiService & ApiServiceTypeSports>,
      required: true,
    },
  });
</script>

<style></style>
