<template>
  <div
    class="max-w-screen-2xl mx-auto 2xl:border-x-2 border-primary grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 pt-8 px-8 bg-neutral-white border-t-2 border-neutral-gray text-center lg:text-left"
  >
    <div>
      <h2 class="text-xl text-primary font-bold mb-2">Quick Links</h2>
      <div class="flex flex-col gap-y-1">
        <NuxtLink
          v-for="link in quickLinks"
          :to="localPath(link.href)"
          class="link"
          >{{ link.title }}</NuxtLink
        >
      </div>
    </div>

    <div>
      <h2 class="text-xl text-primary font-bold mb-2">Contact Info</h2>
      <div class="flex flex-col text-secondary font-semibold">
        <span>
          {{ $t("footer-email") }}
          <span class="underline underline-offset-2"> info@termini.si </span>
        </span>
        <span>
          {{ $t("footer-phone") }}
          <span class="underline underline-offset-2"> 123-456-789 </span>
        </span>
        <span>
          {{ $t("footer-address") }}
          <span class="underline underline-offset-2">
            Slovenska cesta 7, 1000 Ljubljana
          </span>
        </span>
      </div>
    </div>

    <div>
      <h2 class="text-xl text-primary font-bold mb-2">
        {{ $t("footer-follow-us") }}
      </h2>
      <div
        class="flex flex-col items-center lg:items-start gap-2 text-secondary font-semibold"
      >
        <NuxtLink
          v-for="social in socials"
          :to="localPath(social.href)"
          class="flex items-center gap-x-2"
        >
          <Icon :name="social.icon" size="26" />
          <span>{{ social.title }}</span>
        </NuxtLink>
      </div>
    </div>

    <div>
      <h2 class="text-xl text-primary font-bold mb-2">
        {{ $t("footer-download-title") }}
      </h2>
      <div class="text-secondary font-semibold mb-2">
        {{ $t("footer-download-description") }}
      </div>
      <div class="flex flex-col gap-y-2">
        <UiButton class="flex justify-center gap-x-2">
          <span> {{ $t("footer-download-android-button") }} </span>
          <Icon name="i-material-symbols-light:android" size="26"
        /></UiButton>
        <UiButton class="flex justify-center gap-x-2">
          <Icon name="i-ic:outline-apple" size="26" />
          <span> {{ $t("footer-download-ios-button") }} </span>
        </UiButton>
      </div>
    </div>

    <div
      class="sm:col-span-2 lg:col-span-4 text-neutral-darkGray text-center border-t-2 border-neutral-gray py-8"
    >
      &copy;
      {{ new Date().getFullYear() }}
      {{ $t("footer-copyright") }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  const { t } = useI18n();
  const localPath = useLocalePath();

  const quickLinks = computed(() => [
    {
      title: t("header-homepage-link-title"),
      href: "/",
    },
    {
      title: t("header-institutions-link-title"),
      href: "/institutions",
    },
    {
      title: t("header-services-link-title"),
      href: "/services",
    },
    {
      title: t("header-privacy-policy-link-title"),
      href: "/privacy-policy",
    },
    {
      title: t("header-tos-link-title"),
      href: "/tos",
    },
    {
      title: t("header-contact-link-title"),
      href: "/contact",
    },
  ]);

  const socials = [
    {
      title: "Twitter",
      icon: "i-hugeicons:new-twitter",
      href: "https://www.x.com",
    },
    {
      title: "Facebook",
      icon: "i-hugeicons:facebook-02",
      href: "https://www.facebook.com",
    },
    {
      title: "Instagram",
      icon: "i-hugeicons:instagram",
      href: "https://www.instagram.com",
    },
    {
      title: "Tiktok",
      icon: "i-hugeicons:tiktok",
      href: "https://www.tiktok.com",
    },
  ];
</script>

<style></style>
