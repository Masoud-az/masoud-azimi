import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [userInPersian] = await db
    .select({
      firstName: users.firstname,
      lastName: users.lastname,
    })
    .from(users)
    .where(eq(users.clerkUserId, userId))
    .limit(1);

  if (!userInPersian) {
    return NextResponse.json({ error: "could not find user" }, { status: 404 });
  }

  return NextResponse.json(userInPersian);
}
