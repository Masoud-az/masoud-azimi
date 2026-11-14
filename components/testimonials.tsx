"use client";

import { useEffect, useState } from "react";
import TestimonialsCard from "./testimonials-card";
import TestimonialsForm from "./testimonials-form";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, easeOut, motion } from "motion/react";
import Reveal from "./animations/reveal";
import { useUser } from "@clerk/nextjs";

type Testimonial = {
  id: string;
  userId: string;
  content: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
};

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

type CurrentUser = {
  id: string;
  role: "USER" | "ADMIN";
};
export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { isLoaded, isSignedIn } = useUser();
  const startIndex = (currentPage - 1) * 4;
  const visibleComments = testimonials.slice(startIndex, startIndex + 4);
  const totalPages = Array.from({ length: Math.ceil(testimonials.length / 4) });

  useEffect(() => {
    if (currentPage > totalPages.length && totalPages.length > 0) {
      setCurrentPage(totalPages.length);
    }
  }, [currentPage, totalPages.length]);

  useEffect(() => {
    if (!isLoaded) return;

    const controller = new AbortController();

    async function fetchTestimonials() {
      setIsLoading(true);
      setError(false);

      try {
        const response = await fetch("/api/testimonials", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch testimonials");
        }

        const data: {
          testimonials: Testimonial[];
          currentUser: CurrentUser | null;
        } = await response.json();

        setTestimonials(data.testimonials);
        setCurrentUser(data.currentUser);
        setCurrentPage(1);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Fetch tstimonials:", error);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchTestimonials();
    return () => controller.abort();
  }, [isLoaded, isSignedIn, refreshKey]);

  return (
    <div className="md:col-span-2">
      <motion.div
        layout
        dir="rtl"
        className="bg-container-background xl:w-[90%] 2xl:w-[80%] max-w-[1800px] p-2 md:p-6 mt-6 mx-auto rounded-3xl md:rounded-4xl flex flex-col shadow-2xl"
      >
        <h2 className="text-2xl md:text-4xl xl:text-6xl font-MyAccentFont text-light2 mt-14 md:mt-8 text-center">
          از تجربه‌ات با من بگو
        </h2>
        <div className="mt-8 md:mt-1 flex flex-col items-center">
          <TestimonialsForm
            onSuccess={() => setRefreshKey((prev) => prev + 1)}
          />
        </div>
      </motion.div>
      <Reveal delay={0.2}>
        <motion.div
          layout
          dir="rtl"
          className="bg-container-background3 xl:w-[90%] 2xl:w-[80%] max-w-[1800px] p-2 md:p-4 xl:p-6 mt-6 mx-auto rounded-3xl md:rounded-4xl flex flex-col shadow-2xl"
        >
          {isLoading ? (
            <p className="text-light4 text-2xl text-center py-12">
              در حال دریافت دیدگاه‌ها...
            </p>
          ) : error ? (
            <p className="text-light4 text-2xl text-center py-12">
              دریافت دیدگاه‌ها با مشکل مواجه شد. لطفاً دوباره تلاش کنید.
            </p>
          ) : testimonials.length === 0 ? (
            <p className="text-light4 text-2xl text-center py-12">
              هنوز دیدگاهی ثبت نشده است. اولین نفری باش که تجربه‌ات را به اشتراک
              می‌گذاری!
            </p>
          ) : (
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 sm:gap-4 md:gap-6 xl:mt-8"
                >
                  {visibleComments.map((comment) => {
                    return (
                      <motion.div key={comment.id} variants={cardVariants}>
                        <TestimonialsCard
                          avatarUrl={comment.avatarUrl}
                          name={`${comment.firstName} ${comment.lastName}`}
                          comment={comment.content}
                          status={comment.status}
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
            </div>
          )}
        </motion.div>
      </Reveal>
    </div>
  );
}
