<template>
  <div class="flex flex-col gap-y-1">
    <div
      class="flex border-2 border-primary focus:border-transparent focus:ring-2 focus:ring-primary rounded-full text-neutral-darkGray transition-all"
    >
      <div class="pl-2 flex items-center">
        <Icon name="i-ic:sharp-search" size="22" class="text-neutral-gray" />
      </div>
      <input
        type="search"
        v-model="search"
        name=""
        id=""
        placeholder="Enter institution's name"
        class="w-full placeholder-neutral-gray py-1 outline-none [&::-webkit-search-cancel-button]:hidden px-2"
      />
      <div class="rounded-r-full border-l-2 border-primary">
        <UiButton
          class="h-full py-1 rounded-r-full rounded-l-none text-sm border-none"
          @click="$emit('search', search)"
        >
          Search
        </UiButton>
      </div>
    </div>
    <div class="fixed bottom-0 left-0 right-0 flex justify-center">
      <UiShadowPanel
        class="relative inline-flex justify-center items-center gap-x-2 text-secondary z-30 py-2"
      >
        <UiButton class="py-1 px-2" @click="onShow('filter')">
          <Icon name="i-ic:baseline-filter-alt" size="22" />
        </UiButton>
        <UiButton class="py-1 px-2" @click="onShow('maps')">
          <Icon name="i-ic:baseline-map" size="22" class="text-neutral-white" />
        </UiButton>
      </UiShadowPanel>
    </div>

    <ModalInstitutionsFilter
      v-model:visible="openFilterModal"
      :type="contentType"
      @filter="(data) => $emit('filter', data)"
    ></ModalInstitutionsFilter>
  </div>
</template>

<script lang="ts" setup>
  import type { InstitutionsFilter } from "~/types/misc";

  const route = useRoute();
  const emit = defineEmits<{
    search: [query: string];
    filter: [data: InstitutionsFilter];
  }>();

  const getSearchQuery = () => {
    return typeof route.query.query === "string" ? route.query.query : "";
  };

  const search = defineModel("search", { default: "" });

  // cant call getSearchQuery funciton in defineModel default property - so we declare it here
  onMounted(() => {
    search.value = getSearchQuery();
  });

  // when url query changes, update values
  watch(
    () => route.query,
    () => {
      search.value = getSearchQuery();
    }
  );

  const openFilterModal = ref(false);
  const contentType = ref<"maps" | "filter" | "">("");
  const onShow = (type: "maps" | "filter" | "") => {
    contentType.value = type;
    openFilterModal.value = true;
  };
</script>

<style></style>
