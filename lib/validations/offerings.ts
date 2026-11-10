import z from "zod";

export const createOfferingSchema = z
  .object({
    title: z.string().trim().min(1).max(50),
    shortDescription: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(9000),
    durationText: z.string().trim().max(100).optional(),
    registrationInfo: z.string().trim().max(1000).optional(),
  })
  .strict();

export type CreateOfferingSchema = z.infer<typeof createOfferingSchema>;
