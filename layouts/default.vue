<template>
  <div class="h-dvh flex flex-col scroll-smooth">
    <div ref="headerPlaceholder" class="h-16 shrink-0"></div>
    <UiHeader
      class="header fixed top-0 left-0 right-0 -translate-y-full z-50 transition-transform"
      :class="{
        '!translate-y-0': isScrollingUp || headerIsVisible,
      }"
    ></UiHeader>
    <div class="w-full max-w-screen-2xl self-center grow">
      <slot />
    </div>
    <UiFooter></UiFooter>
  </div>
</template>

<script lang="ts" setup>
  const headerPlaceholder = ref<HTMLElement | null>(null);
  const headerIsVisible = useElementVisibility(headerPlaceholder);
  const { x, y } = useWindowScroll();

  const isScrollingUp = ref(true);
  const lastY = ref(0);
  watch(y, (newY) => {
    if (newY < lastY.value) isScrollingUp.value = true;
    else isScrollingUp.value = false;
    lastY.value = newY;
  });

  // update app state
  const stateStore = useStateStore();
  watch(
    () => isScrollingUp.value || headerIsVisible.value,
    (newVisibility) => {
      stateStore.headerIsVisible = newVisibility;
    }
  );
</script>

<style></style>
