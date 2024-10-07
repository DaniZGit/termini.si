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
          @update:model-value="onDateSelect"
        ></UiDatePicker>

        <Schedule
          :timetables="timetables"
          :display-type="institution.display_type"
          :status="servicesStatus"
          @select="onVariantSelect"
          @remove="onVariantRemove"
        ></Schedule>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { eachDayOfInterval, format, max, min } from "date-fns";
  import { register } from "swiper/element";
  import type { ApiInstitution } from "~/types/institution";
  import type { Timetable, TimetableSlot } from "~/types/misc";
  import type { ApiDayDefinition } from "~/types/schedule";
  import type {
    ApiService,
    ApiServiceVariantSelection,
    ApiVariant,
  } from "~/types/service";
  register(); // registers swiper elements

  const { readItems } = useDirectusItems();
  const route = useRoute();

  const cartStore = useCartStore();

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

  // services data request
  const selectedServiceVariants = ref<
    Record<
      string,
      {
        id?: number; // in case of selection type "single"
        ids?: Set<number>; // in case of selection type "multiple"
        date: Date;
        selection: ApiServiceVariantSelection;
      }
    >
  >({});
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
          "variant_selection",
          "variant_handling",
          "variants.id",
          "variants.title",
          "variants.slot_definitions.id",
          "variants.slot_definitions.days_of_week",
          "variants.slot_definitions.time_start",
          "variants.slot_definitions.time_end",
          "variants.slot_definitions.duration",
          "variants.slot_definitions.price",
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

  // datepicker stuff
  const selectedDate = ref<Date | [string, string]>(new Date());
  const onDateSelect = async () => {
    await fetchServices();
    generateTimetables();
  };

  const timetables = ref<Timetable[]>([]);
  const generateTimetables = () => {
    if (Array.isArray(selectedDate.value)) {
      // weekly display
      const dates = eachDayOfInterval({
        start: selectedDate.value[0],
        end: selectedDate.value[1],
      });

      timetables.value = generateTimetablesFromDates(dates);
    } else {
      // daily display
      timetables.value = generateTimetablesFromDates([selectedDate.value]);
    }
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
        const timetableID = `${service.title}-${dayName}`;
        if (service.variant_selection == "single") {
          slots.push(
            ...generateSingleVariantSlots(
              date,
              service,
              dayDefinition,
              timetableID
            )
          );
        } else if (service.variant_selection == "multiple") {
          slots.push(
            ...generateMultipleVariantSlots(
              date,
              service,
              dayDefinition,
              timetableID
            )
          );
        }

        newTimetables.push({
          id: timetableID,
          title: service.title,
          date: date.toString(),
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
        selectedServiceVariants.value[timetableID].id == variant.id
    );
    if (!variant) {
      // if no selected variant, set first one as selected
      variant = service.variants[0];
      selectedServiceVariants.value[timetableID] = {
        id: variant.id,
        date: date,
        selection: service.variant_selection,
      };
    }

    const slots: TimetableSlot[] = [];
    variant.slot_definitions?.forEach((slotDefinition) => {
      // only add slots if the setting is set for this day_of_week
      if (!slotDefinition.days_of_week.includes(dayDefinition.day_of_week))
        return;

      // generate slot based on time_start, time_end and duration of the slot
      const generatedSlots = generateSlots(
        variant,
        slotDefinition,
        date,
        max([
          timeToDate(dayDefinition.time_start),
          timeToDate(slotDefinition.time_start),
        ]),
        min([
          timeToDate(dayDefinition.time_end),
          timeToDate(slotDefinition.time_end),
        ])
      );

      slots.push(...generatedSlots);
    });

    return slots;
  };

  // this doesnt work
  // moramo ustvariti skupni urnik med vsemi variantami na podlagi slot_definitions
  // treba pazit na to da slot_definition vsebuje razlicne case, duration in price
  const generateMultipleVariantSlots = (
    date: Date,
    service: ApiService,
    dayDefinition: ApiDayDefinition,
    timetableID: string
  ) => {
    if (!service.variants || !service.variants?.length) return [];

    // find selected variants (if one is selected)
    let variants = service.variants?.filter(
      (variant) =>
        timetableID in selectedServiceVariants.value &&
        selectedServiceVariants.value[timetableID].ids?.has(variant.id)
    );
    if (!variants.length) {
      // if no selected variants, set first one as selected
      variants = [service.variants[0]];
      selectedServiceVariants.value[timetableID] = {
        ids: new Set([service.variants[0].id]),
        date: date,
        selection: service.variant_selection,
      };
    }

    let slots: TimetableSlot[] = [];
    variants.forEach((variant) => {
      variant.slot_definitions?.forEach((slotDefinition) => {
        // only add slots if the setting is set for this day_of_week
        if (!slotDefinition.days_of_week.includes(dayDefinition.day_of_week))
          return;

        // generate slot based on time_start, time_end and duration of the slot
        const generatedSlots = generateSlots(
          variant,
          slotDefinition,
          date,
          max([
            timeToDate(dayDefinition.time_start),
            timeToDate(slotDefinition.time_start),
          ]),
          min([
            timeToDate(dayDefinition.time_end),
            timeToDate(slotDefinition.time_end),
          ])
        );

        for (let i = 0; i < generatedSlots.length; i++) {
          const generatedSlot = generatedSlots[i];
          const slotIndex = slots.findIndex((slot) => {
            return doSlotsMatch(slot, generatedSlot);
          });
          if (slotIndex >= 0) {
            if (service.variant_handling === "max_value") {
              slots[slotIndex] = {
                ...slots[slotIndex],
                duration: slots[slotIndex].duration + generatedSlot.duration,
                price: slots[slotIndex].price + generatedSlot.price,
                variants: slots[slotIndex].variants.concat(
                  ...generatedSlot.variants
                ),
              };
            } else if (service.variant_handling === "aggregate") {
              slots[slotIndex] = {
                ...slots[slotIndex],
                duration: Math.max(
                  slots[slotIndex].duration,
                  generatedSlot.duration
                ),
                price: Math.max(slots[slotIndex].price, generatedSlot.price),
                variants: slots[slotIndex].variants.concat(
                  ...generatedSlot.variants
                ),
              };
            }
          } else {
            slots.push(generatedSlot);
          }
        }
      });
    });

    return slots;
  };

  const onVariantSelect = (variant: ApiVariant, timetableId: string) => {
    if (selectedServiceVariants.value[timetableId].selection === "single") {
      selectedServiceVariants.value[timetableId].id = variant.id;
    } else {
      selectedServiceVariants.value[timetableId].ids?.add(variant.id);
    }

    generateTimetables();
  };

  const onVariantRemove = (variant: ApiVariant, timetableId: string) => {
    if (selectedServiceVariants.value[timetableId].selection === "multiple") {
      // remove selected variant from the Set
      selectedServiceVariants.value[timetableId].ids?.delete(variant.id);
    }

    // remove slots from the cart
    // const updatedSlots = cartStore.slots.filter(
    //   (slot) =>
    //     slot.date.getTime() ==
    //     selectedServiceVariants.value[timetableId].date.getTime()
    // );

    // if (selectedServiceVariants.value[timetableId].selection === "single") {
    //   cartStore.slots = updatedSlots.filter(
    //     (slot) =>
    //       !slot.variants.some(
    //         (v) => v.id == selectedServiceVariants.value[timetableId].id
    //       )
    //   );
    // } else if (
    //   selectedServiceVariants.value[timetableId].selection === "multiple"
    // ) {
    //   cartStore.slots = updatedSlots.filter(
    //     (slot) =>
    //       !slot.variants.some((v) =>
    //         selectedServiceVariants.value[timetableId].ids?.has(v.id)
    //       )
    //   );
    // }

    generateTimetables();
  };
</script>

<style></style>
