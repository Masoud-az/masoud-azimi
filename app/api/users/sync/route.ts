import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { syncUserSchema } from "@/lib/validations/user";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const validation = syncUserSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const primaryEmail = clerkUser.emailAddresses.find(
      (email) => email.id === clerkUser.primaryEmailAddressId,
    )?.emailAddress;

    const username = clerkUser.username;

    if (!primaryEmail || !username) {
      return NextResponse.json(
        {
          error: "Required clerk account information is missing",
        },
        { status: 422 },
      );
    }

    const [user] = await db
      .insert(users)
      .values({
        clerkUserId: clerkUser.id,
        email: primaryEmail,
        username: username,
        firstname: validation.data.firstName,
        lastname: validation.data.lastName,
        phoneNumber: validation.data.phoneNumber,
        avatarUrl: clerkUser.hasImage ? clerkUser.imageUrl : null,
      })
      .onConflictDoUpdate({
        target: users.clerkUserId,
        set: {
          username: username,
          firstname: validation.data.firstName,
          lastname: validation.data.lastName,
          phoneNumber: validation.data.phoneNumber,
          email: primaryEmail,
          avatarUrl: clerkUser.imageUrl,
          updatedAt: new Date(),
        },
      })
      .returning({ id: users.id });

    if (!user) {
      return NextResponse.json({ error: "User sync failed" }, { status: 500 });
    }

    return NextResponse.json(
      {
        message: "User synced successfully",
        userId: user.id,
      },
      { status: 200 },
    );
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      return NextResponse.json(
        {
          error: "Email or username is already is use",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
