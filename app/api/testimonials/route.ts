import { db } from "@/lib/db";
import { testimonials } from "@/lib/db/schema/testimonials";
import { users } from "@/lib/db/schema/users";
import {
  createTestimonialSchema,
  deleteTestimonialSchema,
} from "@/lib/validations/testimonials";
import { auth } from "@clerk/nextjs/server";
import { and, desc, eq, or } from "drizzle-orm";
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

  const validation = createTestimonialSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      {
        error: "Invalid testimonial ID",
        issues: validation.error.issues,
      },
      { status: 400 },
    );
  }

  try {
    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const [testimonial] = await db
      .insert(testimonials)
      .values({
        userId: user.id,
        content: validation.data.content,
      })
      .returning({
        id: testimonials.id,
        content: testimonials.content,
        status: testimonials.status,
        createdAt: testimonials.createdAt,
      });

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimmonial creation failed" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        testimonial,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST api:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    let currentUser = null;

    if (userId) {
      const [user] = await db
        .select({
          id: users.id,
          role: users.role,
        })
        .from(users)
        .where(eq(users.clerkUserId, userId))
        .limit(1);
      currentUser = user ?? null;
    }

    const visibilityCondition = !currentUser
      ? eq(testimonials.status, "APPROVED")
      : currentUser.role === "ADMIN"
        ? undefined
        : or(
            eq(testimonials.status, "APPROVED"),
            and(
              eq(testimonials.userId, currentUser.id),
              eq(testimonials.status, "PENDING"),
            ),
          );

    const data = await db
      .select({
        id: testimonials.id,
        userId: testimonials.userId,
        content: testimonials.content,
        createdAt: testimonials.createdAt,
        firstName: users.firstname,
        lastName: users.lastname,
        status: testimonials.status,
        avatarUrl: users.avatarUrl,
      })
      .from(testimonials)
      .innerJoin(users, eq(testimonials.userId, users.id))
      .where(visibilityCondition)
      .orderBy(desc(testimonials.createdAt));

    return NextResponse.json(
      {
        testimonials: data,
        currentUser: currentUser
          ? { id: currentUser.id, role: currentUser.role }
          : null,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET api:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
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

    const [user] = await db
      .select({
        id: users.id,
        role: users.role,
      })
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        { status: 404 },
      );
    }

    const validation = deleteTestimonialSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid testimonial ID" },
        { status: 400 },
      );
    }

    const { testimonialId } = validation.data;

    const conditions =
      user.role === "ADMIN"
        ? eq(testimonials.id, testimonialId)
        : and(
            eq(testimonials.id, testimonialId),
            eq(testimonials.userId, user.id),
          );

    const [deletedTestimonial] = await db
      .delete(testimonials)
      .where(conditions)
      .returning({ id: testimonials.id });

    if (!deletedTestimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: "Testimonial deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE api:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
