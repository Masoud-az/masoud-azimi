import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const offeringsTypeEnum = pgEnum("offering_type", [
  "OFFLINE_COURSE",
  "ONLINE_CLASS",
  "IN_PERSON_CLASS",
]);

export const offerings = pgTable("offerings", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  type: offeringsTypeEnum("type").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  durationText: text("duration_text"),
  registrationInfo: text("registration_info"),
  sortOrder: integer("sort_order").default(0).notNull(),
  isPublished: boolean("is_published").default(true).notNull(),
});
