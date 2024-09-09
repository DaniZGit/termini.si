<template>
  <div class="bg-neutral-white">
    <div class="text-center px-4 py-4">
      <h1 class="text-3xl font-semibold text-secondary">Reserve žetoni</h1>
      <div class="flex flex-col items-center">
        <NuxtLink to="/tokens/help" class="text-neutral-darkGray">
          V primeru plačila preko spleta, so za rezervacijo igrišč potrebni
          žetoni. Več o žetonih in njeni uporabi si lahko preberete
          <span
            class="text-accent-lightBlue hover:text-secondary font-semibold underline underline-offset-2"
          >
            tukaj.
          </span>
        </NuxtLink>
      </div>
    </div>

    <div class="pb-4">
      <h2 class="text-center text-2xl font-semibold text-primary">
        1€ je 1 žeton
      </h2>
    </div>

    <div class="px-4 flex flex-col items-center gap-y-2 text-center">
      <h4>Vnesite število žetonov, ki jih želite dodati na račun</h4>
      <input
        v-model="tokens"
        name="tokens"
        type="number"
        min="6"
        step="1"
        class="w-1/2 text-center text-secondary font-semibold border-b-2 border-primary placeholder-neutral-gray outline-none"
        placeholder="16"
        @keydown="onInput"
      />
      <span v-show="tokens && tokens <= 5" class="text-neutral-red">
        Naložiti morate vsaj 5 žetonov
      </span>
    </div>

    <div class="absolute bottom-0 left-0 right-0 text-center pb-4">
      <NuxtLink
        :to="
          tokens && tokens > 5 ? `/tokens/payment?amount=${tokens}` : undefined
        "
      >
        <UiButton class="mt-auto" :disabled="!tokens || tokens <= 5">
          {{
            tokens
              ? `Pojdi na plačilo (${tokens.toFixed(2)} €)`
              : "Vnesi število žetonov"
          }}
        </UiButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const tokens = ref<number>();

  const onInput = (e: KeyboardEvent) => {
    if (e.key === ".") e.preventDefault();
  };

  const route = useRoute();
  onMounted(() => {
    const queryTokens = parseFloat(route.query.amount) || 0;
    tokens.value = queryTokens;
  });
</script>

<style></style>
