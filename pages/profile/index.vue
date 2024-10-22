<template>
  <div class="bg-neutral-white">
    <div class="flex flex-col gap-y-4 p-4 text-neutral-darkGray">
      <div>
        <h1 class="text-center text-3xl font-semibold text-secondary">
          Profile
        </h1>
      </div>

      <div class="flex flex-col gap-y-6">
        <div
          class="flex flex-col gap-y-4 border-2 border-primary rounded-full px-8 py-2"
        >
          <div class="flex justify-between items-center gap-x-2">
            <div class="relative">
              <Icon
                name="i-ic:baseline-person-outline"
                size="64"
                class="text-secondary -ml-2"
              />
              <Icon
                name="i-mdi:square-edit-outline"
                class="absolute top-2 right-0 text-secondary"
              />
            </div>
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
            <span> Tokens amount: </span>

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
          <h2 class="text-2xl font-bold">Reservations</h2>
          <div class="relative">
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
            <div v-else>
              <h3 class="text-xl text-center py-4">
                Currently there are no reservations
              </h3>
            </div>
            <div
              v-if="fetchingReservations == 'pending'"
              :class="{
                'absolute top-0 -left-2 -right-2 bottom-0 flex justify-center items-center bg-secondary bg-opacity-20 py-4':
                  reservations?.length,
              }"
            >
              <UiLoader></UiLoader>
            </div>
          </div>

          <UiPagination
            v-show="fetchingReservations != 'pending'"
            v-model="reservationsPage"
            :total-pages="getReservationsPageCount()"
            class="mt-4"
          ></UiPagination>
        </div>

        <div>
          <h2 class="text-2xl font-bold">Transactions</h2>

          <div class="relative">
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
            <div v-else>
              <h3 class="text-xl text-center py-4">
                Currently there are no transactions
              </h3>
            </div>

            <div
              v-if="fetchingTransactions == 'pending'"
              :class="{
                'absolute top-0 -left-2 -right-2 bottom-0 flex justify-center items-center bg-secondary bg-opacity-20 py-4':
                  reservations?.length,
              }"
            >
              <UiLoader></UiLoader>
            </div>
          </div>

          <UiPagination
            v-show="fetchingTransactions != 'pending'"
            v-model="transactionsPage"
            :total-pages="getTransactionsPageCount()"
            class="my-4"
          ></UiPagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { ApiReservation } from "~/types/reservation";
  import type { ApiTransaction } from "~/types/transaction";

  const { user } = useDirectusAuth();
  const { readItems, readSingleton } = useDirectusItems();
  const limit = 4;

  const reservationsPage = ref(1);
  const {
    data: reservations,
    error: reservationError,
    status: fetchingReservations,
  } = await useLazyAsyncData<ApiReservation[]>(
    "reservations",
    () =>
      /* @ts-ignore */
      readItems("reservations", {
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
        sort: ["-date_updated", "-date_created"],
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
      readSingleton("reservations", {
        filter: {
          /* @ts-ignore */
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
      /* @ts-ignore */
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
