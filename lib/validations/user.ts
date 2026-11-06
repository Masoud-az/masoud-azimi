import { z } from "zod";

export const syncUserSchema = z
  .object({
    firstName: z.string().trim().min(1).max(30),
    lastName: z.string().trim().min(1).max(30),
    phoneNumber: z
      .string()
      .trim()
      .regex(/^09\d{9}$/),
  })
  .strict();

export type SyncUserInput = z.infer<typeof syncUserSchema>;
