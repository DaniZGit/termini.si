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
        v-if="fetchingReservedTimeSlot != 'pending'"
        class="text-2xl text-secondary text-center"
      >
        ( {{ reservedTimeSlot?.schedule_day.court.institution.title }} )
      </h3>

      <div
        v-if="fetchingReservedTimeSlot != 'pending'"
        class="flex flex-col justify-center gap-y-2 text-center"
      >
        <div class="py-4">
          <NuxtImg
            :src="
              useAssetUrl(reservedTimeSlot?.schedule_day.court.sport?.image)
            "
            class="h-12 w-auto aspect-square object-cover mx-auto"
            width="100"
            height="100"
          ></NuxtImg>
        </div>
        <div>
          <div class="text-secondary font-semibold text-xl">Naslov</div>
          <div class="font-semibold">
            {{ reservedTimeSlot?.schedule_day.court.institution.address }},
            {{
              reservedTimeSlot?.schedule_day.court.institution.city?.postal_code
            }}
            {{ reservedTimeSlot?.schedule_day.court.institution.city?.title }}
          </div>
        </div>

        <div>
          <div class="text-secondary font-semibold text-xl">
            Datum in čas termina
          </div>
          <div class="font-semibold">
            {{ getDateNice(reservedTimeSlot?.schedule_day.date) }} ({{
              reservedTimeSlot?.start_time
            }}
            - {{ reservedTimeSlot?.end_time }})
          </div>
        </div>

        <div>
          <div class="text-secondary font-semibold text-xl">
            Datum in čas rezervacije
          </div>
          <div class="font-semibold">
            {{
              getDateNice(
                reservedTimeSlot?.transactions[0].transactions_id.date_created
              )
            }}
            ob
            {{
              getTimeNice(
                reservedTimeSlot?.transactions[0].transactions_id.date_created
              )
            }}
          </div>
        </div>

        <div
          class="absolute bottom-0 left-0 right-0 p-4 grid grid-cols-2 gap-x-8"
        >
          <UiButton
            class="flex items-center justify-center gap-x-2"
            @click="
              $router.push(
                `/institutions/${reservedTimeSlot?.schedule_day.court.institution.slug}?date=${reservedTimeSlot?.schedule_day.date}`
              )
            "
          >
            <Icon name="i-ic:twotone-calendar-month" size="32" />
            <span>Ustanova</span>
          </UiButton>

          <UiButton
            class="flex items-center justify-center gap-x-2 !bg-neutral-red"
          >
            <span>Prekliči</span>
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
  import type { ApiTimeSlot } from "~/types/court";

  const route = useRoute();
  const { readItem } = useDirectusItems();
  const { user } = useDirectusAuth();

  const {
    data: reservedTimeSlot,
    error: reservationError,
    status: fetchingReservedTimeSlot,
  } = await useLazyAsyncData<ApiTimeSlot>("reservations", () =>
    readItem("time_slots", route.params.timeSlotId, {
      filter: {
        _and: [
          {
            transactions: {
              transactions_id: {
                user: {
                  _eq: user.value?.id,
                },
              },
            },
          },
          {
            transactions: {
              transactions_id: {
                type: {
                  _eq: "booking",
                },
              },
            },
          },
        ],
      },
      fields: [
        "id",
        "start_time",
        "end_time",
        "schedule_day.date",
        "schedule_day.court.institution.title",
        "schedule_day.court.institution.slug",
        "schedule_day.court.institution.city.title",
        "schedule_day.court.institution.city.postal_code",
        "schedule_day.court.institution.address",
        "schedule_day.court.sport.title",
        "schedule_day.court.sport.image",
        "transactions.transactions_id.date_created",
      ],
      deep: {
        transactions: {
          _sort: "transactions_id.date_created",
          _limit: 1,
        },
      },
    })
  );
</script>

<style></style>
