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
    <div class="flex flex-col gap-y-2 px-4">
      <NuxtLink
        :to="`/institutions/${institution.slug}`"
        class="overflow-hidden"
      >
        <h3 class="text-xl font-semibold text-secondary">
          {{ institution.title }}
        </h3>
      </NuxtLink>
      <div>
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
      </div>
      <hr
        v-if="institution.services?.length"
        class="border-primary border-[1px] rounded-full"
      />
      <div
        v-if="institution.services?.length"
        class="flex flex-wrap gap-y-2 gap-x-2"
      >
        <span
          v-for="type in getUniqueServiceTypes()"
          class="border-2 border-secondary rounded-full px-1 flex items-center text-sm"
        >
          {{ getServiceTypeTitle(type) }}
        </span>
      </div>
      <NuxtLink
        :to="`/institutions/${institution.slug}`"
        @mouseover="focus = true"
        @mouseleave="focus = false"
        @touchstart="focus = true"
        @touchend="focus = false"
      >
        <UiButton class="w-full group">Ogled terminov</UiButton>
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

  const getUniqueServiceTypes = () => {
    const types: string[] = [];
    props.institution?.services?.forEach((service) => {
      if (!types.includes(service.type)) types.push(service.type);
    });

    return types;
  };
</script>

<style></style>
