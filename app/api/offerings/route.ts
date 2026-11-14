import { getCloudinary } from "@/lib/cloudinary";
import { uploadOfferingImage } from "@/lib/cloudinary/upload-offering-image";
import { db } from "@/lib/db";
import { offerings } from "@/lib/db/schema/offerings";
import { users } from "@/lib/db/schema/users";
import { createOfferingSchema } from "@/lib/validations/offerings";
import { auth } from "@clerk/nextjs/server";
import { asc, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const runtime = "nodejs";

function extractYouTubeVideoId(value: string): string | null {
  if (!value) return null;

  const url = new URL(value);
  const hostname = url.hostname.toLowerCase();

  if (hostname === "youtu.be") {
    return url.pathname.split("/").filter(Boolean)[0] ?? null;
  }

  if (url.pathname === "/watch") {
    return url.searchParams.get("v");
  }

  const pathParts = url.pathname.split("/").filter(Boolean);

  if (["shorts", "embed"].includes(pathParts[0])) {
    return pathParts[1] ?? null;
  }

  return null;
}

export async function POST(request: Request) {
  let uploadedPublicId: string | null = null;

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

    let formData: FormData;

    try {
      formData = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const rawFields = {
      title: formData.get("title"),
      shortDescription: formData.get("shortDescription"),
      description: formData.get("description"),
      durationText: formData.get("durationText") || undefined,
      registrationInfo: formData.get("registrationInfo") || undefined,
      youtubeVideoUrl: formData.get("youtubeVideoUrl") || "",
      price: formData.get("price") || "",
      discountPercent: formData.get("discountPercent") || "",
    };

    const validation = createOfferingSchema.safeParse(rawFields);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid offering data", issues: validation.error.issues },
        { status: 400 },
      );
    }

    const image = formData.get("image");

    if (!(image instanceof File) || image.size === 0) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
      return NextResponse.json(
        { error: "Unsupported image format" },
        { status: 400 },
      );
    }

    if (image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image size must not exceed 5MB" },
        { status: 400 },
      );
    }

    const uploadedImage = await uploadOfferingImage(image);

    uploadedPublicId = uploadedImage.public_id;

    const youtubeVideoId = extractYouTubeVideoId(
      validation.data.youtubeVideoUrl ?? "",
    );

    const [offering] = await db
      .insert(offerings)
      .values({
        title: validation.data.title,
        shortDescription: validation.data.shortDescription,
        description: validation.data.description,
        durationText: validation.data.durationText || null,
        registrationInfo: validation.data.registrationInfo || null,
        youtubeVideoId,
        price: validation.data.price ?? null,
        discountPercent: validation.data.discountPercent ?? null,
        imagePublicId: uploadedImage.public_id,
        imageUrl: uploadedImage.secure_url,
      })
      .returning({
        id: offerings.id,
        title: offerings.title,
        imageUrl: offerings.imageUrl,
        createdAt: offerings.createdAt,
        youtubeVideoId: offerings.youtubeVideoId,
        price: offerings.price,
        discountPercent: offerings.discountPercent,
      });

    if (!offering) {
      throw new Error("Offering creation failed");
    }

    return NextResponse.json({ success: true, offering }, { status: 201 });
  } catch (error) {
    console.error("POST /api/offerings :", error);

    if (uploadedPublicId) {
      try {
        const cloudinary = getCloudinary();
        await cloudinary.uploader.destroy(uploadedPublicId);
      } catch (cleanupError) {
        console.error("Cloudinary cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [user] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.clerkUserId, userId))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const allOfferings = await db
      .select({
        id: offerings.id,
        title: offerings.title,
        shortDescription: offerings.shortDescription,
        description: offerings.description,
        imageUrl: offerings.imageUrl,
        durationText: offerings.durationText,
        registrationInfo: offerings.registrationInfo,
        youtubeVideoId: offerings.youtubeVideoId,
        price: offerings.price,
        discountPercent: offerings.discountPercent,
        isVisible: offerings.isVisible,
        sortOrder: offerings.sortOrder,
        createdAt: offerings.createdAt,
        updatedAt: offerings.updatedAt,
      })
      .from(offerings)
      .orderBy(asc(offerings.sortOrder), desc(offerings.createdAt));

    return NextResponse.json(
      { success: true, offerings: allOfferings },
      { status: 200 },
    );
  } catch (error) {
    console.error("GET api/offerings:", error);

    return NextResponse.json(
      {
        error: "Internal server Error",
      },
      { status: 500 },
    );
  }
}
