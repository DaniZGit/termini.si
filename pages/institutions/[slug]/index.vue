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
        ></UiDatePicker>

        <Schedule
          :timetables="getTimetables"
          :display-type="institution.display_type"
          :status="servicesStatus"
          @select="onVariantSelect"
        ></Schedule>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { eachDayOfInterval, format, max, min } from "date-fns";
  import { register } from "swiper/element";
  import type { ApiInstitution } from "~/types/institution";
  import type { Timetable } from "~/types/misc";
  import type { ApiService } from "~/types/service";
  import type { TimeTableSlot } from "~/utils/generateSlots";
  register(); // registers swiper elements

  const { readItems } = useDirectusItems();
  const route = useRoute();

  const cartStore = useCartStore();

  // datepicker stuff
  const selectedDate = ref<Date | [string, string]>(new Date());

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
          "services.id",
          "services.title",
          "services.type",
          "services.variants.id",
          "services.variants.title",
          "services.variants.slot_definitions.time_start",
          "services.variants.slot_definitions.time_end",
          "services.variants.slot_definitions.duration",
          "services.variants.slot_definitions.price",
          "services.schedule.id",
          "services.schedule.title",
          "services.schedule.day_definitions.day_of_week",
          "services.schedule.day_definitions.time_start",
          "services.schedule.day_definitions.time_end",
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
  const selectedServiceVariants = ref<Record<string, number>>({});
  const {
    data: services,
    error: servicesError,
    status: servicesStatus,
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
        // reset selected variants
        selectedServiceVariants.value = {};

        return data;
      },
      watch: [selectedDate],
    }
  );

  const getTimetables = computed(() => {
    let timetables: Timetable[] = [];

    if (Array.isArray(selectedDate.value)) {
      // weekly display
      const dates = eachDayOfInterval({
        start: selectedDate.value[0],
        end: selectedDate.value[1],
      });

      timetables = generateTimetables(dates);
    } else {
      // daily display
      timetables = generateTimetables([selectedDate.value]);
    }

    return timetables;
  });

  const generateTimetables = (dates: Date[]) => {
    const timetables: Timetable[] = [];

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const dayName = format(date, "EEEE").toLowerCase();

      services.value?.forEach((service) => {
        if (!service.variants || !service.variants?.length) return;

        const dayDefinition = service.schedule?.day_definitions?.find(
          (day) => day.day_of_week === dayName
        );
        if (!dayDefinition) return;

        const timetableID = `${service.title}-${dayName}`;
        let variant = service.variants?.find(
          (variant) =>
            timetableID in selectedServiceVariants.value &&
            selectedServiceVariants.value[timetableID] == variant.id
        );
        if (!variant) {
          // if no selected variant, set first one as selected
          variant = service.variants[0];
          selectedServiceVariants.value[timetableID] = variant.id;
        }

        const slots: TimeTableSlot[] = [];
        variant.slot_definitions?.forEach((slotDefinition) => {
          const generatedSlots = generateSlots(
            max([
              timeToDate(dayDefinition.time_start),
              timeToDate(slotDefinition.time_start),
            ]),
            min([
              timeToDate(dayDefinition.time_end),
              timeToDate(slotDefinition.time_end),
            ]),
            slotDefinition.duration,
            slotDefinition.price
          );

          slots.push(...generatedSlots);
        });

        timetables.push({
          id: timetableID,
          title: service.title,
          date: date.toString(),
          slots: slots,
          service: service,
        });
      });
    }

    return timetables;
  };

  const onVariantSelect = (event: Event, id: string) => {
    const el = event.target as HTMLSelectElement;
    selectedServiceVariants.value[id] = parseInt(el.value) || 0;
  };

  onMounted(async () => {
    // if looking at different institution, clear the current cart
    cartStore.slots = [];
  });
</script>

<style></style>
