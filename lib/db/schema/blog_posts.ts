import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const blogPosts = pgTable("blog_posts", {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  youtubeVideoId: text("youtube_video_id").unique().notNull(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  youtubePublishedAt: timestamp("youtube_published_at", { withTimezone: true }),
  isPinned: boolean("is_pinned").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});
