import { defineRelations } from "drizzle-orm";
import * as schema from "./schema/schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    testimonials: r.many.testimonials(),
  },
  testimonials: {
    user: r.one.users({
      from: r.testimonials.userId,
      to: r.users.id,
    }),
  },
}));
