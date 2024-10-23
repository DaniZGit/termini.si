<template>
  <div class="max-w-screen-2xl mx-auto overflow-hidden">
    <div
      class="h-16 overflow-hidden p-2 border-b-2 2xl:border-x-2 border-primary bg-white"
    >
      <div class="h-full flex justify-between items-center relative">
        <NuxtLink :to="localePath('/')" class="h-full py-1" @click="hideMenu">
          <img src="/images/logo-side-spaceless.png" class="h-full" />
        </NuxtLink>

        <div class="flex items-center gap-x-1">
          <Icon
            v-if="user"
            name="i-ic:baseline-person-outline"
            size="28"
            class="text-primary hover:cursor-pointer"
            @click="onLinkClick('/profile')"
          />
          <Icon
            :name="menuIsOpened ? 'i-ic:round-close' : 'i-ic:round-menu'"
            size="32"
            class="text-primary hover:cursor-pointer"
            @click="onMenuOpen"
          />
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div
        class="fixed top-16 left-0 right-0 bottom-0 overflow-hidden z-50"
        :class="{ 'pointer-events-none': !menuIsOpened }"
      >
        <div
          class="w-full h-full bg-white bg-opacity-80 backdrop-blur-md translate-x-full transition-transform"
          :class="{
            '!translate-x-0': menuIsOpened,
          }"
        >
          <div class="h-full flex flex-col justify-between p-4">
            <div class="flex flex-col gap-y-1">
              <div v-if="user" class="flex justify-between gap-x-6">
                <div>
                  <span class="font-semibold line-clamp-1">
                    {{ user?.first_name }} {{ user?.last_name }}
                  </span>
                </div>
                <div class="flex items-center gap-x-1 shrink-0">
                  <div>
                    <span
                      class="text-secondary font-semibold underline underline-offset-2"
                    >
                      {{ user?.tokens }}
                    </span>
                    <span class="ml-2">{{ $t("header-tokens") }}</span>
                  </div>
                  <NuxtLink :to="localePath('/tokens')">
                    <Icon
                      name="i-ic:round-add-circle-outline"
                      size="22"
                      class="text-primary"
                      @click="onLinkClick('/')"
                    />
                  </NuxtLink>
                </div>
              </div>
              <hr v-if="user" class="border-2 border-secondary rounded-full" />
              <div class="flex flex-col items-center gap-y-2 py-1">
                <NuxtLink
                  v-for="link in links"
                  :key="link.url"
                  :to="localePath(link.url)"
                  class="w-full header-link"
                  active-class="!bg-secondary !text-neutral-white"
                  @click="hideMenu"
                >
                  {{ link.title }}
                </NuxtLink>
              </div>
            </div>

            <div class="flex flex-col gap-y-4">
              <div v-if="user" class="grid grid-cols-2 gap-x-8">
                <UiButton
                  class="flex items-center justify-center gap-x-2"
                  @click="onLinkClick('/profile')"
                >
                  <Icon name="i-ic:sharp-person-outline" size="32" />
                  <span>{{ $t("header-profile-button") }}</span>
                </UiButton>
                <UiButton
                  class="flex items-center justify-center gap-x-2 !bg-neutral-red"
                  @click="onLogout"
                >
                  <span>{{ $t("header-logout-button") }}</span>
                  <Icon name="i-ic:round-logout" size="32" />
                </UiButton>
              </div>
              <div v-else>
                <UiButton
                  class="flex items-center justify-center gap-x-2 mx-auto"
                  @click="onLinkClick('/login')"
                >
                  <span>{{ $t("header-login-button") }}</span>
                  <Icon name="i-ic:round-login" size="32" />
                </UiButton>
              </div>

              <!-- Lang Switch -->
              <div class="flex justify-center gap-x-4">
                <Icon
                  name="i-twemoji:flag-slovenia"
                  size="32"
                  class="border-b-4 border-neutral-white transition-colors hover:cursor-pointer"
                  :class="{ 'border-primary': locale == 'sl' }"
                  @click="setLocale('sl')"
                />
                <Icon
                  name="i-twemoji:flag-us-outlying-islands"
                  size="32"
                  class="border-b-4 border-neutral-white transition-colors hover:cursor-pointer"
                  :class="{ 'border-primary': locale == 'en' }"
                  @click="setLocale('en')"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  const { user, logout } = useDirectusAuth();
  const { t, locale, setLocale } = useI18n();
  const localePath = useLocalePath();
  const localeRoute = useLocaleRoute();

  const links = computed(() => [
    {
      title: t("header-homepage-link-title"),
      url: "/",
    },
    {
      title: t("header-system-link-title"),
      url: "/system",
    },
    {
      title: t("header-institutions-link-title"),
      url: "/institutions",
    },
    {
      title: t("header-services-link-title"),
      url: "/services",
    },
    {
      title: t("header-tokens-link-title"),
      url: "/tokens",
    },
  ]);

  const onLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.log("error while logging out", error);
    }
  };

  const menuIsOpened = ref(false);
  const onMenuOpen = () => {
    if (menuIsOpened.value) hideMenu();
    else showMenu();
  };

  const onLinkClick = (to: string) => {
    const route = localeRoute({ path: to });
    if (route) {
      navigateTo(route.fullPath);
      hideMenu();
    }
  };

  const showMenu = () => {
    menuIsOpened.value = true;
    document.body.style.overflow = "hidden";
  };

  const hideMenu = () => {
    menuIsOpened.value = false;
    document.body.style.overflow = "visible";
  };
</script>

<style scoped></style>
