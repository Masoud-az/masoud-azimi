import { getCloudinary } from "@/lib/cloudinary";
import { uploadOfferingImage } from "@/lib/cloudinary/upload-offering-image";
import { db } from "@/lib/db";
import { offerings } from "@/lib/db/schema/offerings";
import { users } from "@/lib/db/schema/users";
import { createOfferingSchema } from "@/lib/validations/offerings";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import z from "zod";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteContext) {
  let uploadedPublicId: string | null = null;
  let databaseUpdated = false;

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

    const { id } = await params;
    const idValidation = z.uuid().safeParse(id);

    if (!idValidation.success) {
      return NextResponse.json(
        { error: "Invalid offering ID" },
        { status: 400 },
      );
    }

    const [existingOffering] = await db
      .select({
        id: offerings.id,
        imagePublicId: offerings.imagePublicId,
      })
      .from(offerings)
      .where(eq(offerings.id, id))
      .limit(1);

    if (!existingOffering) {
      return NextResponse.json(
        { error: "Offering not found" },
        { status: 404 },
      );
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
    };

    const validation = createOfferingSchema.safeParse(rawFields);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid offering data", issues: validation.error.issues },
        { status: 400 },
      );
    }

    const imageEntry = formData.get("image");

    if (imageEntry !== null && !(imageEntry instanceof File)) {
      return NextResponse.json(
        { error: "Invalid image file" },
        { status: 400 },
      );
    }

    const image = imageEntry instanceof File ? imageEntry : null;

    if (image && image.size === 0) {
      return NextResponse.json({ error: "Empty image file" }, { status: 400 });
    }

    if (image && !ALLOWED_IMAGE_TYPES.includes(image.type)) {
      return NextResponse.json(
        { error: "Unsupported image format" },
        { status: 400 },
      );
    }

    if (image && image.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image size must not exceed 5MB" },
        { status: 400 },
      );
    }

    let uploadedImage = null;

    if (image) {
      uploadedImage = await uploadOfferingImage(image);
      uploadedPublicId = uploadedImage.public_id;
    }

    const [updatedOffering] = await db
      .update(offerings)
      .set({
        title: validation.data.title,
        shortDescription: validation.data.shortDescription,
        description: validation.data.description,
        durationText: validation.data.durationText || null,
        registrationInfo: validation.data.registrationInfo || null,
        updatedAt: new Date(),
        ...(uploadedImage
          ? {
              imageUrl: uploadedImage.secure_url,
              imagePublicId: uploadedImage.public_id,
            }
          : {}),
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
      });

    if (!updatedOffering) {
      throw new Error("Offering update failed");
    }

    databaseUpdated = true;

    if (uploadedImage) {
      try {
        const cloudinary = getCloudinary();

        await cloudinary.uploader.destroy(existingOffering.imagePublicId);
      } catch (cleanupError) {
        console.error("Old Cloudinary image cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      { success: true, offering: updatedOffering },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH /api/offerings/[id]:", error);

    if (uploadedPublicId && !databaseUpdated) {
      try {
        const cloudinary = getCloudinary();

        await cloudinary.uploader.destroy(uploadedPublicId);
      } catch (cleanupError) {
        console.error("New Cloudinary image cleanup failed:", cleanupError);
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
