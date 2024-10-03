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

      <div class="grid grid-cols-2 px-4 gap-x-4 gap-y-4">
        <NuxtLink
          v-for="service in services"
          :key="service"
          :to="`/institutions?services=${service}`"
          class="flex flex-col justify-center items-center gap-y-2 aspect-square border-2 border-accent-lightGreen hover:ring-2 ring-accent-lightGreen rounded-lg transition-all duration-200"
        >
          <img
            :src="useAssetUrl(null)"
            class="aspect-square w-2/3 h-auto object-cover"
            width="100"
            height="100"
          ></img>
          <h4 class="text-center text-lg font-medmium text-secondary">
            {{ getServiceTypeTitle(service) }}
          </h4>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const services = ["sports", "hairdressing", "wellness"];
</script>

<style></style>
