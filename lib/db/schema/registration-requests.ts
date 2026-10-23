import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { offerings } from "./offerings";
import { users } from "./users";

export const registrationStatus = pgEnum("registration_status", [
  "PENDING",
  "CONTACTED",
  "ACCEPTED",
]);

export const registrationRequests = pgTable("registration_requests", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  offeringId: uuid("offering_id")
    .references(() => offerings.id)
    .notNull(),
  message: text("message"),
  status: registrationStatus().default("PENDING").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
