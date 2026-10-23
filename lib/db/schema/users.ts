import { sql } from "drizzle-orm";
import {
  check,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN"]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").unique().notNull(),
    username: text("username").unique().notNull(),
    name: text("name").notNull(),
    avatarUrl: text("avatar_url"),
    role: userRoleEnum("role").default("USER").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    email: text("email").unique().notNull(),
  },
  (table) => [
    check(
      "users_username_format_check",
      sql`${table.username} ~ '^[a-zA-Z][a-zA-Z0-9_]*$'`,
    ),
  ],
);
