"use client";

import { useState } from "react";
import Card from "./card";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import { easeInOut, motion } from "motion/react";
import Reveal from "./animations/reveal";

export const cardData = [
  {
    id: "111",
    imageSrc: "/images/Cover.jpg",
    heading: "گیتارالکتریک برای نوآموزان ۱",
    description:
      "دوره آفلاین بیش از ۶۰۰ دقیقه ویدیو و ۱۰۰ صفحه جزوه کتبی به همراه پشتیبانی آنلاین... دیگه خلاصه خیلی خوبه",
  },
  {
    id: "112",
    imageSrc: "/images/Cover.jpg",
    heading: "گیتارالکتریک برای نوآموزان ۲",
    description:
      "دوره آفلاین بیش از ۶۰۰ دقیقه ویدیو و ۱۰۰ صفحه جزوه کتبی به همراه پشتیبانی آنلاین... دیگه خلاصه خیلی خوبه",
  },
  {
    id: "113",
    imageSrc: "/images/Cover.jpg",
    heading: "گیتارالکتریک برای نوآموزان ۳",
    description:
      "دوره آفلاین بیش از ۶۰۰ دقیقه ویدیو و ۱۰۰ صفحه جزوه کتبی به همراه پشتیبانی آنلاین... دیگه خلاصه خیلی خوبه",
  },
  {
    id: "114",
    imageSrc: "/images/Cover.jpg",
    heading: "گیتارالکتریک برای نوآموزان ۴",
    description:
      "دوره آفلاین بیش از ۶۰۰ دقیقه ویدیو و ۱۰۰ صفحه جزوه کتبی به همراه پشتیبانی آنلاین... دیگه خلاصه خیلی خوبه",
  },
  {
    id: "115",
    imageSrc: "/images/Cover.jpg",
    heading: "گیتارالکتریک برای نوآموزان ۵",
    description:
      "دوره آفلاین بیش از ۶۰۰ دقیقه ویدیو و ۱۰۰ صفحه جزوه کتبی به همراه پشتیبانی آنلاین... دیگه خلاصه خیلی خوبه",
  },
];

type CardData = {
  id: string;
  imageSrc: string;
  heading: string;
  description: string;
};

type CarouselProps = {
  items: CardData[];
};

export default function Carousel({ items }: CarouselProps) {
  const [activeIndex, setActiveIndex] = useState(1);

  const goToNext = () => {
    if (items.length === 0) return;

    setActiveIndex(() => (activeIndex + 1) % items.length);
  };

  const goToPrevious = () => {
    if (items.length === 0) return;

    setActiveIndex(() => (activeIndex - 1 + items.length) % items.length);
  };

  const getOffset = (index: number) => {
    let offset = index - activeIndex;
    if (offset > items.length / 2) {
      offset -= items.length;
    } else if (offset < -items.length / 2) {
      offset += items.length;
    }
    return offset;
  };

  const handleDragEnd = (offsetX: number, velocityX: number) => {
    const passedDistanceThreshold = Math.abs(offsetX) > 120;
    const passedVelocityThreshold = Math.abs(velocityX) > 600;

    if (!passedDistanceThreshold && !passedVelocityThreshold) return;

    const direction = passedDistanceThreshold ? offsetX : velocityX;

    if (direction < 0) {
      goToNext();
    } else {
      goToPrevious();
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="h-86 md:h-160 relative">
      <div className="relative mt-12">
        {items.map((item, index) => {
          const offset = getOffset(index);
          const isActive = index === activeIndex;
          const distance = Math.abs(offset);

          return (
            <motion.div
              key={item.id}
              initial={false}
              animate={{
                x: `${offset * 60}%`,
                scale: isActive ? 1 : distance === 1 ? 0.75 : 0.55,
                opacity: isActive ? 1 : distance === 1 ? 0.8 : 0,
                filter: isActive ? "blur(0px)" : "blur(2px)",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                zIndex: items.length - distance,
                touchAction: "pan-y",
              }}
              className="absolute left-1/2 -translate-x-1/2"
              drag={isActive ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (!isActive) return;

                handleDragEnd(info.offset.x, info.velocity.x);
              }}
            >
              <Reveal delay={isActive ? 0 : Number(item.id.slice(-1)) * 0.1}>
                <Card
                  imageSrc={item.imageSrc}
                  heading={item.heading}
                  description={item.description}
                  isActive={isActive}
                />
              </Reveal>
            </motion.div>
          );
        })}
      </div>
      <div
        dir="ltr"
        className="absolute flex items-center gap-2 md:gap-4 bottom-0.5 left-1/2 -translate-x-1/2"
      >
        <button
          className=" h-8 md:h-10 w-8 md:w-10 border-2 border-mid rounded-full flex justify-center items-center group hover:bg-light4"
          onClick={goToPrevious}
        >
          <ArrowBigLeft className="text-light4 group-hover:text-background" />
        </button>
        <div className="flex gap-2 md:gap-4">
          {items.map((item, index) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={twMerge(
                clsx(
                  "h-3.5 md:h-4.5 rounded-full transition-all duration-300",
                  index === activeIndex
                    ? "w-6 md:w-9 bg-light4"
                    : "w-3.5 md:w-4.5 border-2 border-light4 hover:bg-light4",
                ),
              )}
            ></button>
          ))}
        </div>
        <button
          className="h-8 md:h-10 w-8 md:w-10 border-2 border-mid rounded-full flex justify-center items-center  group hover:bg-light4"
          onClick={goToNext}
        >
          <ArrowBigRight className="text-light4 group-hover:text-background" />
        </button>
      </div>
    </div>
  );
}
