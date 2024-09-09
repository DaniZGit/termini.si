import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(3, "Ime mora vsebovati vsaj 3 črke")
      .max(11, "Ime mora vsebovati manj kot 12 črk")
      .transform((fn) => fn.trim()),
    lastName: z
      .string()
      .min(3, "Priimek mora vsebovati vsaj 3 črke")
      .max(11, "Priimek mora vsebovati manj kot 12 črk")
      .transform((ln) => ln.trim()),
    email: z
      .string()
      .email("Neveljaven email")
      .transform((e) => e.trim()),
    password: z
      .string()
      .min(6, "Geslo mora vsebovati vsaj 6 znakov")
      .transform((p) => p.trim()),
    passwordConfirmation: z.string().transform((p) => p.trim()),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Gesli se ne ujemata",
    path: ["passwordConfirmation"],
  });
