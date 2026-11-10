import z from "zod";

export const offeringVisibilitySchema = z
  .object({
    isVisible: z.boolean(),
  })
  .strict();

export type OfferingVisibilitySchema = z.infer<typeof offeringVisibilitySchema>;
