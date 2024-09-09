<template>
  <div class="bg-neutral-white">
    <div class="text-center px-4 py-4">
      <h1 class="text-3xl font-semibold text-secondary">
        {{ institution?.title }}
      </h1>
    </div>

    <div v-if="institution?.images.length">
      <ClientOnly>
        <swiper-container pagination="true">
          <swiper-slide v-for="image in institution.images" :key="image"
            ><NuxtImg
              :src="useAssetUrl(image.directus_files_id.id)"
              class="aspect-video w-full h-auto"
              width="160"
              height="90"
            ></NuxtImg
          ></swiper-slide>
        </swiper-container>
      </ClientOnly>
    </div>

    <div class="px-4 py-4 flex flex-col gap-y-2">
      <div v-if="institution?.address" class="flex gap-x-2">
        <Icon
          name="i-ic:round-location-on"
          size="18"
          class="shrink-0 my-auto text-secondary"
        />
        <span class="text-neutral-darkGray font-medium">
          {{ beautifyInstitutionAddress(institution) }}</span
        >
      </div>
      <div v-if="institution?.phone" class="flex gap-x-2">
        <Icon
          name="i-ic:baseline-local-phone"
          size="18"
          class="shrink-0 my-auto text-secondary"
        />
        <span class="text-neutral-darkGray font-medium">
          {{ institution.phone }}</span
        >
      </div>
      <div v-if="institution?.website" class="flex gap-x-2">
        <Icon
          name="i-ic:baseline-insert-link"
          size="18"
          class="shrink-0 my-auto text-secondary"
        />
        <NuxtLink
          :to="institution.website"
          :external="true"
          target="_blank"
          class="link"
        >
          {{ institution.website }}
        </NuxtLink>
      </div>
      <div
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
      </div>
    </div>

    <div v-if="institution?.content" class="px-4 py-4">
      <div v-html="institution?.content" class="text-neutral-darkGray"></div>
    </div>

    <!-- Plans -->
    <div class="px-4 py-4 flex flex-col">
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
    </div>

    <!-- Courts -->
    <div class="py-4 flex flex-col gap-y-2">
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
      <!-- Sports tab -->
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

      <!-- Courts Time Slots/Reservations -->
      <div v-if="courts?.length" class="flex gap-x-1">
        <!-- Time Slots timings on the Left side -->
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
        <!-- Time Slots -->
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
    </div>

    <!-- Cart -->
    <div
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
    </div>

    <!-- Cart Modal -->
    <ModalCart v-model:visible="showCartModal"></ModalCart>

    <!-- Login Required Modal -->
    <ModalLoginRequired
      v-model:visible="showLoginRequiredModal"
    ></ModalLoginRequired>

    <!-- Plan Detail Modal -->
    <ModalPlanDetail
      v-model:visible="showPlanDetailModal"
      :plan="selectedPlan"
    ></ModalPlanDetail>
  </div>
</template>

<script lang="ts" setup>
  import { register } from "swiper/element";
  import type { ApiCourt, ApiTimeSlot } from "~/types/court";
  import type { ApiInstitution } from "~/types/institution";
  import type { ApiPlan } from "~/types/plan";
  import type { ApiSport } from "~/types/sport";

  register(); // registers swiper elements

  const { readItems, readSingleton } = useDirectusItems();
  const { user } = useDirectusAuth();

  const route = useRoute();
  const timeSlotHeaderRowHeight = 50; // in pixels
  const timeSlotCellRowHeight = 75; // in pixels
  const timeSlotCellColWidth = 120; // in pixels

  const cartStore = useCartStore();

  // institution data request
  const {
    data: institution,
    error,
    status,
  } = await useAsyncData<ApiInstitution>(
    "institution",
    () =>
      readSingleton("institutions", {
        fields: [
          "id",
          "title",
          "content",
          "address",
          "city.*",
          "phone",
          "website",
          "images.directus_files_id.*",
          "courts.sport.id",
          "courts.sport.title",
          "courts.sport.image.*",
          "total_reservations_per_day",
          "days_in_advance_to_reserve",
          "plans.id",
          "plans.title",
          "plans.total_reservations",
          "plans.total_reservations_per_day",
          "plans.days_in_advance_to_reserve",
          "plans.buyable",
          "plans.price",
          "plans.seasonal",
          "plans.available_from",
          "plans.available_to",
          "plans.note",
          "plans.users.*",
        ],
        filter: {
          slug: {
            _icontains: route.params.slug ?? "",
          },
        },
        deep: {
          plans: {
            users: {
              _filter: {
                directus_users_id: user.value?.id ?? "",
              },
            },
          },
        },
      }),
    {
      transform: (data) => {
        return data.length ? data[0] : null;
      },
    }
  );

  // plans
  const planToggle = ref(false);
  const defaultPlan = computed(() => ({
    title: "Privzeto",
    total_reservations_per_day: institution.value?.total_reservations_per_day,
    days_in_advance_to_reserve: institution.value?.days_in_advance_to_reserve,
    note: "Ta paket imajo vsi uporabniki in vsebuej privzete vrednost za število rezervacij na dan in za koliko dni vnaprej lahko navadni uporabnik rezervira",
  }));

  const showPlanDetailModal = ref(false);
  const selectedPlan = ref<Partial<ApiPlan> | null>(null);
  const onPlanClick = (plan: Partial<ApiPlan>) => {
    selectedPlan.value = plan;
    showPlanDetailModal.value = true;
  };

  // sports tab
  const selectedSport = ref<ApiSport | null>(null);
  const onSportSelect = (sport: ApiSport) => {
    if (sport.id == selectedSport.value?.id) selectedSport.value = null;
    else selectedSport.value = sport;
  };

  // date picker
  const selectedDate = ref(new Date());
  const formattedDateValue = useDateFormat(selectedDate, "YYYY-MM-DD");
  const datepickerFormat = (date: Date) => {
    const formattedDate = useDateFormat(date, "DD. MM. YYYY (dddd)", {
      locales: "sl",
    });

    return formattedDate.value;
  };

  // courts data request
  const { data: courts } = await useAsyncData<ApiCourt[]>(
    "courts",
    () =>
      readItems("courts", {
        fields: [
          "id",
          "title",
          "schedule_days.id",
          "schedule_days.date",
          "schedule_days.time_slots.id",
          "schedule_days.time_slots.start_time",
          "schedule_days.time_slots.end_time",
          "schedule_days.time_slots.price",
          "schedule_days.time_slots.status",
          "schedule_days.time_slots.current_temp",
          "schedule_days.time_slots.schedule_day.date",
          "schedule_days.time_slots.schedule_day.court.id",
          "schedule_days.time_slots.schedule_day.court.title",
          "schedule_days.time_slots.schedule_day.court.institution.id",
          "schedule_days.time_slots.schedule_day.court.institution.slug",
        ],
        filter: {
          institution: {
            slug: {
              _icontains: route.params.slug ?? "",
            },
          },
          sport: {
            id: {
              _eq: selectedSport.value?.id,
            },
          },
          schedule_days: {
            date: {
              _eq: formattedDateValue.value,
            },
          },
        },
        deep: {
          schedule_days: {
            _filter: {
              date: {
                _eq: formattedDateValue.value,
              },
            },
            _limit: 1,
          },
        },
      }),
    {
      watch: [selectedSport, selectedDate],
    }
  );

  onMounted(async () => {
    // if looking at different institution, clear the current cart
    if (
      cartStore.slots.length &&
      cartStore.slots[0].schedule_day.court.institution.id !=
        institution.value?.id
    ) {
      cartStore.slots = [];
    }

    // realtime data - maybe can move this outside the onmounted hook - https://github.com/Intevel/nuxt-directus/issues/264
    const client = useDirectusRealtime();

    await client.connect();

    const { subscription } = await client.subscribe("time_slots", {
      event: "update",
      query: {
        fields: ["id", "status", "schedule_day.id", "schedule_day.court.id"],
      },
    });

    for await (const item of subscription) {
      console.log("time_slot update", item);
      if (!item.data) continue;

      const changedTimeSlots = item.data as ApiTimeSlot[];
      changedTimeSlots.forEach((changedSlot) => {
        if (!courts.value) return;

        const courtIndex = courts.value?.findIndex(
          (court) => court.id == changedSlot.schedule_day.court.id
        );
        if (courtIndex == undefined || courtIndex < 0) return;

        const scheduleDayIndex = courts.value[
          courtIndex
        ].schedule_days.findIndex(
          (scheduleDay) => scheduleDay.id == changedSlot.schedule_day.id
        );
        if (scheduleDayIndex == undefined || scheduleDayIndex < 0) return;

        const timeSlotIndex = courts.value[courtIndex].schedule_days[
          scheduleDayIndex
        ].time_slots.findIndex((slot) => slot.id == changedSlot.id);
        if (timeSlotIndex == undefined || timeSlotIndex < 0) return;

        // update the time_slot
        courts.value[courtIndex].schedule_days[scheduleDayIndex].time_slots[
          timeSlotIndex
        ].status = changedSlot.status;
      });
    }
  });

  // cart modal
  const showCartModal = ref(false);
  const showLoginRequiredModal = ref(false);
  const onTimeSlotSelected = (timeSlot: ApiTimeSlot) => {
    // if user is not logged in, display "log in first" modal
    if (!user.value) {
      showLoginRequiredModal.value = true;
      return;
    }

    cartStore.slots.push(timeSlot);
  };

  const onTimeSlotUnselected = (timeSlot: ApiTimeSlot) => {
    console.log("slot unselected", timeSlot);

    const existingTimeSlotIndex = cartStore.slots.findIndex(
      (ts) => ts.id == timeSlot.id
    );
    if (existingTimeSlotIndex >= 0) {
      cartStore.slots.splice(existingTimeSlotIndex, 1);
    }
  };

  // helper functions
  const getTimestamps = () => {
    const minMaxTimeDiff =
      (getMaxTimeAcrossAllCourts() - getMinTimeAcrossAllCourts()) /
      getMinSlotDurationAcrossAllCourts();

    return [...Array(Math.floor(minMaxTimeDiff) + 1).keys()];
  };

  const getMinSlotDurationAcrossAllCourts = () => {
    let minDuration = 24 * 60; // 24h -> mins
    courts.value?.forEach((court) => {
      court.schedule_days[0].time_slots.forEach((slot) => {
        const slotStartTimeMins = timeToMins(slot.start_time);
        const slotEndTimeMins = timeToMins(slot.end_time);
        if (slotEndTimeMins - slotStartTimeMins < minDuration)
          minDuration = slotEndTimeMins - slotStartTimeMins;
      });
    });

    return minDuration;
  };

  const getMinTimeAcrossAllCourts = () => {
    let minTime = 24 * 60; // in minutes
    courts.value?.forEach((court) => {
      court.schedule_days[0].time_slots.forEach((slot) => {
        const slotStartTimeMins = timeToMins(slot.start_time);
        if (slotStartTimeMins < minTime) minTime = slotStartTimeMins;
      });
    });

    return minTime;
  };

  const getMaxTimeAcrossAllCourts = () => {
    let maxTime = 0; // in minutes
    courts.value?.forEach((court) => {
      court.schedule_days[0].time_slots.forEach((slot) => {
        const slotStartTimeMins = timeToMins(slot.end_time);
        if (slotStartTimeMins > maxTime) maxTime = slotStartTimeMins;
      });
    });

    return maxTime;
  };

  const calculateTimeSlotTopOffset = (timeSlot: ApiTimeSlot) => {
    let timeSlotMinutes = timeToMins(timeSlot.start_time);
    let minTimeMinutes = getMinTimeAcrossAllCourts();

    const timeSlotHours = Math.floor(timeSlotMinutes / 60);
    const minTimeHours = Math.floor(minTimeMinutes / 60);

    timeSlotMinutes = timeSlotMinutes % 60;
    minTimeMinutes = minTimeMinutes % 60;

    const topOffset =
      (timeSlotHours - minTimeHours + timeSlotMinutes / 60) *
      timeSlotCellRowHeight *
      (60 / getMinSlotDurationAcrossAllCourts());

    return topOffset;
  };

  const calculateTimeSlotHeight = (timeSlot: ApiTimeSlot) => {
    const startTimeMins = timeToMins(timeSlot.start_time);
    const endTimeMins = timeToMins(timeSlot.end_time);

    const slotDuration = endTimeMins - startTimeMins;
    const minSlotDuration = getMinSlotDurationAcrossAllCourts();

    const topOffset = (slotDuration / minSlotDuration) * timeSlotCellRowHeight;

    return topOffset;
  };
</script>

<style></style>
