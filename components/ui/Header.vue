<template>
  <div class="overflow-hidden">
    <div class="h-16 overflow-hidden p-2 border-b-2 border-primary bg-white">
      <div class="h-full flex justify-between items-center relative">
        <NuxtLink to="/" class="h-full py-1" @click="hideMenu">
          <img src="/images/logo-side-spaceless.png" class="h-full" />
        </NuxtLink>

        <div class="flex gap-x-1">
          <Icon
            :name="menuIsOpened ? 'i-ic:round-close' : 'i-ic:round-menu'"
            size="32"
            class="text-primary"
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
                    <span> žetonov</span>
                  </div>
                  <NuxtLink to="/tokens">
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
                  :to="link.url"
                  class="w-full header-link"
                  active-class="!bg-secondary !text-neutral-white"
                  @click="hideMenu"
                >
                  {{ link.title }}
                </NuxtLink>
              </div>
            </div>
            <div v-if="user" class="grid grid-cols-2 gap-x-8">
              <UiButton
                class="flex items-center justify-center gap-x-2"
                @click="onLinkClick('/profile')"
              >
                <Icon name="i-ic:sharp-person-outline" size="32" />
                <span>Profil</span>
              </UiButton>
              <UiButton
                class="flex items-center justify-center gap-x-2 !bg-neutral-red"
                @click="onLogout"
              >
                <span>Odjava</span>
                <Icon name="i-ic:round-logout" size="32" />
              </UiButton>
            </div>
            <div v-else>
              <UiButton
                class="flex items-center justify-center gap-x-2 mx-auto"
                @click="onLinkClick('/login')"
              >
                <span>Prijava</span>
                <Icon name="i-ic:round-login" size="32" />
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
  const router = useRouter();
  const { user, logout } = useDirectusAuth();

  const links = [
    {
      title: "Domov",
      url: "/",
    },
    {
      title: "O sistemu",
      url: "/system",
    },
    {
      title: "Inštitucije",
      url: "/institutions",
    },
    {
      title: "Športne dejavnosti",
      url: "/sports",
    },
    {
      title: "Žetoni",
      url: "/tokens",
    },
  ];

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
    router.push(to);
    hideMenu();
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
