<template>
  <teleport to="body">
    <div
      v-if="visible"
      ref="modal"
      class="fixed top-0 left-0 right-0 bottom-0 z-40 flex items-center"
      :class="{
        'modal-open': visible,
        '!top-16': stateStore.headerIsVisible,
      }"
    >
      <div
        class="absolute top-0 left-0 right-0 bottom-0 bg-neutral-white bg-opacity-0 -z-10 backdrop-blur-md"
      ></div>

      <div
        class="w-full h-auto flex flex-col justify-center gap-y-4 text-neutral-darkGray p-4 mx-4 bg-neutral-white border-2 border-secondary rounded-md"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-2xl text-secondary font-bold">Prijava</h2>
          <Icon
            name="i-ic:outline-cancel"
            size="28"
            class="text-secondary"
            @click="onClose"
          />
        </div>

        <div class="flex flex-col gap-y-2">
          <div class="my-auto text-center">
            <span class="text-neutral-darkGray">
              Za rezervacijo je potrebna prijava.
            </span>
          </div>
        </div>

        <UiButton
          class="w-full flex items-center justify-center gap-x-2 self-end uppercase"
          @click="$router.push('/login')"
        >
          <span>Pojdi na prijavo</span>
          <Icon name="i-ic:round-login" size="24" />
        </UiButton>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts" setup>
  const stateStore = useStateStore();

  const modal = ref<HTMLElement | null>(null);
  const visible = defineModel("visible", {
    default: false,
  });

  const onClose = () => {
    visible.value = false;
  };
</script>

<style></style>
