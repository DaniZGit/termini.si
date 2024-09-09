<template>
  <div class="bg-neutral-white">
    <div v-if="sport">
      <div class="text-center py-4">
        <h1 class="text-3xl font-semibold text-secondary">
          {{ sport?.title }}
        </h1>

        <div class="flex justify-center px-4 py-4">
          <NuxtImg
            :src="useAssetUrl(sport?.image?.id)"
            width="200"
            height="200"
            class="aspect-square w-1/2"
          ></NuxtImg>
        </div>

        <div class="px-4 py-4">
          <FilterInstitutions></FilterInstitutions>
        </div>

        <div class="flex flex-col gap-y-4">
          <ItemInstitution
            v-for="institution in institutions"
            :key="institution.id"
            :institution="institution"
          >
          </ItemInstitution>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiInstitution } from "~/types/institution";
  import type { ApiSport } from "~/types/sport";

  const { readItems } = useDirectusItems();
  const route = useRoute();

  const {
    data: sport,
    error,
    status,
  } = await useAsyncData<ApiSport>(
    "sport",
    () =>
      readItems("sports", {
        fields: ["id", "title", "image.*"],
        filter: {
          title: {
            _icontains: route.params.title ?? "",
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

  const { data: institutions } = await useAsyncData<ApiInstitution[]>(
    "sportInstitutionsCollection",
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
          courts: {
            sport: {
              title: {
                _icontains: route.params.title ?? "",
              },
            },
          },
        },
        sort: "title",
      })
  );
</script>

<style></style>
