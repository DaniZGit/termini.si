import { useServerStripe } from "#stripe/server";

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event);

  // fetch slots
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1999,
    currency: "eur",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    client_secret: paymentIntent.client_secret,
  };
});
