<template>
  <div v-if="institution" class="flex flex-col gap-y-2">
    <NuxtLink
      :to="`/institutions/${institution.slug}`"
      class="overflow-hidden"
      @mouseover="focus = true"
      @mouseleave="focus = false"
      @touchstart="focus = true"
      @touchend="focus = false"
    >
      <NuxtImg
        :src="useAssetUrl(institution?.thumbnail?.id)"
        width="400"
        height="150"
        class="aspect-video w-full h-auto object-cover transition-transform duration-300"
        :class="{ 'scale-125': focus }"
      ></NuxtImg>
    </NuxtLink>
    <div class="px-4">
      <NuxtLink
        :to="`/institutions/${institution.slug}`"
        class="overflow-hidden"
      >
        <h3 class="text-xl font-semibold text-secondary">
          {{ institution.title }}
        </h3>
      </NuxtLink>
      <div class="flex gap-x-2">
        <Icon
          name="i-ic:round-location-on"
          size="18"
          class="shrink-0 my-auto text-secondary"
        />
        <span class="text-neutral-darkGray font-medium">
          {{ beautifyInstitutionAddress(institution) }}</span
        >
      </div>
      <div class="flex gap-x-2">
        <Icon
          name="i-ic:baseline-local-phone"
          size="18"
          class="shrink-0 my-auto text-secondary"
        />
        <span class="text-neutral-darkGray font-medium">
          {{ institution.phone }}</span
        >
      </div>
      <div v-if="getInstitutionSports(institution).length" class="flex gap-x-2">
        <Icon
          name="i-fluent:sport-16-filled"
          size="18"
          class="shrink-0 my-auto text-secondary"
        />
        <div class="flex items-center flex-wrap gap-x-2 gap-y-1">
          <div v-for="sport in getInstitutionSports(institution)">
            <NuxtLink
              :to="`/institutions?sports=${sport.id}`"
              class="text-neutral-darkGray font-medium ring-2 ring-secondary hover:ring-primary rounded-full px-2 text-sm transition-all"
            >
              {{ sport.title }}
            </NuxtLink>
          </div>
        </div>
      </div>
      <NuxtLink
        :to="`/institutions/${institution.slug}`"
        @mouseover="focus = true"
        @mouseleave="focus = false"
        @touchstart="focus = true"
        @touchend="focus = false"
      >
        <UiButton class="w-full mt-4 group">Rezerviraj</UiButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiInstitution } from "~/types/institution";

  const focus = ref(false);

  const props = defineProps({
    institution: Object as PropType<ApiInstitution>,
  });
</script>

<style></style>
