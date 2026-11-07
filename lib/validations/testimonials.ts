import z from "zod";
import { testimonialStatus } from "../db/schema/testimonials";

export const createTestimonialSchema = z
  .object({
    content: z.string().trim().min(1).max(500),
  })
  .strict();

export type CreateTestimonialSchema = z.infer<typeof createTestimonialSchema>;

export const deleteTestimonialSchema = z
  .object({
    testimonialId: z.uuid(),
  })
  .strict();

export type DeleteTestimonialSchema = z.infer<typeof deleteTestimonialSchema>;

export const updateTestimonialStatusSchema = z
  .object({
    testimonialId: z.uuid(),
    status: z.enum(["APPROVED", "REJECTED"]),
  })
  .strict();

export type UpdateTestimonialStatusSchema = z.infer<
  typeof updateTestimonialStatusSchema
>;
