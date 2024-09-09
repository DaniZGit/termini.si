<template>
  <div class="bg-neutral-white">
    <div>
      <div class="text-center px-4 py-4">
        <h1 class="text-3xl font-semibold text-secondary">Izberi šport</h1>
        <span class="text-neutral-darkGray">
          Ali pa poišči ustanovo preko
          <NuxtLink to="/institutions">
            <span class="link">iskalnika.</span>
          </NuxtLink>
        </span>
      </div>

      <div
        v-if="fetchingSports != 'pending'"
        class="grid grid-cols-2 px-4 gap-x-4 gap-y-4"
      >
        <NuxtLink
          v-for="sport in sports"
          :key="sport.id"
          :to="`/institutions?sports=${sport.id}`"
          class="flex flex-col justify-center items-center gap-y-2 aspect-square border-2 border-accent-lightGreen hover:ring-2 ring-accent-lightGreen rounded-lg transition-all duration-200"
        >
          <NuxtImg
            :src="useAssetUrl(sport.image.id)"
            class="aspect-square w-2/3 h-auto object-cover"
            width="100"
            height="100"
          ></NuxtImg>
          <h4 class="text-center text-lg font-medmium text-secondary">
            {{ sport.title }}
          </h4>
        </NuxtLink>
      </div>
      <div v-else class="pt-16">
        <UiLoader></UiLoader>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiSport } from "~/types/sport";

  const { readItems } = useDirectusItems();
  const {
    data: sports,
    error,
    status: fetchingSports,
  } = await useLazyAsyncData<ApiSport[]>(
    "sportsCollection",
    () =>
      readItems("sports", {
        fields: ["id", "title", "slug", "image.id", "courts"],
        filter: {
          _and: [
            {
              courts: {
                institution: {
                  _null: false,
                },
              },
            },
            {
              courts: {
                institution: {
                  status: {
                    _eq: "published",
                  },
                },
              },
            },
          ],
        },
        sort: "title",
      }),
    {
      transform: (payload) => {
        return payload.filter((sport) => sport.courts?.length > 0);
      },
    }
  );
</script>

<style></style>
