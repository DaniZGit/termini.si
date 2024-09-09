import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email("Neveljaven email")
    .transform((e) => e.trim()),
  password: z
    .string()
    .min(6, "Geslo mora vsebovati vsaj 6 znakov")
    .transform((p) => p.trim()),
});
