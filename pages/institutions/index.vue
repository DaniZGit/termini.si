<template>
  <div class="w-full h-full bg-neutral-white">
    <div>
      <div class="text-center px-4 py-4">
        <h1 class="text-3xl font-semibold text-secondary">
          {{ $t("institutions-title") }}
        </h1>
      </div>

      <div class="w px-4 pb-4">
        <FilterInstitutions
          @search="onSearch"
          @filter="onFilter"
        ></FilterInstitutions>
      </div>

      <div
        v-if="fetchingInstitutions != 'pending'"
        class="my-auto flex flex-col gap-y-4"
      >
        <div
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:px-4"
        >
          <ItemInstitution
            v-for="institution in institutions"
            :key="institution.id"
            :institution="institution"
          >
          </ItemInstitution>
        </div>

        <UiPagination
          v-model="currentPage"
          :total-pages="getPageCount()"
          class="mt-4 mb-8"
        ></UiPagination>
      </div>
      <div v-else class="py-16">
        <UiLoader></UiLoader>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiInstitution } from "~/types/institution";
  import type { InstitutionsFilter } from "~/types/misc";

  useSeoMeta({
    title: "Institutions",
  });

  const { readItems, readSingleton } = useDirectusItems();
  const {} = useDirectusRevisions();
  const route = useRoute();
  const router = useRouter();

  const query = computed(() =>
    typeof route.query.query === "string" ? route.query.query : ""
  );
  const sort = computed(() =>
    typeof route.query.sort === "string" ? route.query.sort : "slug"
  );
  const checkedSports = computed(() =>
    typeof route.query.sports === "object"
      ? route.query.sports
      : route.query.sports
      ? [route.query.sports]
      : []
  );
  const checkedCities = computed(() =>
    typeof route.query.cities === "object"
      ? route.query.cities
      : route.query.cities
      ? [route.query.cities]
      : []
  );

  const currentPage = ref(1);
  const limit = 8;
  const {
    data: institutions,
    error,
    status: fetchingInstitutions,
    refresh,
  } = await useLazyAsyncData<ApiInstitution[]>(
    "institutionsCollection",
    () =>
      /* @ts-ignore */
      readItems("institutions", {
        fields: [
          "id",
          "slug",
          "city.*",
          "address",
          "phone",
          "thumbnail.*",
          "services.type",
          "translations.*",
        ],
        filter: {
          status: {
            _eq: "published",
          },
          city: {
            id: checkedCities.value?.length
              ? {
                  _in: checkedCities.value,
                }
              : {
                  _gt: 0,
                },
          },
        },
        page: currentPage.value,
        limit: limit,
        sort: sort.value,
        search: query.value,
      }),
    {
      watch: [currentPage, () => route.query],
    }
  );

  const {
    data: totalInstitutionsCount,
    error: totalInstitutionsCountError,
    status: fetchingTotalInstitutionsCount,
  } = await useLazyAsyncData<Array<{ count: number }>>(
    "totalInstitutionsCount",
    () =>
      readSingleton("institutions", {
        fields: ["id"],
        filter: {
          status: {
            _eq: "published",
          },
          city: {
            id: checkedCities.value?.length
              ? {
                  _in: checkedCities.value,
                }
              : {
                  _gt: 0,
                },
          },
        },
        aggregate: {
          count: "*",
        },
      }),
    {
      watch: [() => route.query],
    }
  );

  const getPageCount = () => {
    if (
      !totalInstitutionsCount.value ||
      !totalInstitutionsCount.value.length ||
      limit > totalInstitutionsCount.value[0].count
    )
      return 1;

    const totalCount = totalInstitutionsCount.value[0].count;
    let pageCount = 0;
    pageCount += totalCount / limit;
    pageCount += totalCount % limit ? totalCount % limit : 0;

    return Math.floor(pageCount);
  };

  const previousSearch = ref("");
  const onSearch = async (newQuery: string) => {
    if (previousSearch.value == newQuery) return;

    previousSearch.value = newQuery;

    // update queries
    await router.replace({
      query: {
        query: newQuery,
        sports: checkedSports.value,
        cities: checkedCities.value,
        sort: sort.value,
      },
    });
  };

  const onFilter = async (filterData: InstitutionsFilter) => {
    // reset current page
    currentPage.value = 1;

    // update queries
    await router.push({
      path: "/institutions",
      query: {
        query: previousSearch.value,
        sports: filterData.checkedSports,
        cities: filterData.checkedCities,
        sort: filterData.sort,
      },
    });
  };
</script>

<style></style>
