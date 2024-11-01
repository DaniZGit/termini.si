<template>
  <div class="flex flex-col gap-y-8 text-neutral-darkGray bg-neutral-white">
    <div
      class="flex flex-col justify-center gap-y-8 px-4 h-dvh -mt-14 relative bg-[55%] lg:bg-[60%] xl:bg-[70%] 2xl:bg-[110%] bg-no-repeat bg-cover"
      style="
        background-image: url('/images/homepage.png');
        box-shadow: inset 0 0 0 1000px rgba(255, 255, 255, 0.5);
      "
    >
      <div class="flex flex-col gap-y-4 text-center">
        <h1 class="text-primary text-4xl font-bold">
          {{ $t("homepage-hero-title") }}
        </h1>
        <h4 class="text-lg text-neutral-darkGray">
          {{ $t("homepage-hero-subtitle") }}
        </h4>
      </div>

      <div class="flex flex-col lg:flex-row justify-center items-center gap-4">
        <UiButton
          class="w-full lg:w-1/3 lg:py-8"
          @click="$router.push('/institutions')"
        >
          {{ $t("homepage-hero-institutions-button") }}
        </UiButton>
        <UiButton
          class="w-full lg:w-1/3 lg:py-8"
          @click="$router.push('/services')"
        >
          {{ $t("homepage-hero-services-button") }}
        </UiButton>
      </div>

      <div class="absolute left-0 right-0 bottom-4 flex justify-center">
        <Icon
          name="i-fa:arrow-down"
          size="64"
          class="text-secondary animate-bounce hover:cursor-pointer"
          @click="howItWorksEl?.scrollIntoView({ behavior: 'smooth' })"
        />
      </div>
    </div>

    <hr class="border-2 rounded-full border-neutral-gray mx-4" />

    <div ref="howItWorksEl" class="px-4">
      <h2 class="text-primary text-3xl text-center font-bold mb-8">
        {{ $t("homepage-hiw-title") }}
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2 text-neutral-white"
      >
        <div
          v-for="card in workingCards"
          class="flex flex-col gap-y-4 bg-secondary rounded-md p-4"
        >
          <h3 class="text-xl font-semibold">
            {{ card.title }}
          </h3>
          <div>
            <h4 class="text-lg font-semibold">{{ card.subtitle }}</h4>
            <span>{{ card.description }}</span>
          </div>
        </div>
      </div>
    </div>

    <hr class="border-2 rounded-full border-neutral-gray mx-4" />

    <div class="px-4">
      <h2 class="text-primary text-3xl text-center font-bold mb-2">
        {{ $t("homepage-dos-title") }}
      </h2>
      <h4 class="text-center mb-8">
        {{ $t("homepage-dos-description") }}
      </h4>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-2 text-neutral-white"
      >
        <div
          v-for="service in services"
          class="flex flex-col gap-y-4 bg-secondary rounded-md p-4"
        >
          <h3 class="text-xl font-semibold">
            {{ service.title }}
          </h3>
          <div>
            <span>{{ service.description }}</span>
            <ul class="pl-6">
              <li v-for="point in service.points" class="list-disc">
                {{ point }}
              </li>
            </ul>
          </div>
          <UiButton class="mt-auto">{{
            $t("homepage-dos-institutions-button")
          }}</UiButton>
        </div>
      </div>
    </div>

    <hr class="border-2 rounded-full border-neutral-gray mx-4" />

    <div class="flex flex-col items-center gap-y-8 px-4 pb-8">
      <h2 class="text-primary text-3xl text-center font-bold">
        {{ $t("homepage-wcu-title") }}
      </h2>
      <div class="inline-grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
        <div v-for="reason in chooseUsReasons" class="inline-flex gap-x-2">
          <Icon
            name="i-material-symbols-light:check-circle-outline-rounded"
            size="26"
            class="text-secondary"
          />
          <h3 class="text-secondary text-xl font-semibold">
            {{ reason.title }}
          </h3>
        </div>
      </div>
      <div class="flex flex-col items-center sm:flex-row gap-x-4 gap-y-2">
        <UiButton>{{ $t("homepage-wcu-services-button") }}</UiButton>
        <span class="text-lg text-secondary underline underline-offset-2"
          >or</span
        >
        <UiButton>{{ $t("homepage-wcu-contact-button") }}</UiButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  useSeoMeta({
    title: "Termini",
    ogTitle: "Termini",
  });

  const { login, user } = useDirectusAuth();
  const onLogin = async () => {
    try {
      await login("daniel123@gmail.com", "daniel123");
    } catch (e) {
      console.log("error while loging in ", e);
    }
  };

  const { t } = useI18n();

  const howItWorksEl = ref<HTMLElement | null>(null);

  const workingCards = [
    {
      title: "1",
      subtitle: t("homepage-hiw-one-subtitle"),
      description: t("homepage-hiw-one-description"),
    },
    {
      title: "2",
      subtitle: t("homepage-hiw-two-subtitle"),
      description: t("homepage-hiw-two-description"),
    },
    {
      title: "3",
      subtitle: t("homepage-hiw-three-subtitle"),
      description: t("homepage-hiw-three-description"),
    },
    {
      title: "4",
      subtitle: t("homepage-hiw-four-subtitle"),
      description: t("homepage-hiw-four-description"),
    },
  ];

  const services = [
    {
      title: t("homepage-dos-wellness-title"),
      description: t("homepage-dos-wellness-description"),
      points: [
        t("homepage-dos-wellness-massages"),
        t("homepage-dos-wellness-aromatherapy"),
        t("homepage-dos-wellness-facials"),
      ],
    },
    {
      title: t("homepage-dos-sports-title"),
      description: t("homepage-dos-sports-description"),
      points: [
        t("homepage-dos-sports-courts"),
        t("homepage-dos-sports-training"),
        t("homepage-dos-sports-classes"),
      ],
    },
    {
      title: t("homepage-dos-beauty-title"),
      description: t("homepage-dos-beauty-description"),
      points: [
        t("homepage-dos-beauty-haircuts"),
        t("homepage-dos-beauty-coloring"),
        t("homepage-dos-beauty-nails"),
      ],
    },
    {
      title: t("homepage-dos-education-title"),
      description: t("homepage-dos-education-description"),
      points: [
        t("homepage-dos-education-art"),
        t("homepage-dos-education-seminars"),
      ],
    },
  ];

  const chooseUsReasons = [
    {
      title: t("homepage-wcu-reason-one-title"),
    },
    {
      title: t("homepage-wcu-reason-two-title"),
    },
    {
      title: t("homepage-wcu-reason-three-title"),
    },
    {
      title: t("homepage-wcu-reason-four-title"),
    },
  ];
</script>

<style></style>
