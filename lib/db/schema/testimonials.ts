import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";

export const testimonialStatus = pgEnum("testimonial_status", [
  "APPROVED",
  "PENDING",
  "REJECTED",
]);

export const testimonials = pgTable("testimonials", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  content: text("content").notNull(),
  status: testimonialStatus("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});
