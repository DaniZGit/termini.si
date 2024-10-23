<template>
  <div class="bg-neutral-white">
    <div class="text-center px-4 py-4">
      <h1 class="text-3xl font-semibold text-secondary">
        {{ $t("tokens-title") }}
      </h1>
      <div class="flex flex-col items-center">
        <NuxtLink to="/tokens/help" class="text-neutral-darkGray">
          {{ $t("tokens-description") }}
          <span
            class="text-accent-lightBlue hover:text-secondary font-semibold underline underline-offset-2"
          >
            {{ $t("tokens-description-link-title") }}
          </span>
        </NuxtLink>
      </div>
    </div>

    <div class="pb-4">
      <h2 class="text-center text-2xl font-semibold text-primary">
        {{ $t("tokens-basic-explanation") }}
      </h2>
    </div>

    <div class="px-4 flex flex-col items-center gap-y-2 text-center">
      <h4>{{ $t("tokens-input-header") }}</h4>
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
        {{ $t("tokens-input-error-title") }}
      </span>
    </div>

    <div class="text-center py-8">
      <NuxtLink
        :to="
          tokens && tokens > 5
            ? localPath(`/tokens/payment?amount=${tokens}`)
            : undefined
        "
      >
        <UiButton class="mt-auto" :disabled="!tokens || tokens <= 5">
          {{
            tokens
              ? `${$t("tokens-button-pay-title")} (${tokens.toFixed(2)} €)`
              : $t("tokens-button-required-title")
          }}
        </UiButton>
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const localPath = useLocalePath();
  const tokens = ref<number>();

  const onInput = (e: KeyboardEvent) => {
    if (e.key === ".") e.preventDefault();
  };

  const route = useRoute();
  onMounted(() => {
    const queryTokens = parseFloat(route.query.amount as string) || 0;
    tokens.value = queryTokens;
  });
</script>

<style></style>
