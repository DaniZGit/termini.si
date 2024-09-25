<template>
  <div class="bg-neutral-white">
    <div class="flex flex-col gap-y-4 p-4">
      <div>
        <h1 class="text-center text-3xl font-semibold text-secondary">
          Registracija računa
        </h1>
        <div class="text-center flex flex-col items-center">
          <NuxtLink to="/tokens/help" class="text-neutral-darkGray">
            Z obstoječim računom lahko rezervirate termine ter izvajate plačila
            preko spleta.
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
            label="Ime"
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
            label="Priimek"
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
            label="Email"
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
            label="Geslo"
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
            label="Potrdi geslo"
            type="password"
            name="password_confirmation"
            id="password_confirmation"
            placeholder="********"
            :error="formErrors?.passwordConfirmation?.at(0)"
          />
        </div>

        <div class="text-sm">
          <span class="text-neutral-darkGray">
            Že imate račun? Prijavite se
          </span>
          <NuxtLink to="/login" class="link">tukaj.</NuxtLink>
        </div>
      </form>

      <UiButton form="register_form" type="submit">
        {{ !registeringIn ? "Ustvari" : "Ustvarjanje računa..." }}
      </UiButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { registerSchema } from "~/schemas/register";

  const config = useRuntimeConfig();
  const router = useRouter();
  const { login } = useDirectusAuth();

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
