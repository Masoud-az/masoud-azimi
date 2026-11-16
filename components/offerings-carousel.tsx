import { db } from "@/lib/db";
import { offerings } from "@/lib/db/schema/offerings";
import { asc, desc, eq } from "drizzle-orm";
import Carousel from "./carousel";

export default async function OfferingsCarousel() {
  const items = await db
    .select({
      id: offerings.id,
      imageSrc: offerings.imageUrl,
      heading: offerings.title,
      shortDescription: offerings.shortDescription,
    })
    .from(offerings)
    .where(eq(offerings.isVisible, true))
    .orderBy(asc(offerings.sortOrder), desc(offerings.createdAt));

  if (!items) {
    return null;
  }

  return (
    <div
      dir="rtl"
      id="offerings"
      className="overflow-hidden xl:w-[90%] 2xl:w-[80%] mx-auto bg-container-background3 rounded-3xl xl:rounded-4xl mt-4 xl:mt-6 p-8 xl:p-12 shadow-2xl"
    >
      <div>
        <h2 className="mt-4 font-MyAccentFont text-light3 text-xl sm:text-2xl md:text-3xl xl:text-5xl text-center">
          دوره‌ها و کلاس‌‌ها
        </h2>
        <p className="text-xs md:text-xl xl:text-2xl text-center text-light5 mt-1 xl:mt-3">
          روش‌هایی که توی مسیر موسیقی‌ میتونم کنارت باشم و کمکت کنم
        </p>
      </div>
      <div>
        <Carousel items={items} />
      </div>
    </div>
  );
}
