"use client";

import { useState } from "react";
import TestimonialsCard from "./testimonials-card";
import TestimonialsForm from "./testimonials-form";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, easeOut, motion } from "motion/react";
import Reveal from "./animations/reveal";

const comments = [
  {
    id: "1",
    username: "الهه برزگر",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوده و هردفه که باهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده..",
  },
  {
    id: "2",
    username: "الهه برزگر",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم هاکلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده..",
  },
  {
    id: "3",
    username: "ممد برزگر",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوده و هردفه که بشیسشسیزسیزسیزسیزاهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده..",
  },
  {
    id: "4",
    username: "سمیرا برزگر",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشونسیزشسزیس بوده و هردفه که باهاشون کلاس داشتم بعدش امید بسیزسیزسیزیشسز یبلسیبلیبلشبل ه زندگیم ۱۰ برابر میشده..",
  },
  {
    id: "5",
    username: "کیانا نیازمندی",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوباهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده..",
  },
  {
    id: "6",
    username: "المیرا کاهانی",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با سشیزشسیزشسیزایشون بوده و هردفه که باهاشون کلاسسیزشسیزشسیز داشتم بعدش امید به زندگیسیزشسیزشسیزم ۱۰ برابر میششسیزشسیزشسیزده..",
  },
  {
    id: "7",
    username: "الهه برزگر",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوده و هردفه که باهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده..",
  },
  {
    id: "8",
    username: "الهه برزگر",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوده و هردفه که باهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده..",
  },
  {
    id: "9",
    username: "الهه برزگر",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوشسزشسیزسیزشسیزده و هردفه که باهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده..",
  },
  {
    id: "10",
    username: "الهه برزگر",
    avatarUrl: "/images/avatar-icon.png",
    comment:
      "قای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوده و هردفه که باهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده..",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { ease: easeOut } },
  exit: { opacity: 0, y: -24, transition: { ease: easeOut } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
  exit: { transition: { staggerChildren: 0.1 } },
};

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(1);
  const startIndex = (currentPage - 1) * 4;
  const visibleComments = comments.slice(startIndex, startIndex + 4);
  const totalPages = Array.from({ length: Math.ceil(comments.length / 4) });

  return (
    <div className="md:col-span-2">
      <motion.div
        layout
        dir="rtl"
        className="bg-container-background3 md:max-w-5/7 p-2 md:p-6 mt-6 mx-auto rounded-3xl md:rounded-4xl flex flex-col shadow-2xl"
      >
        <h2 className="text-2xl md:text-6xl font-MyAccentFont text-light2 mt-14 text-center">
          از تجربه‌ات با من بگو
        </h2>
        <div className="mt-8 flex flex-col items-center">
          <TestimonialsForm />
        </div>
      </motion.div>
      <Reveal delay={0.2}>
        <motion.div
          layout
          dir="rtl"
          className="bg-container-background3 md:max-w-5/7 p-2 md:p-6 mt-6 mx-auto rounded-3xl md:rounded-4xl flex flex-col shadow-2xl"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 mt-8"
            >
              {visibleComments.map((comment) => {
                return (
                  <motion.div key={comment.id} variants={cardVariants}>
                    <TestimonialsCard
                      avatarUrl={comment.avatarUrl}
                      username={comment.username}
                      comment={comment.comment}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
          <div className="flex items-center justify-center gap-2 md:gap-6 mt-2 md:mt-6">
            {totalPages.map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={twMerge(
                    clsx(
                      "h-4 w-4 mt-2 rounded-full bg-background border-2 border-light4 hover:bg-light4",
                      page === currentPage ? "w-8 bg-light4" : "",
                    ),
                  )}
                />
              );
            })}
          </div>
        </motion.div>
      </Reveal>
    </div>
  );
}
