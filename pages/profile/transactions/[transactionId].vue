<template>
  <div class="bg-neutral-white text-neutral-darkGray">
    <div class="p-4 text-neutral-darkGray">
      <div class="relative">
        <h1 class="text-center text-3xl font-semibold text-secondary">
          Transakcija
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
        v-if="fetchingTransaction != 'pending'"
        class="text-2xl text-secondary text-center"
      >
        ( {{ getTypeText() }} )
      </h3>

      <div
        v-if="fetchingTransaction != 'pending'"
        class="flex flex-col justify-center gap-y-2 text-center pt-4"
      >
        <div>
          <div class="text-secondary font-semibold text-xl">
            Datum in čas transakcije
          </div>
          <div class="font-semibold">
            {{ getDateNice(transaction?.date_created) }}
            ob
            {{ getTimeNice(transaction?.date_created) }}
          </div>
        </div>

        <div v-if="transaction?.type == 'booking'">
          <div class="text-secondary font-semibold text-xl">
            Rezervirani termini
          </div>
          <div>
            <div v-for="timeSlotId in transaction?.time_slots">
              <NuxtLink
                :to="`/profile/reservations/${timeSlotId.time_slots_id.id}`"
              >
                <ItemReservation
                  :reservation="timeSlotId.time_slots_id"
                ></ItemReservation>
                <hr class="border-[1px] border-primary rounded-full my-1" />
              </NuxtLink>
            </div>
          </div>
        </div>

        <div v-if="transaction?.type == 'topup'">
          <div class="text-secondary font-semibold text-xl">
            Število žetonov
          </div>
          <div class="font-semibold">55</div>
        </div>

        <div
          v-if="transaction?.type == 'topup'"
          class="fixed bottom-0 left-0 right-0 p-4"
        >
          <UiButton class="flex items-center justify-center gap-x-2 mx-auto">
            <Icon name="i-ic:baseline-receipt-long" size="32" />
            <span>Prenesi račun</span>
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
  import type { ApiTransaction } from "~/types/transaction";

  const route = useRoute();
  const { readItem } = useDirectusItems();
  const { user } = useDirectusAuth();

  const {
    data: transaction,
    error: transactionError,
    status: fetchingTransaction,
  } = await useLazyAsyncData<ApiTransaction>("transactionsCollection", () =>
    readItem("transactions", route.params.transactionId, {
      fields: [
        "id",
        "date_created",
        "type",
        "status",
        "user",
        "time_slots.time_slots_id.*",
        "time_slots.time_slots_id.id",
        "time_slots.time_slots_id.start_time",
        "time_slots.time_slots_id.end_time",
        "time_slots.time_slots_id.schedule_day.date",
        "time_slots.time_slots_id.schedule_day.court.institution.title",
        "time_slots.time_slots_id.schedule_day.court.institution.city.title",
        "time_slots.time_slots_id.schedule_day.court.institution.city.postal_code",
        "time_slots.time_slots_id.schedule_day.court.institution.address",
        "time_slots.time_slots_id.schedule_day.court.sport.title",
        "time_slots.time_slots_id.schedule_day.court.sport.image",
      ],
      deep: {
        time_slots: {
          time_slots_id: {
            _sort: ["schedule_day.court.sport.title", "-start_time"],
          },
        },
      },
    })
  );

  const getTypeText = () => {
    switch (transaction.value?.type) {
      case "booking":
        return "Rezervacija terminov";
      case "topup":
        return "Nakup žetonov";
      default:
        return "Drugo";
    }
  };
</script>

<style></style>
