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

    <!-- Services -->
    <div class="m-4 flex flex-col gap-y-2 rounded-md">
      <h2 class="text-2xl font-semibold text-secondary">Storitve</h2>
      <div class="flex flex-col gap-y-4">
        <NuxtLink
          v-for="service in institution?.services"
          :key="service.id"
          :to="`/institutions/${institution?.slug}/${service.type}`"
          class="border-b-2 border-primary pb-2 group"
        >
          <div class="flex items-center gap-x-2">
            <Icon
              name="i-ic:baseline-design-services"
              size="32"
              class="text-primary"
            />
            <h4 class="text-lg font-semibold text-secondary">
              {{ getServiceTypeTitle(service) }}
            </h4>
            <div class="ml-auto flex items-center">
              <span
                class="text-primary text-sm group-hover:font-bold transition-all"
                >Na termin</span
              >
              <Icon
                name="i-ic:round-keyboard-arrow-right"
                size="26"
                class="text-primary group-hover:translate-x-2 transition-transform"
              />
            </div>
          </div>
          <div></div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { register } from "swiper/element";
  import type { ApiInstitution } from "~/types/institution";
  import type { ApiService } from "~/types/service";
  register(); // registers swiper elements

  const { readItems } = useDirectusItems();
  const route = useRoute();

  const cartStore = useCartStore();

  // institution data request
  const {
    data: institution,
    error,
    status,
  } = await useAsyncData<ApiInstitution>(
    "institution",
    () =>
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
          "images.directus_files_id.*",
          "services.*",
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
        return data.length ? data[0] : null;
      },
    }
  );

  // date picker
  onMounted(async () => {
    // if looking at different institution, clear the current cart
    if (
      cartStore.slots.length &&
      cartStore.slots[0].schedule_day.court.institution.id !=
        institution.value?.id
    ) {
      cartStore.slots = [];
    }
  });
</script>

<style></style>
