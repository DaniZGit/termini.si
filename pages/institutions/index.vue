<template>
  <div class="bg-neutral-white pb-16">
    <div>
      <div class="text-center px-4 py-4">
        <h1 class="text-3xl font-semibold text-secondary">Športne ustanove</h1>
      </div>

      <div class="px-4 pb-4">
        <FilterInstitutions
          @search="onSearch"
          @filter="onFilter"
        ></FilterInstitutions>
      </div>

      <div
        v-if="fetchingInstitutions != 'pending'"
        class="flex flex-col gap-y-4"
      >
        <ItemInstitution
          v-for="institution in institutions"
          :key="institution.id"
          :institution="institution"
        >
        </ItemInstitution>

        <UiPagination
          v-model="currentPage"
          :total-pages="getPageCount()"
        ></UiPagination>
      </div>
      <div v-else class="pt-16">
        <UiLoader></UiLoader>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiInstitution } from "~/types/institution";
  import type { InstitutionsFilter } from "~/types/misc";

  const { readItems, readSingleton } = useDirectusItems();
  const {} = useDirectusRevisions();
  const route = useRoute();
  const router = useRouter();

  const query = computed(() =>
    typeof route.query.query === "string" ? route.query.query : ""
  );
  const sort = computed(() =>
    typeof route.query.sort === "string" ? route.query.sort : "title"
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
      readItems("institutions", {
        fields: [
          "id",
          "title",
          "slug",
          "city.*",
          "address",
          "phone",
          "thumbnail.*",
          "courts.id",
          "courts.sport.*",
        ],
        filter: {
          status: {
            _eq: "published",
          },
          courts: {
            sport: {
              id: checkedSports.value?.length
                ? {
                    _in: checkedSports.value,
                  }
                : {
                    _gt: 0,
                  },
            },
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
        fields: ["title"],
        filter: {
          status: {
            _eq: "published",
          },
          courts: {
            sport: {
              id: checkedSports.value?.length
                ? {
                    _in: checkedSports.value,
                  }
                : {
                    _gt: 0,
                  },
            },
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
