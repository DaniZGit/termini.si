<template>
  <div class="bg-neutral-white">
    <div>
      <div class="text-center px-4 py-4">
        <h1 class="text-3xl font-semibold text-secondary">Izberi Storitev</h1>
        <span class="text-neutral-darkGray">
          Ali pa poišči ustanovo preko
          <NuxtLink to="/institutions">
            <span class="link">iskalnika.</span>
          </NuxtLink>
        </span>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 px-4 gap-4 mb-8"
      >
        <NuxtLink
          v-for="service in services"
          :to="`/institutions?services=${service}`"
          class="flex flex-col justify-center items-center gap-y-2 aspect-square border-2 border-accent-lightGreen hover:ring-2 ring-accent-lightGreen rounded-lg transition-all duration-200 p-8"
        >
          <Icon
            :name="service.icon"
            size="100%"
            class="text-primary aspect-square"
          />
          <h4 class="text-center text-xl font-medmium text-secondary">
            {{ getServiceTypeTitle(service.value) }}
          </h4>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const services = [
    {
      value: "sports",
      icon: "i-ic:sharp-sports-tennis",
    },
    {
      value: "wellness",
      icon: "i-hugeicons:wellness",
    },
    {
      value: "hairdressing",
      icon: "i-guidance:hairdresser",
    },
  ];
</script>

<style></style>
