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
    </div>

    <div v-if="institution?.content" class="px-4 py-4">
      <div v-html="institution?.content" class="text-neutral-darkGray"></div>
    </div>

    <!-- schedule -->
    <div
      v-if="institution && institutionStatus != 'pending'"
      class="m-4 flex flex-col gap-y-2 rounded-md"
    >
      <h2 class="text-2xl font-semibold text-secondary">Termini</h2>
      <div class="flex flex-col gap-y-4">
        <UiDatePicker
          v-model="selectedDate"
          :display-type="institution?.display_type"
          @update:model-value="onDatePicked"
        ></UiDatePicker>

        <Schedule
          :timetables="timetables"
          :display-type="institution.display_type"
          :loading="
            servicesStatus == 'pending' || reservedSlotsStatus == 'pending'
          "
          @select="onVariantSelect"
        ></Schedule>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { eachDayOfInterval, format, max, min } from "date-fns";
  import { toZonedTime } from "date-fns-tz";
  import { register } from "swiper/element";
  import type { ApiInstitution } from "~/types/institution";
  import type { Timetable, TimetableSlot } from "~/types/misc";
  import type { ApiDayDefinition, ApiSlot } from "~/types/schedule";
  import type { ApiService, ApiVariant } from "~/types/service";
  register(); // registers swiper elements

  const { readItems } = useDirectusItems();
  const route = useRoute();

  const cartStore = useCartStore();

  // datepicker stuff
  const selectedDate = ref<Date | [string, string]>(new Date());
  const onDatePicked = async () => {
    selectedServiceVariants.value = {};
    cartStore.slots = [];

    await fetchServices();
    await fetchReservedSlots();

    generateTimetables();
  };

  onMounted(async () => {
    // if looking at different institution, clear the current cart
    cartStore.slots = [];
  });

  // institution data request
  const {
    data: institution,
    error: institutionError,
    status: institutionStatus,
  } = await useAsyncData<ApiInstitution>(
    "institution",
    () =>
      // @ts-ignore
      readItems("institutions", {
        fields: [
          "id",
          "slug",
          "title",
          "content",
          "address",
          "city.*",
          "phone",
          "website",
          "display_type",
          "images.directus_files_id.*",
        ],
        filter: {
          slug: {
            _icontains: route.params.slug ?? "",
          },
        },
        limit: 1,
      }),
    {
      transform: (data) => {
        // @ts-ignore
        return data.length ? data[0] : null;
      },
    }
  );

  const selectedServiceVariants = ref<
    Record<
      string,
      {
        serviceId: string;
        variantId: number;
        date: Date;
      }
    >
  >({});

  // services data request
  const {
    data: services,
    error: servicesError,
    status: servicesStatus,
    execute: fetchServices,
  } = await useLazyAsyncData<ApiService[]>(
    "services",
    () =>
      // @ts-ignore
      readItems("services", {
        fields: [
          "id",
          "title",
          "type",
          "variants.id",
          "variants.title",
          "variants.slot_definitions.id",
          "variants.slot_definitions.days_of_week",
          "variants.slot_definitions.time_start",
          "variants.slot_definitions.time_end",
          "variants.slot_definitions.duration",
          "variants.slot_definitions.price",
          "variants.slot_definitions.variant.id",
          "variants.slot_definitions.variant.service.id",
          "variants.service.id",
          "schedule.id",
          "schedule.title",
          "schedule.day_definitions.day_of_week",
          "schedule.day_definitions.time_start",
          "schedule.day_definitions.time_end",
        ],
        filter: {
          institution: {
            slug: {
              _icontains: route.params.slug ?? "",
            },
          },
        },
      }),
    {
      transform: (data) => {
        // reset selected variants and cartStore slots
        selectedServiceVariants.value = {};
        cartStore.slots = [];

        return data;
      },
      immediate: false,
    }
  );

  // reserved slots filter
  const reservedSlotsFilter = computed(() => {
    if (Array.isArray(selectedDate.value)) {
      return {
        _and: [
          {
            date: {
              _gte: selectedDate.value[0],
            },
          },
          {
            date: {
              _lte: selectedDate.value[1],
            },
          },
        ],
      };
    } else {
      return {
        date: {
          _eq: selectedDate.value,
        },
      };
    }
  });

  // reserved slots data request
  const {
    data: reservedSlots,
    error: reservedSlotsError,
    status: reservedSlotsStatus,
    execute: fetchReservedSlots,
  } = await useLazyAsyncData<ApiSlot[]>(
    "slots",
    () =>
      // @ts-ignore
      readItems("slots", {
        fields: [
          "date",
          "time_start",
          "time_end",
          "slot_definition.id",
          "slot_definition.variant.id",
          "slot_definition.variant.service.id",
        ],
        filter: reservedSlotsFilter.value,
      }),
    {
      immediate: false,
    }
  );

  const timetables = ref<Timetable[]>([]);
  const generateTimetables = () => {
    const timezone = "Europe/Ljubljana";

    if (Array.isArray(selectedDate.value)) {
      // weekly display
      const dates = eachDayOfInterval({
        start: selectedDate.value[0],
        end: selectedDate.value[1],
      });

      timetables.value = generateTimetablesFromDates(
        dates.map((date) => toZonedTime(date, timezone)) // convert date to sl zimezone
      );
    } else {
      // daily display
      timetables.value = generateTimetablesFromDates([
        toZonedTime(selectedDate.value, timezone), // convert date to sl zimezone
      ]);
    }

    return timetables;
  };

  const generateTimetablesFromDates = (dates: Date[]) => {
    const newTimetables: Timetable[] = [];

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const dayName = format(date, "EEEE").toLowerCase();

      services.value?.forEach((service) => {
        // get schedule settings based on the day of week
        const dayDefinition = service.schedule?.day_definitions?.find(
          (day) => day.day_of_week === dayName
        );
        if (!dayDefinition) return;

        const slots: TimetableSlot[] = [];
        const timetableID = `${service.id}-${dayName}`;
        slots.push(
          ...generateSingleVariantSlots(
            date,
            service,
            dayDefinition,
            timetableID
          )
        );

        newTimetables.push({
          id: timetableID,
          title: service.title,
          date: date,
          slots: slots,
          service: service,
        });
      });
    }

    return newTimetables;
  };

  const generateSingleVariantSlots = (
    date: Date,
    service: ApiService,
    dayDefinition: ApiDayDefinition,
    timetableID: string
  ) => {
    if (!service.variants || !service.variants?.length) return [];

    // find selected variant (if one is selected)
    let variant = service.variants?.find(
      (variant) =>
        timetableID in selectedServiceVariants.value &&
        selectedServiceVariants.value[timetableID].variantId == variant.id
    );
    if (!variant) {
      // if no selected variant, set first one as selected
      variant = service.variants[0];
      selectedServiceVariants.value[timetableID] = {
        serviceId: service.id,
        variantId: variant.id,
        date: date,
      };
    }

    const slots: TimetableSlot[] = [];
    variant.slot_definitions?.forEach((slotDefinition) => {
      // only add slots if the setting is set for this day_of_week
      if (!slotDefinition.days_of_week.includes(dayDefinition.day_of_week))
        return;

      // generate slot based on time_start, time_end and duration of the slot
      const generatedSlots = generateSlots(
        date,
        max([
          timeToDate(dayDefinition.time_start),
          timeToDate(slotDefinition.time_start),
        ]),
        min([
          timeToDate(dayDefinition.time_end),
          timeToDate(slotDefinition.time_end),
        ]),
        slotDefinition,
        reservedSlots.value ?? []
      );

      slots.push(...generatedSlots);
    });

    return slots;
  };

  const onVariantSelect = (variant: ApiVariant, timetableId: string) => {
    // remove previous selected slots from the cart (based on variant)
    const updatedSlots = cartStore.slots.filter(
      (slot) =>
        slot.slot_definition.variant.service.id !=
          selectedServiceVariants.value[timetableId].serviceId ||
        slot.slot_definition.variant.id !=
          selectedServiceVariants.value[timetableId].variantId ||
        !doDatesMatch(
          slot.date,
          selectedServiceVariants.value[timetableId].date
        )
    );
    cartStore.slots = updatedSlots;

    if (timetableId in selectedServiceVariants.value)
      selectedServiceVariants.value[timetableId].variantId = variant.id;

    generateTimetables();
  };
</script>

<style></style>
