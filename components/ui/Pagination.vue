<template>
  <div class="flex justify-center items-center gap-x-2">
    <Icon
      name="i-ic:round-keyboard-double-arrow-left"
      size="32"
      class="text-primary border-2 border-neutral-white hover:border-accent-lightBlue rounded-md"
      :class="{
        'text-accent-lightGreen pointer-events-none': page == 1,
      }"
      @click="paginateTo(1)"
    />
    <Icon
      name="i-ic:round-keyboard-arrow-left"
      size="32"
      class="text-primary border-2 border-neutral-white hover:border-accent-lightBlue rounded-md"
      :class="{
        'text-accent-lightGreen pointer-events-none': page == 1,
      }"
      @click="paginateTo(page - 1)"
    />
    <div class="flex items-center gap-x-2">
      <span
        class="link text-lg"
        :class="{ '!text-secondary': page == 1 }"
        @click="paginateTo(1)"
      >
        {{ 1 }}
      </span>
      <span v-show="page > 2 && totalPages > 3"> ... </span>
      <div v-if="totalPages > 2">
        <span
          v-for="i in getPagesInBetween()"
          class="link text-lg"
          :class="{ '!text-secondary': page == i }"
          @click="paginateTo(i)"
        >
          {{ i }}
        </span>
      </div>
      <span v-show="page + 1 < totalPages && totalPages > 3"> ... </span>
      <span
        v-if="totalPages > 1"
        class="link text-lg"
        :class="{ '!text-secondary': page == totalPages }"
        @click="paginateTo(totalPages)"
      >
        {{ totalPages }}
      </span>
    </div>
    <Icon
      name="i-ic:round-keyboard-arrow-right"
      size="32"
      class="text-primary border-2 border-neutral-white hover:border-accent-lightBlue rounded-md"
      :class="{
        'text-accent-lightGreen pointer-events-none': page == totalPages,
      }"
      @click="paginateTo(page + 1)"
    />
    <Icon
      name="i-ic:round-keyboard-double-arrow-right"
      size="32"
      class="text-primary border-2 border-neutral-white hover:border-accent-lightBlue rounded-md"
      :class="{
        'text-accent-lightGreen pointer-events-none': page == totalPages,
      }"
      @click="paginateTo(totalPages)"
    />
  </div>
</template>

<script lang="ts" setup>
  const page = defineModel({ type: Number, default: 1 });

  const props = defineProps({
    totalPages: {
      type: Number,
      default: 1,
    },
  });

  const getPagesInBetween = () => {
    // 1 ... 3 ... 5
    // 1 2 ... 5
    // 1 ... 4 5
    // 1 2 3
    const pages = [];
    if (page.value == 1 && page.value + 1 < props.totalPages)
      pages.push(page.value + 1);
    else if (page.value == props.totalPages && page.value - 1 > 1)
      pages.push(page.value - 1);
    else pages.push(page.value);

    return pages;
  };

  const paginateTo = (num: number) => {
    if (num < 1 || num > props.totalPages) return;
    page.value = num;
  };
</script>

<style></style>
