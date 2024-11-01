<template>
  <div class="bg-neutral-white text-neutral-darkGray">
    <div class="p-4 text-neutral-darkGray">
      <div class="relative">
        <h1 class="text-center text-3xl font-semibold text-secondary">
          {{ $t("transaction-title") }}
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
        ( {{ $t("transaction-type") }} )
      </h3>

      <div
        v-if="fetchingTransaction != 'pending'"
        class="flex flex-col justify-center gap-y-2 text-center pt-4"
      >
        <div>
          <div class="text-secondary font-semibold text-xl">
            {{ $t("transaction-time") }}
          </div>
          <div class="font-semibold">
            {{ getDateNice(transaction?.date_created ?? "") }}
            ob
            {{ getTimeNice(transaction?.date_created ?? "") }}
          </div>
        </div>

        <div v-if="transaction?.type == 'topup'">
          <div class="text-secondary font-semibold text-xl">
            {{ $t("transaction-tokens-title") }}
          </div>
          <div class="font-semibold">55</div>
        </div>

        <div v-if="transaction?.type == 'topup'" class="p-4">
          <UiButton class="flex items-center justify-center gap-x-2 mx-auto">
            <Icon name="i-ic:baseline-receipt-long" size="32" />
            <span>{{ $t("transaction-receipt-button") }}</span>
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

  useSeoMeta({
    title: "Transactions",
    ogTitle: "Transactions",
  });

  const route = useRoute();
  const { readItem } = useDirectusItems();

  const {
    data: transaction,
    error: transactionError,
    status: fetchingTransaction,
  } = await useLazyAsyncData<ApiTransaction>("transactionsCollection", () =>
    /* @ts-ignore */
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
</script>

<style></style>
