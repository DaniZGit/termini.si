<template>
  <div class="bg-neutral-white text-neutral-darkGray">
    <div class="p-4 text-neutral-darkGray">
      <div class="relative">
        <h1 class="text-center text-3xl font-semibold text-secondary">
          Rezervacija
        </h1>
        <div class="absolute top-0 bottom-0 left-0 flex items-center">
          <NuxtLink to="/profile">
            <Icon
              name="i-ic:round-arrow-back"
              size="26"
              class="my-auto text-primary"
            />
          </NuxtLink>
        </div>
      </div>
      <h3
        v-if="reservationStatus != 'pending'"
        class="text-2xl text-secondary text-center"
      >
        (
        {{ reservation?.slot.slot_definition.variant?.service?.title }}
        )
      </h3>

      <div
        v-if="reservationStatus != 'pending'"
        class="flex flex-col justify-center gap-y-2 text-center"
      >
        <div>
          <div class="text-secondary font-semibold text-xl">Naslov</div>
          <div class="font-semibold">
            <span>
              {{
                reservation?.slot.slot_definition.variant?.service?.institution
                  .address
              }},
              {{
                reservation?.slot.slot_definition.variant?.service?.institution
                  .city?.postal_code
              }}
              {{
                reservation?.slot.slot_definition.variant?.service?.institution
                  .city?.title
              }}</span
            >
          </div>
        </div>

        <div>
          <div class="text-secondary font-semibold text-xl">
            Datum in čas termina
          </div>
          <div class="font-semibold">
            <span class="font-semibold"
              >{{ getDateNice(reservation?.slot.date ?? "") }} ({{
                reservation?.slot.time_start
              }}
              - {{ reservation?.slot.time_end }})</span
            >
          </div>
        </div>

        <div>
          <div class="text-secondary font-semibold text-xl">
            Datum in čas rezervacije
          </div>
          <div class="font-semibold">
            {{ getDateNice(reservation?.date_updated ?? "") }}
            ob
            {{ getTimeNice(reservation?.date_updated ?? "") }}
          </div>
        </div>

        <div
          class="absolute bottom-0 left-0 right-0 p-4 grid grid-cols-2 gap-x-8"
        >
          <UiButton
            class="flex items-center justify-center gap-x-2"
            @click="
              $router.push(
                `/institutions/${reservation?.slot.slot_definition.variant?.service?.institution.slug}?date=${reservation?.slot.date}`
              )
            "
          >
            <Icon name="i-ic:twotone-calendar-month" size="32" />
            <span>Ustanova</span>
          </UiButton>

          <UiButton
            class="flex items-center justify-center gap-x-2"
            color="error"
            :disabled="reservation?.status == 'canceled'"
          >
            <span>{{
              reservation?.status == "confirmed"
                ? "Prekliči"
                : reservation?.status == "canceled"
                ? "Preklicano"
                : "Drugo"
            }}</span>
            <Icon name="i-ic:round-free-cancellation" size="32" />
          </UiButton>
        </div>
      </div>

      <div v-else class="flex justify-center items-center py-16">
        <Icon
          name="i-svg-spinners:blocks-shuffle-3"
          size="64"
          class="text-primary"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiReservation } from "~/types/reservation";

  const route = useRoute();
  const { readItem } = useDirectusItems();
  const { user } = useDirectusAuth();

  const {
    data: reservation,
    error: reservationError,
    status: reservationStatus,
  } = await useLazyAsyncData<ApiReservation>("reservations", () =>
    /* @ts-ignore */
    readItem("reservations", route.params.reservationId, {
      fields: [
        "*",
        "slot.*",
        "slot.slot_definition.variant.service.*",
        "slot.slot_definition.variant.service.institution.*",
      ],
      filter: {
        _and: [
          {
            user: {
              id: {
                _eq: user.value?.id,
              },
            },
          },
          {
            status: {
              _in: ["confirmed", "canceled"],
            },
          },
        ],
      },
    })
  );
</script>

<style></style>
