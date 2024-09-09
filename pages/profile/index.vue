<template>
  <div class="bg-neutral-white">
    <div class="flex flex-col gap-y-4 p-4 text-neutral-darkGray">
      <div>
        <h1 class="text-center text-3xl font-semibold text-secondary">
          Profil
        </h1>
      </div>

      <div class="flex flex-col gap-y-6">
        <div
          class="flex flex-col gap-y-4 border-2 border-primary rounded-full px-8 py-2"
        >
          <div class="flex justify-between items-center gap-x-2">
            <Icon
              name="i-ic:baseline-person-outline"
              size="64"
              class="text-secondary -ml-2"
            />
            <div>
              <div class="flex justify-end items-center gap-x-1 font-bold">
                <span> {{ user?.first_name }} {{ user?.last_name }} </span>
                <Icon name="i-ic:outline-edit" class="text-secondary" />
              </div>
              <div class="flex items-center gap-x-1">
                <span>
                  {{ user?.email }}
                </span>
                <Icon name="i-ic:outline-edit" class="text-secondary" />
              </div>
            </div>
          </div>

          <div class="flex justify-between gap-x-2 -mt-4">
            <span> Število žetonov: </span>

            <div class="flex gap-x-2">
              <span
                class="text-secondary font-bold underline underline-offset-2"
              >
                {{ user?.tokens }}</span
              >
              <NuxtLink to="/tokens">
                <Icon
                  name="i-ic:round-add-circle-outline"
                  size="26"
                  class="text-primary"
                />
              </NuxtLink>
            </div>
          </div>
        </div>

        <div>
          <h2 class="text-2xl font-bold">Rezervacije</h2>
          <div v-if="reservations?.length" class="flex flex-col">
            <NuxtLink
              :to="`/profile/reservations/${reservation.id}`"
              v-for="reservation in reservations"
              :key="reservation.id"
            >
              <ItemReservation :reservation="reservation"></ItemReservation>
              <hr class="border-[1px] border-primary rounded-full my-1" />
            </NuxtLink>
          </div>
          <div v-else-if="fetchingReservations == 'pending'" class="py-4">
            <UiLoader></UiLoader>
          </div>
          <div v-else>
            <h3 class="text-xl text-center py-4">Trenutno ni rezervacij</h3>
          </div>

          <UiPagination
            v-show="fetchingReservations != 'pending'"
            v-model="reservationsPage"
            :total-pages="getReservationsPageCount()"
          ></UiPagination>
        </div>

        <div>
          <h2 class="text-2xl font-bold">Transakcije</h2>
          <div v-if="transactions?.length" class="flex flex-col gap-y-2">
            <NuxtLink
              :to="`/profile/transactions/${transaction.id}`"
              v-for="transaction in transactions"
              :key="transaction.id"
            >
              <ItemTransaction :transaction="transaction"></ItemTransaction>
              <hr class="border-[1px] border-primary rounded-full my-1" />
            </NuxtLink>
          </div>
          <div v-else-if="fetchingTransactions == 'pending'" class="py-4">
            <UiLoader></UiLoader>
          </div>
          <div v-else>
            <h3 class="text-xl text-center py-4">Trenutno ni transakcij</h3>
          </div>

          <UiPagination
            v-show="fetchingTransactions != 'pending'"
            v-model="transactionsPage"
            :total-pages="getTransactionsPageCount()"
          ></UiPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiTimeSlot } from "~/types/court";
  import type { ApiTransaction } from "~/types/transaction";

  const { user } = useDirectusAuth();
  const { readItems, readSingleton } = useDirectusItems();
  const limit = 4;

  const reservationsPage = ref(1);
  const {
    data: reservations,
    error: reservationError,
    status: fetchingReservations,
  } = await useLazyAsyncData<ApiTimeSlot[]>(
    "reservations",
    () =>
      readItems("time_slots", {
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
          "schedule_day.court.institution.city.title",
          "schedule_day.court.institution.city.postal_code",
          "schedule_day.court.institution.address",
          "schedule_day.court.sport.title",
          "schedule_day.court.sport.image",
        ],
        sort: ["-schedule_day.date", "start_time"],
        limit: limit,
        page: reservationsPage.value,
        meta: "filter_count",
      }),
    {
      watch: [reservationsPage],
    }
  );

  const {
    data: totalReservationsCount,
    error: totalReservationsCountError,
    status: fetchingTotalReservationsCount,
  } = await useLazyAsyncData<Array<{ count: number }>>(
    "totalReservationsCount",
    () =>
      readSingleton("time_slots", {
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
        aggregate: {
          count: "*",
        },
      })
  );

  const transactionsPage = ref(1);
  const {
    data: transactions,
    error: transactionError,
    status: fetchingTransactions,
  } = await useLazyAsyncData<ApiTransaction[]>(
    "transactionsCollection",
    () =>
      readItems("transactions", {
        filter: {
          user: {
            _eq: user.value?.id,
          },
        },
        sort: ["-date_created"],
        limit: limit,
        page: transactionsPage.value,
        meta: "filter_count",
      }),
    {
      watch: [transactionsPage],
    }
  );

  const {
    data: totalTransactionsCount,
    error: totalTransactionsCountError,
    status: fetchingTotalTransactionsCount,
  } = await useLazyAsyncData<Array<{ count: number }>>(
    "totalTransactionsCount",
    () =>
      readSingleton("transactions", {
        filter: {
          user: {
            _eq: user.value?.id,
          },
        },
        aggregate: {
          count: "*",
        },
      })
  );

  const getReservationsPageCount = () => {
    if (
      !totalReservationsCount.value ||
      !totalReservationsCount.value.length ||
      limit > totalReservationsCount.value[0].count
    )
      return 1;

    return getPageCount(totalReservationsCount.value[0].count, limit);
  };

  const getTransactionsPageCount = () => {
    if (
      !totalTransactionsCount.value ||
      !totalTransactionsCount.value.length ||
      limit > totalTransactionsCount.value[0].count
    )
      return 1;

    return getPageCount(totalTransactionsCount.value[0].count, limit);
  };

  const getPageCount = (totalCount: number, limit: number) => {
    let pageCount = 0;
    pageCount += totalCount / limit;
    pageCount += totalCount % limit ? totalCount % limit : 0;

    return Math.floor(pageCount);
  };
</script>

<style></style>
