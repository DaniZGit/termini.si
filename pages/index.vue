<template>
  <div class="flex flex-col gap-y-8 text-neutral-darkGray bg-neutral-white">
    <div
      class="flex flex-col justify-center gap-y-8 px-4 h-dvh -mt-14 relative"
    >
      <div class="flex flex-col gap-y-4 text-center">
        <h1 class="text-primary text-4xl font-bold">
          Book Your Perfect Slot at Leading Institutions
        </h1>
        <h4 class="text-lg text-neutral-darkGray">
          From wellness to sports, find and reserve slots with ease.
        </h4>
      </div>

      <div class="flex flex-col justify-center items-center gap-y-4">
        <UiButton class="w-full">Find an institution</UiButton>
        <UiButton class="w-full">Browse Services</UiButton>
      </div>

      <div class="absolute left-0 right-0 bottom-4 flex justify-center">
        <Icon
          name="i-material-symbols-light:arrow-downward-alt-rounded"
          size="64"
          class="text-secondary animate-bounce"
          @click="howItWorksEl?.scrollIntoView({ behavior: 'smooth' })"
        />
      </div>
    </div>

    <hr class="border-2 rounded-full border-neutral-gray mx-4" />

    <div ref="howItWorksEl" class="px-4">
      <h2 class="text-primary text-3xl text-center font-bold mb-8">
        How It Works
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
        Discover Our Services
      </h2>
      <h4 class="text-center mb-8">
        Explore a variety of services tailored to your needs, from fitness and
        sports to wellness and beauty.
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
          <UiButton class="mt-auto">View available Institutions</UiButton>
        </div>
      </div>
    </div>

    <hr class="border-2 rounded-full border-neutral-gray mx-4" />

    <div class="flex flex-col items-center gap-y-8 px-4 pb-8">
      <h2 class="text-primary text-3xl text-center font-bold">
        Why Choose Us?
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
      <UiButton ">Add your Services Today!</UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const { login, user } = useDirectusAuth();
  const onLogin = async () => {
    try {
      await login("daniel123@gmail.com", "daniel123");
    } catch (e) {
      console.log("error while loging in ", e);
    }
  };

  const howItWorksEl = ref<HTMLElement | null>(null);

  const workingCards = [
    {
      title: "1",
      subtitle: "Choose Your Institution",
      description:
        "Browse our directory of registered institutions offering a range of services.",
    },
    {
      title: "2",
      subtitle: "Select Your Service",
      description:
        "Pick the service you need, whether it's a sports field, hairdresser, or wellness therapy.",
    },
    {
      title: "3",
      subtitle: "View Available Slots",
      description:
        "See real-time availability and schedule options directly from the institution.",
    },
    {
      title: "4",
      subtitle: "Reserve Your Slot",
      description: "Easily reserve your spot and pay using plans or tokens.",
    },
  ];

  const services = [
    {
      title: "Wellness & Spa",
      description:
        "Indulge in massages, therapies, and spa treatments for ultimate relaxation.",
      points: ["Massages", "Aromatherapy", "Facials"],
    },
    {
      title: "Sports & Fitness",
      description:
        "Book your next sports session or fitness class at top-notch institutions.",
      points: ["Sports Courts", "Personal Training", "Group Classes"],
    },
    {
      title: "Hair & Beauty",
      description: "Get pampered by professional hairdressers and beauticians.",
      points: ["Haircuts", "Hair Coloring", "Nail Services"],
    },
    {
      title: "Education",
      description:
        "Join a variety of classes and workshops to enhance your skills and knowledge.",
      points: ["Art Classes", "Educational Seminars"],
    },
  ];

  const chooseUsReasons = [
    {
      title: "Real-Time Availability",
    },
    {
      title: "Variety of Services",
    },
    {
      title: "Easy Booking Process",
    },
    {
      title: "Flexible Payment Options",
    },
  ];
</script>

<style></style>
