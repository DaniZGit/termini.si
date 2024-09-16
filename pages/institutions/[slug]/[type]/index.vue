<template>
  <div class="h-full">
    <template v-if="service">
      <div class="text-center px-4 py-4">
        <h1 class="text-3xl font-semibold text-secondary">
          {{ service.institution.title }}
        </h1>
        <h2 class="text-primary font-semibold text-xl">
          ( {{ getServiceTypeTitle(service) }} )
        </h2>
      </div>

      <!-- Plans -->
      <div class="px-4 py-4 flex flex-col">
        <ViewServicePlans :service="service"></ViewServicePlans>
      </div>

      <ViewServiceSports
        v-if="service.type == 'sports'"
        :service="service"
      ></ViewServiceSports>
      <ViewServiceHairdressing
        v-else-if="service.type == 'hairdressing'"
        :service="service"
      ></ViewServiceHairdressing>
      <ViewServiceFitness
        v-else-if="service.type == 'fitness'"
        :service="service"
      ></ViewServiceFitness>
      <ViewServiceWellness
        v-else-if="service.type == 'wellness'"
        :service="service"
      ></ViewServiceWellness>
      <div v-else>
        <h1>This Service type has not been handled yet!</h1>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiService, ApiServiceType } from "~/types/service";

  const { readItems } = useDirectusItems();
  const route = useRoute();

  // returns fields based on the service type
  const requestFields = () => {
    const serviceType = (route.params.type ?? "") as ApiServiceType;
    // fields independent of service type
    let fields = [
      "*",
      "institution.id",
      "institution.slug",
      "institution.title",
      "total_reservations_per_day",
      "days_in_advance_to_reserve",
      "plans.id",
      "plans.title",
      "plans.total_reservations",
      "plans.total_reservations_per_day",
      "plans.days_in_advance_to_reserve",
      "plans.buyable",
      "plans.price",
      "plans.note",
    ];

    switch (serviceType) {
      case "sports":
        fields = fields.concat(["sport_courts.*", "sport_courts.sport.*"]);
        break;
      case "hairdressing":
        fields = fields.concat(["hairdressers.*"]);
        break;
      case "fitness":
        fields = fields.concat(["fitness.*"]);
        break;
      case "wellness":
        fields = fields.concat(["wellnesses.*"]);
        break;
    }

    return fields;
  };

  // service data request
  const {
    data: service,
    error,
    status,
  } = await useLazyAsyncData<ApiService>(
    "service",
    () =>
      readItems("services", {
        fields: requestFields(),
        filter: {
          institution: {
            slug: {
              _icontains: route.params.slug ?? "",
            },
          },
          type: {
            _icontains: route.params.type ?? "",
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
</script>

<style></style>
