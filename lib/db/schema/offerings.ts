import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const offerings = pgTable("offerings", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  imagePublicId: text("image_public_id").notNull(),
  youtubeVideoId: text("youtube_video_id"),
  price: integer("price"),
  discountPercent: integer("discount_percent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  durationText: text("duration_text"),
  registrationInfo: text("registration_info"),
  isVisible: boolean("is_visible").notNull().default(true),
  sortOrder: integer("sort_order").default(0).notNull(),
});
