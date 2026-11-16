import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { UserRoleContextProvider } from "./user-role-context";

export default async function UserRoleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  let role: "USER" | "ADMIN" | null = null;

  if (userId) {
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    role = user?.role ?? null;
  }

  return (
    <UserRoleContextProvider role={role}>{children}</UserRoleContextProvider>
  );
}
