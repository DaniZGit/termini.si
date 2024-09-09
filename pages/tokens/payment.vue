<template>
  <div class="grow grid grid-flow-row grid-rows-12 text-neutral-darkGray">
    <div class="row-span-1 flex justify-center items-center">
      <div class="absolute left-0 px-2 my-auto">
        <NuxtLink
          :to="`/tokens${
            route.query.amount ? '?amount=' + $route.query.amount : ''
          }`"
        >
          <Icon name="i-mdi:arrow-left-thin" size="26" class="text-secondary" />
        </NuxtLink>
      </div>
      <h2 class="text-center text-2xl text-secondary font-bold py-2">
        Plačilo
      </h2>
    </div>
    <!-- <hr class="h-1 border-0 bg-primary my-1" /> -->

    <div class="row-span-10 flex flex-col gap-y-2 overflow-auto">
      <div
        :class="{
          'py-16': status == 'loading-stripe',
        }"
      >
        <!-- lOADING INDICATOR -->
        <div
          v-if="status == 'loading-stripe'"
          class="w-full h-full flex items-center justify-center"
        >
          <Icon
            name="i-svg-spinners:blocks-shuffle-3"
            size="64"
            class="text-primary flex m-auto"
          />
        </div>
        <!-- ERROR INDICATOR -->
        <div
          v-if="status == 'error'"
          class="w-full h-full flex items-center justify-center px-4 py-16"
        >
          <h3 class="text-xl font-semibold text-neutral-red text-center">
            Nekaj je šlo narobe, poskusite kasneje...
          </h3>
        </div>
        <!-- STRIPE ELEMENT-->
        <h2
          v-show="
            status != 'loading-stripe' &&
            status != 'error' &&
            status != 'success'
          "
          class="font-bold text-lg text-center"
        >
          Vnesite podatke za plačilo
        </h2>
        <div
          v-show="
            status != 'loading-stripe' &&
            status != 'error' &&
            status != 'success'
          "
          id="payment-element"
          class="text-app-secondary px-2"
        ></div>

        <!-- SUCCESS INDICATOR-->
        <div
          v-show="status == 'success'"
          class="font-bold text-lg text-center py-16"
        >
          <span>Plačilo je bilo uspešno, žetoni bodo kmalu na </span>
          <NuxtLink
            to="/profile"
            class="text-secondary underline underline-offset-2"
          >
            <span>računu</span>
            <Icon name="i-ic:round-arrow-right-alt" size="32" />
          </NuxtLink>
        </div>
      </div>

      <div class="flex flex-col gap-y-2 pb-2">
        <div>
          <div
            class="flex items-center justify-between border-b-2 border-primary mx-2"
            @click="showTerms = !showTerms"
          >
            <h2 class="text-lg text-secondary font-semibold">
              Splošni pogoji poslovanja
            </h2>
            <Icon
              name="i-ic:baseline-arrow-right"
              size="32"
              class="text-secondary transition-transform"
              :class="{
                'rotate-90': showTerms,
              }"
            />
          </div>
          <div class="px-4" v-if="showTerms">
            S tem je povezana obveznost plačila podjetju in strinjanje s
            <NuxtLink to="/terms" class="text-primary font-medium underline"
              >splošnimi pogoji poslovanja</NuxtLink
            >.
          </div>
        </div>
      </div>
    </div>

    <div class="row-span-1 w-full h-full mt-auto">
      <UiButton
        class="w-full h-full flex justify-center items-center gap-x-2 rounded-none"
        :class="{
          '!bg-secondary': issuingPayment || status == 'loading-stripe',
        }"
        :disabled="!stripeFormValidated || issuingPayment"
        @click="onPayment"
      >
        <div v-if="status == 'success'" class="flex items-center gap-x-2">
          <span>Plačano</span>
          <Icon name="i-line-md:check-all" size="26" />
        </div>
        <span v-else-if="!issuingPayment">{{ getButtonText() }}</span>
        <div v-else class="flex items-center gap-x-2">
          <span>Plačilo se izvršuje</span>
          <Icon name="i-svg-spinners:bars-scale-fade" size="26" />
        </div>
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import type { StripeElements, Stripe } from "@stripe/stripe-js";

  const route = useRoute();
  const config = useRuntimeConfig();
  const showTerms = ref(false);

  const stripe: Ref<Stripe> = await useClientStripe();
  const elements = ref<StripeElements | undefined>();
  const stripeFormValidated = ref(false);
  const { data, execute } = await useFetch<{
    client_secret: string;
    tokens: number;
    amount: number;
  }>(`/stripe-payment-intent`, {
    baseURL: config.public.directus.url,
    headers: {
      Authorization: `Bearer ${useDirectusUsers().tokens.value?.access_token}`,
    },
    params: {
      tokens: route.query.amount ?? "0",
    },
    immediate: false,
  });

  // onMounted doesn't work
  const status = ref<"loading-stripe" | "ready" | "error" | "success">(
    "loading-stripe"
  );
  onNuxtReady(async () => {
    let tokens = parseFloat(route.query.amount) || 0;
    if (tokens < 0 || tokens > 500) {
      status.value = "error";
      return;
    }

    // fetch payment intent
    status.value = "loading-stripe";
    await execute();

    // load stripe elements
    elements.value = stripe.value.elements({
      clientSecret: data.value?.client_secret ?? "",
    });

    // embed stripe form
    const paymentElement = elements.value.create("payment");
    paymentElement.mount("#payment-element");

    paymentElement.on("change", function (event) {
      stripeFormValidated.value = event.complete;
    });

    paymentElement.on("ready", () => {
      status.value = "ready";
    });
  });

  const issuingPayment = ref(false);
  const onPayment = async () => {
    if (!stripe.value || !elements.value) return;

    issuingPayment.value = true;
    const { error } = await stripe.value.confirmPayment({
      elements: elements.value,
      confirmParams: {
        return_url: `${window.location.origin}/cart/success`,
      },
      redirect: "if_required",
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        console.log("Card or validation while issuing stripe payment");
      } else {
        console.log("Some other error while issuing stripe payment");
      }

      status.value = "error";
    } else {
      status.value = "success";
    }

    issuingPayment.value = false;
  };

  const getButtonText = () => {
    if (status.value == "loading-stripe") return "Nalaganje plačilnega sistema";

    const tokens = parseFloat(route.query.amount) || 0;
    return `Plačaj ${tokens.toFixed(2)} €`;
  };
</script>

<style></style>
