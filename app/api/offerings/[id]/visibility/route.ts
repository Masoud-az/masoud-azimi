import { db } from "@/lib/db";
import { offerings } from "@/lib/db/schema/offerings";
import { users } from "@/lib/db/schema/users";
import { offeringVisibilitySchema } from "@/lib/validations/offering-visibility";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: users.id,
        role: users.role,
      })
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const idValidation = z.uuid().safeParse(id);

    console.log("id:", id);

    if (!idValidation.success) {
      throw new Error("Invalid offering ID");
    }

    let body: unknown = await request.json();

    const validation = offeringVisibilitySchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    const [updatedOffering] = await db
      .update(offerings)
      .set({
        isVisible: validation.data.isVisible,
      })
      .where(eq(offerings.id, id))
      .returning({
        id: offerings.id,
        title: offerings.title,
        shortDescription: offerings.shortDescription,
        description: offerings.description,
        imageUrl: offerings.imageUrl,
        durationText: offerings.durationText,
        registrationInfo: offerings.registrationInfo,
        updatedAt: offerings.updatedAt,
        isVisible: offerings.isVisible,
      });

    if (!updatedOffering) {
      throw new Error("Offering visibility update failed");
    }

    return NextResponse.json(
      { success: true, updatedOffering },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/offerings/[id]/visibility:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
