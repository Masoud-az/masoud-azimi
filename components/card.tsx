import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

type CardProps = {
  offeringId: string;
  imageSrc: string;
  heading: string;
  description: string;
  isActive: boolean;
};

export default function Card({
  offeringId,
  imageSrc,
  heading,
  description,
  isActive,
}: CardProps) {
  const buttonClassName = twMerge(
    clsx(
      "mb-2 mt-2 md:mb-4 transition-all duration-300 bg-light5 text-[8px] md:text-2xl text-background p-1 md:p-4 rounded-2xl",
      isActive && " hover:bg-container-background hover:text-light3",
    ),
  );

  return (
    <div
      className={`relative overflow-hidden transition-[width] duration-700 text-center h-64 sm:h-78 md:h-122 xl:h-144 ${isActive ? "w-64 " : "w-48"} sm:w-84 md:w-xl xl:w-2xl rounded-4xl shadow-2xl border-2 md:border-4 border-mid`}
    >
      <Image src={imageSrc} alt="guitar course" fill className="object-cover" />
      <div className="absolute left-1/2 -translate-x-1/2 z-10 top-5/8 w-8/9 p-1 md:top-2/5 bg-black/60 rounded-4xl">
        <h2 className="font-MyFont text-[10px] md:text-3xl text-light3 mt-2 md:mt-6 text-center">
          {heading}
        </h2>
        <p className="hidden md:block font-MyFont md:text-xl text-light3 m-4  text-center leading-8 line-clamp-2">
          {description}
        </p>

        {isActive ? (
          <div className="flex items-center justify-center">
            <Link
              href={`/courses-and-classes/${offeringId}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClassName}
            >
              جزئیات بیشتر
            </Link>
          </div>
        ) : (
          <button type="button" disabled className={buttonClassName}>
            جزئیات بیشتر
          </button>
        )}
      </div>
    </div>
  );
}
