<template>
  <div class="bg-neutral-white">
    <div class="flex flex-col gap-y-4 p-4">
      <div>
        <h1 class="text-center text-3xl font-semibold text-secondary">
          {{ $t("register-title") }}
        </h1>
        <div class="text-center flex flex-col items-center">
          <NuxtLink to="/tokens/help" class="text-neutral-darkGray">
            {{ $t("register-description") }}
          </NuxtLink>
        </div>
      </div>

      <form
        id="register_form"
        @submit.prevent="onRegister"
        class="flex flex-col gap-y-2"
      >
        <div>
          <UiFormInput
            v-model="firstName"
            :label="$t('register-input-name-label')"
            type="text"
            name="first_name"
            id="first_name"
            placeholder="Sport"
            :error="formErrors?.firstName?.at(0)"
          />
        </div>
        <div>
          <UiFormInput
            v-model="lastName"
            :label="$t('register-input-surname-label')"
            type="text"
            name="last_name"
            id="last_name"
            placeholder="Reserve"
            :error="formErrors?.lastName?.at(0)"
          />
        </div>
        <div>
          <UiFormInput
            v-model="email"
            :label="$t('register-input-email-label')"
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
            :label="$t('register-input-password-label')"
            type="password"
            name="password"
            id="password"
            placeholder="********"
            :error="formErrors?.password?.at(0)"
          />
        </div>
        <div>
          <UiFormInput
            v-model="passwordConfirmation"
            :label="$t('register-input-password-confirmation-label')"
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            placeholder="********"
            :error="formErrors?.passwordConfirmation?.at(0)"
          />
        </div>

        <div class="text-sm">
          <span class="text-neutral-darkGray">
            {{ $t("register-no-account-description") }}
          </span>
          <NuxtLink :to="localPath('/login')" class="link">{{
            $t("register-no-account-description-link")
          }}</NuxtLink>
        </div>
      </form>

      <UiButton form="register_form" type="submit">
        {{
          !registeringIn
            ? $t("register-idle-button")
            : $t("register-pending-button")
        }}
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { registerSchema } from "~/schemas/register";

  useSeoMeta({
    title: "Register",
    ogTitle: "Register",
  });

  const config = useRuntimeConfig();
  const router = useRouter();
  const { login } = useDirectusAuth();
  const localPath = useLocalePath();

  const firstName = ref("");
  const lastName = ref("");
  const email = ref("");
  const password = ref("");
  const passwordConfirmation = ref("");
  const registeringIn = ref(false);
  const onRegister = async () => {
    if (registeringIn.value || !inputIsValid()) return;

    registeringIn.value = true;
    try {
      // directus module doesn't handle creating users using register method
      await $fetch("/users/register", {
        baseURL: config.public.directus.url,
        method: "POST",
        body: {
          first_name: firstName.value,
          last_name: lastName.value,
          email: email.value,
          password: password.value,
        },
        headers: {
          Authorization: `Bearer ${config.public.directus.staticToken}`,
        },
      });
      await login(email.value, password.value);
      router.push("/");
    } catch (error) {
      console.log("error while trying to log in", error);
    }
    registeringIn.value = false;
  };

  const formErrors = ref<
    Record<keyof typeof registerSchema.shape, string[] | undefined> | undefined
  >();
  const inputIsValid = () => {
    const result = registerSchema.safeParse({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      passwordConfirmation: passwordConfirmation.value,
    });

    formErrors.value = result.error?.formErrors.fieldErrors;
    console.log("errors", result.error?.formErrors.fieldErrors);

    return result.success;
  };
</script>

<style></style>
