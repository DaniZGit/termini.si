<template>
  <div class="bg-neutral-white">
    <div class="text-center px-4 py-4">
      <NuxtLink to="/services" class="flex justify-between items-end group">
        <h1 class="text-3xl font-semibold text-secondary">Izberi storitev</h1>
        <Icon
          name="i-ic:baseline-arrow-right-alt"
          size="32"
          class="text-primary group-hover:translate-x-2 transition-all"
        />
      </NuxtLink>
      <NuxtLink to="/institutions" class="flex justify-between items-end group">
        <h1 class="text-3xl font-semibold text-secondary">Poišči ustanovo</h1>
        <Icon
          name="i-ic:baseline-arrow-right-alt"
          size="32"
          class="text-primary group-hover:translate-x-2 transition-all"
        />
      </NuxtLink>
    </div>
  </div>

  <div>
    <h4 @click="onLogin">user</h4>
    {{ user }}
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
</script>

<style></style>
