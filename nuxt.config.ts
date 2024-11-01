// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/nuxt",
    "nuxt-icon",
    "nuxt-directus-next",
    "@nuxt/fonts",
    "@nuxt/image",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@unlok-co/nuxt-stripe",
    "@nuxtjs/i18n",
    "nuxt-og-image",
  ],
  runtimeConfig: {
    public: {
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
    },
  },
  directus: {
    moduleConfig: {
      readMeQuery: {
        fields: [
          "id",
          "first_name",
          "last_name",
          "email",
          "tokens",
          "cart",
          "plans.id",
          "plans.total_reservations",
          "plans.plans_id.id",
          "plans.plans_id.title",
          "plans.plans_id.service.id",
          "plans.plans_id.service.type",
          "plans.plans_id.service.institution.slug",
        ],
      },
    },
  },
  stripe: {
    // Server
    server: {
      key: "sk_test_51LUUJEEaQ0gJxeyLABg1s1Q0Wx02qoHHmQIJJ32yX8gF5XStdrPgZfJ03wIG9J3YOpCDivi5zXAR22SlU5N6ppAz00C55fuEae",
      options: {
        // your api options override for stripe server side
        // https://github.com/stripe/stripe-node?tab=readme-ov-file#configuration
      },
      // CLIENT
    },
    client: {
      key: "pk_test_51LUUJEEaQ0gJxeyLzRn1hMWzF6vPkmOLYTVdDGCGaKwjaIrFlpK2q8jsQL4z4mYlV83sqik40vlVMJDwT9Ueuk2600KKZOVFI6",
      // your api options override for stripe client side https://stripe.com/docs/js/initializing#init_stripe_js-options
      options: {},
    },
  },
  i18n: {
    // Module Options

    locales: [
      {
        code: "sl",
        language: "sl-SI",
        file: "sl-SI.json",
      },
      {
        code: "en",
        language: "en-US",
        file: "en-US.json",
      },
    ],
    langDir: "lang",
    defaultLocale: "en", // default locale of your project for Nuxt pages and routings
  },
  build: {
    transpile: ["@vuepic/vue-datepicker"],
  },
});
