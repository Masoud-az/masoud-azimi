import { defineRelations } from "drizzle-orm";
import * as schema from "./schema/schema";

export const relations = defineRelations(schema, (r) => ({
  users: {
    registrations: r.many.registrationRequests(),
    testimonials: r.many.testimonials(),
  },
  testimonials: {
    user: r.one.users({
      from: r.testimonials.userId,
      to: r.users.id,
    }),
  },
  registrationRequests: {
    user: r.one.users({
      from: r.registrationRequests.userId,
      to: r.users.id,
    }),
    offering: r.one.offerings({
      from: r.registrationRequests.offeringId,
      to: r.offerings.id,
    }),
  },
  offerings: {
    registrations: r.many.registrationRequests(),
  },
}));
