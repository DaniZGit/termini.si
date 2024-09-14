<template>
  <teleport to="body">
    <div
      v-if="visible"
      ref="modal"
      class="fixed top-0 left-0 right-0 bottom-0 z-40"
      :class="{
        'modal-open': visible,
        '!top-16': stateStore.headerIsVisible,
      }"
    >
      <div
        class="absolute top-0 left-0 right-0 bottom-0 bg-neutral-white bg-opacity-80 -z-10 backdrop-blur-md"
      >
        <div
          class="h-full grid grid-flow-row grid-rows-12 gap-y-2 text-neutral-darkGray p-4"
        >
          <div class="row-span-1 flex items-center justify-between">
            <h2 class="text-2xl text-secondary font-bold">{{ getTitle() }}</h2>
            <Icon
              name="i-ic:outline-cancel"
              size="28"
              class="text-secondary"
              @click="onClose"
            />
          </div>

          <div
            class="row-span-10 flex flex-col gap-y-2 overflow-scroll"
            :class="{ 'row-span-11': type == 'maps' && !selectedInstitution }"
          >
            <div v-if="type == 'filter'" class="flex flex-col gap-y-4">
              <div class="flex items-center gap-x-2">
                <h3 class="text-primary text-lg font-bold">Sortiraj po</h3>
                <select
                  v-model="sort"
                  class="text-neutral-darkGray border-2 border-secondary rounded-lg px-1 py-0.5"
                >
                  <option value="title">Naslovu naraščojoče</option>
                  <option value="-title">Naslovu padajoče</option>
                </select>
              </div>

              <div>
                <h3 class="text-primary text-lg font-bold">Mesto</h3>
                <div class="flex flex-col gap-y-2 pl-2">
                  <div v-for="city in cities" :key="city.id">
                    <UiFormCheckbox
                      v-model="checkedCities"
                      :id="`city-${city.id}`"
                      name="cities"
                      :value="city.id"
                      :label="city.title"
                    ></UiFormCheckbox>
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="type == 'maps'" class="h-full flex flex-col">
              <ClientOnly>
                <GoogleMap
                  ref="googleMap"
                  :api-key="runtimeConfig.public.googleMapsApiKey"
                  mapId="DEMO_MAP_ID"
                  :center="center"
                  :zoom="7"
                  :disable-default-ui="true"
                  :keyboard-shortcuts="false"
                  class="w-full h-full shrink relative"
                >
                  <AdvancedMarker
                    v-for="institution in institutions"
                    :key="institution.id"
                    :options="{
                      title: institution.title,
                      position: {
                        lat: institution.latitude,
                        lng: institution.longitude,
                      },
                    }"
                    :pin-options="
                      institution.id == selectedInstitution?.id
                        ? pinOptionsIfSelected
                        : pinOptions
                    "
                    @click="onMarkerClick(institution)"
                  />

                  <CustomControl position="BOTTOM_CENTER" class="pb-2">
                    <button
                      class="bg-accent-lightBlue hover:bg-accent-lightGreen border-2 border-neutral-darkGray p-1 rounded-full transition-colors duration-200"
                      @click="onMyLocation"
                    >
                      <Icon
                        name="i-ic:baseline-my-location"
                        size="28"
                        class="text-neutral-darkGray"
                      />
                    </button>
                  </CustomControl>
                </GoogleMap>
              </ClientOnly>
              <div
                v-if="selectedInstitution"
                class="flex flex-col items-center py-2"
              >
                <h2 class="text-secondary text-xl font-semibold text-center">
                  {{ selectedInstitution.title }}
                </h2>
                <span class="text-center">
                  {{ beautifyInstitutionAddress(selectedInstitution) }}
                </span>
              </div>
              <div v-else class="flex flex-col items-center py-2">
                <h2 class="text-secondary text-xl font-semibold text-center">
                  Pritisni info točko za več informacij
                </h2>
                <Icon
                  name="i-ic:round-pin-drop"
                  size="48"
                  class="text-secondary"
                />
              </div>
            </div>
          </div>

          <UiButton
            v-if="type == 'maps' && selectedInstitution"
            class="row-span-1 w-full h-full flex items-center justify-center gap-x-2 self-end"
            @click="onRedirectToMarker"
          >
            Prikaži
          </UiButton>
          <UiButton
            v-else-if="type != 'maps'"
            class="row-span-1 w-full h-full flex items-center justify-center gap-x-2 self-end"
            @click="onFilter"
          >
            Filtriraj
          </UiButton>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
  import { type PropType } from "vue";
  import type { ApiCity } from "~/types/city";
  import { GoogleMap, AdvancedMarker, CustomControl } from "vue3-google-map";
  import type { ApiInstitution } from "~/types/institution";
  import type { InstitutionsFilter } from "~/types/misc";
  import type { LocationQueryValue } from "vue-router";

  const runtimeConfig = useRuntimeConfig();
  const route = useRoute();
  const router = useRouter();

  const { readItems } = useDirectusItems();
  const stateStore = useStateStore();

  const modal = ref<HTMLElement | null>(null);
  const visible = defineModel("visible", {
    default: false,
  });

  const props = defineProps({
    type: {
      type: String as PropType<"maps" | "filter" | "">,
    },
  });

  const emit = defineEmits<{
    filter: [filters: InstitutionsFilter];
  }>();

  const {
    data: cities,
    error: citiesError,
    status: fetchingCities,
  } = await useLazyAsyncData<ApiCity[]>("citiesCollection", () =>
    readItems("cities", {
      fields: ["id", "title"],
      filter: {
        _and: [
          {
            institutions: {
              _null: false,
            },
          },
          {
            institutions: {
              status: {
                _eq: "published",
              },
            },
          },
        ],
      },
      sort: "title",
    })
  );

  const getCitiesQuery = () => {
    return typeof route.query.cities === "object"
      ? route.query.cities
      : route.query.cities
      ? [route.query.cities]
      : [];
  };

  const getSortQuery = () => {
    return typeof route.query.sort === "string" ? route.query.sort : "title";
  };

  const sort = ref<string>(getSortQuery());
  const checkedCities = ref<LocationQueryValue[] | null>(getCitiesQuery());
  const prevSort = ref<string>(getSortQuery());
  const prevCheckedCities = ref<LocationQueryValue[] | null>(getCitiesQuery());
  const onFilter = () => {
    emit("filter", {
      sort: sort.value,
      checkedCities: checkedCities.value,
    });

    visible.value = false;

    prevSort.value = sort.value;
    prevCheckedCities.value = checkedCities.value;
  };

  // when url query changes, update values
  watch(
    () => route.query,
    () => {
      sort.value = getSortQuery();
      checkedCities.value = getCitiesQuery();

      prevSort.value = sort.value;
      prevCheckedCities.value = checkedCities.value;
    }
  );

  const onClose = () => {
    visible.value = false;

    // reset filter values
    if (props.type == "filter") {
      sort.value = prevSort.value;
      checkedCities.value = prevCheckedCities.value;
    }
  };

  // LOCATION TYPE
  const googleMap = ref<InstanceType<typeof GoogleMap> | null>(null);
  const center = { lat: 46.1221, lng: 14.816522 };
  const pinOptions = {
    background: "#2196F3",
    glyphColor: "#64B5F6",
    borderColor: "#616161",
  };
  const pinOptionsIfSelected = {
    background: "#4CAF50",
    glyphColor: "#81C784",
    borderColor: "#616161",
    scale: 1.25,
  };

  const {
    data: institutions,
    error: institutionsError,
    status: fetchingInstitutions,
    refresh,
  } = await useLazyAsyncData<ApiInstitution[]>(
    "institutionsForMapsCollection",
    () =>
      readItems("institutions", {
        fields: [
          "id",
          "title",
          "slug",
          "city.*",
          "address",
          "latitude",
          "longitude",
        ],
        filter: {
          status: {
            _eq: "published",
          },
        },
      })
  );

  const selectedInstitution = ref<ApiInstitution | null>(null);
  const onMarkerClick = (institution: ApiInstitution) => {
    selectedInstitution.value = institution;
  };

  const onRedirectToMarker = () => {
    router.push(`/institutions/${selectedInstitution.value?.slug}`);
  };

  const onMyLocation = () => {
    console.log("Move to my current location");
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          googleMap.value?.map?.panTo(pos);
        },
        () => {
          console.log("user refused location share");
        }
      );
    } else {
      // Browser doesn't support Geolocation
      console.log("browser doesnt support geolocation");
    }
  };

  const getTitle = () => {
    switch (props.type) {
      case "filter":
        return "Filtriranje";
      case "maps":
        return "V bližini";
      default:
        return "Dialog";
    }
  };
</script>

<style scoped></style>
