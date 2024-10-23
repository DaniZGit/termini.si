<template>
  <div class="bg-neutral-white">
    <div class="flex flex-col gap-y-4 p-4">
      <div>
        <h1 class="text-center text-3xl font-semibold text-secondary">
          {{ $t("login-title") }}
        </h1>
        <div class="text-center flex flex-col items-center">
          <NuxtLink to="/tokens/help" class="text-neutral-darkGray">
            {{ $t("login-description") }}
          </NuxtLink>
        </div>
      </div>

      <form
        id="login_form"
        @submit.prevent="onLogin"
        class="flex flex-col gap-y-2"
      >
        <div>
          <UiFormInput
            v-model="email"
            :label="$t('login-input-email-label')"
            type="email"
            name="email"
            id="email"
            placeholder="sport-reserve@gmail.com"
            :error="formErrors?.email?.at(0)"
          />
        </div>
        <div>
          <UiFormInput
            v-model="password"
            :label="$t('login-input-password-label')"
            type="password"
            name="password"
            id="password"
            placeholder="********"
            :error="formErrors?.password?.at(0)"
          />
        </div>

        <div class="text-sm">
          <span class="text-neutral-darkGray">
            {{ $t("login-no-account-description") }}
          </span>
          <NuxtLink :to="localPath('/register')" class="link">{{
            $t("login-no-account-description-link")
          }}</NuxtLink>
        </div>
      </form>

      <UiButton form="login_form">
        {{ !loggingIn ? $t("login-idle-button") : $t("login-pending-button") }}
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { loginSchema } from "~/schemas/login";

  const localPath = useLocalePath();
  const { login } = useDirectusAuth();
  const router = useRouter();

  const email = ref("");
  const password = ref("");
  const loggingIn = ref(false);
  const onLogin = async () => {
    if (loggingIn.value || !inputIsValid()) return;

    loggingIn.value = true;
    try {
      await login(email.value, password.value);
      router.push("/");
    } catch (error) {
      console.log("error while trying to log in", error);
    }
    loggingIn.value = false;
  };

  const formErrors = ref<
    Record<keyof typeof loginSchema.shape, string[] | undefined> | undefined
  >();
  const inputIsValid = () => {
    const result = loginSchema.safeParse({
      email: email.value,
      password: password.value,
    });

    formErrors.value = result.error?.formErrors.fieldErrors;
    console.log("errors", result.error?.formErrors.fieldErrors);

    return result.success;
  };
</script>

<style></style>
