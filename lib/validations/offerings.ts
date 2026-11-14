import z from "zod";

function isValidYouTubeUrl(value: string): boolean {
  if (!value) return true;

  try {
    const url = new URL(value);

    if (!["https:", "http:"].includes(url.protocol)) {
      return false;
    }

    const hostname = url.hostname.toLowerCase();
    const videoIdPattern = /^[a-zA-Z0-9_-]{11}$/;

    if (hostname === "youtu.be") {
      const videoId = url.pathname.split("/").filter(Boolean)[0];
      return !!videoId && videoIdPattern.test(videoId);
    }

    if (
      !["youtube.com", "www.youtube.com", "m.youtube.com"].includes(hostname)
    ) {
      return false;
    }

    if (url.pathname === "/watch") {
      const videoId = url.searchParams.get("v");
      return !!videoId && videoIdPattern.test(videoId);
    }

    const pathParts = url.pathname.split("/").filter(Boolean);

    if (["shorts", "embed"].includes(pathParts[0]) && pathParts.length >= 2) {
      return videoIdPattern.test(pathParts[1]);
    }

    return false;
  } catch {
    return false;
  }
}

const priceSchema = z
  .string()
  .trim()
  .regex(/^\d*$/, "قیمت باید عدد صحیح باشد")
  .optional()
  .transform((value) =>
    value === "" || value === undefined || Number(value) === 0
      ? undefined
      : Number(value),
  )
  .pipe(z.number().int().min(0).max(2000000000).optional());

const discountPercentSchema = z
  .string()
  .trim()
  .regex(/^\d*$/, "تخفیف باید عدد صحیح باشد")
  .optional()
  .transform((value) => {
    if (value === "" || value === undefined || Number(value) === 0) {
      return undefined;
    }

    return Number(value);
  })
  .pipe(z.number().int().min(1).max(100).optional());

export const createOfferingSchema = z
  .object({
    title: z.string().trim().min(1).max(50),
    shortDescription: z.string().trim().min(1).max(100),
    description: z.string().trim().min(1).max(9000),
    durationText: z.string().trim().max(100).optional(),
    registrationInfo: z.string().trim().max(1000).optional(),

    youtubeVideoUrl: z
      .string()
      .trim()
      .max(2048)
      .refine(isValidYouTubeUrl, {
        message: "لینک واردشده معتبر نیست یا متعلق به YouTube نیست.",
      })
      .optional(),

    price: priceSchema,
    discountPercent: discountPercentSchema,
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.discountPercent !== undefined && data.price === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["discountPercent"],
        message: "برای تعیین تخفیف ابتدا باید قیمت را وارد کنید.",
      });
    }
  });

export type CreateOfferingInput = z.input<typeof createOfferingSchema>;
export type CreateOfferingSchema = z.output<typeof createOfferingSchema>;
