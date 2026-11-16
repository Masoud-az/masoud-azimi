import Image from "next/image";
import type { offerings } from "@/lib/db/schema/offerings";
import ExpandableDescription from "./expandable-description";
import { FaInstagram, FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

type offering = typeof offerings.$inferSelect;

type OfferingDetailsProps = { offering: offering };

const formatPrice = (price: number) =>
  new Intl.NumberFormat("fa-IR").format(price);

export default function OfferingDetails({ offering }: OfferingDetailsProps) {
  const hasDiscount =
    offering.price !== null &&
    offering.discountPercent !== null &&
    offering.discountPercent > 0;

  const finalPrice = hasDiscount
    ? Math.round(offering.price! * (1 - offering.discountPercent! / 100))
    : offering.price;

  return (
    <div
      dir="rtl"
      className="relative mt-18 md:mt-24 xl:mt-36 bg-container-background xl:w-[90%] 2xl:w-[80%] max-w-[1800px] mx-auto py-8 px-4 xl:py-16 xl:px-16 rounded-3xl md:rounded-4xl shadow-2xl items-center"
    >
      <h1 className="flex justify-center text-center text-2xl sm:text-3xl md:text-4xl xl:text-5xl sm:mt-4 xl:mb-14 text-light5">
        {offering.title}
      </h1>
      <div className="relative mt-8 h-48 sm:h-96 md:h-112 lg:h-148 w-full">
        <Image
          src={offering.imageUrl}
          alt={offering.title}
          fill
          className="rounded-2xl object-cover"
        />
      </div>
      <div className="border sm:border-2 border-light5 rounded-2xl mt-8 p-2 md:p-6 md:mx-4">
        <h2 className="text-light5 text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-center mt-4 xl:mt-6 mb-2 xl:mb-8 sm:mb-3 md:mb-5">
          درباره این دوره
        </h2>
        <ExpandableDescription description={offering.description} />
      </div>
      {offering.youtubeVideoId && (
        <section className="mt-12">
          <h2 className="mb-5 xl:mb-8  text-center font-MyFont text-xl sm:text-3xl md:text-4xl xl:text-5xl text-light5">
            ویدیوی معرفی دوره
          </h2>

          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${offering.youtubeVideoId}`}
              title={`معرفی ${offering.title}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          </div>
        </section>
      )}
      {offering.registrationInfo && (
        <div className="border border-light5 rounded-2xl mt-12 p-2 md:p-6 md:mx-4 ">
          <h2 className="text-light5 text-2xl sm:text-3xl md:text-4xl xl:text-5xl text-center mt-4 mb-2 md:mb-4 xl:mb-8 xl:mt-6">
            اطلاعات ثبتنام
          </h2>
          <ExpandableDescription description={offering.registrationInfo} />
        </div>
      )}
      {offering.price && (
        <div className="mt-8 flex gap-4 items-center text-center justify-center">
          <span className="text-xl md:text-2xl xl:text-3xl text-light3">
            هزینه دوره:
          </span>
          <span
            className={`text-lg md:text-xl xl:text-2xl text-light3 ${offering.discountPercent ? "line-through" : ""}`}
          >
            {formatPrice(offering.price)} تومان
          </span>
        </div>
      )}
      {offering.discountPercent && (
        <div className="mt-1 flex gap-2 items-center text-center justify-center">
          <span className="text-lg text-light3 xl:text-xl">تخفیف:</span>
          <span className={`text-lg xl:text-xl text-light3 $`}>
            {formatPrice(offering.discountPercent)} درصد
          </span>
        </div>
      )}
      {finalPrice && (
        <div className="mt-2 flex gap-4 items-center text-center justify-center">
          <span className="text-2xl md:text-3xl xl:text-5xl text-light3">
            هزینه نهایی:
          </span>
          <span className={`text-lg md:text-2xl xl:text-4xl text-light3`}>
            {formatPrice(finalPrice)} تومان
          </span>
        </div>
      )}
      <div className="border border-light5 rounded-2xl mt-12 p-2 md:p-6 md:mx-4 md:flex md:items-center md:justify-center md:gap-6">
        <h2 className="text-2xl md:mt-2 md:text-3xl text-center text-light5 mt-4">
          راه های ارتباط با من:
        </h2>
        <div className="flex gap-4 md:gap-6 items-center justify-center my-4 ">
          <a
            href="https://t.me/Masoud_aziminia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="cursor-pointer"
          >
            <FaTelegram className="h-6 w-6 md:h-12 md:w-12 text-light5 m-2" />
          </a>
          <a
            href="mailto:masoud697@gmail.com"
            aria-label="Email"
            className="cursor-pointer"
          >
            <MdEmail className="h-6 w-6 md:h-12 md:w-12 text-light5 m-2" />
          </a>
          <a
            href="https://instagram.com/masoud.azimiii"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="cursor-pointer"
          >
            <FaInstagram className="h-6 w-6 md:h-12 md:w-12 text-light5 m-2" />
          </a>
        </div>
      </div>
    </div>
  );
}
