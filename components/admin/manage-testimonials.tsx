"use client";

import { useEffect, useState } from "react";
import TestimonialsCard from "../testimonials-card";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, easeOut, motion } from "motion/react";
import Reveal from "../animations/reveal";
import { useUser } from "@clerk/nextjs";
import { toast } from "../ui/toast";
import { Check, Trash2, X } from "lucide-react";

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

export default function ManageTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { isLoaded } = useUser();

  const startIndex = (currentPage - 1) * 4;
  const visibleComments = testimonials.slice(startIndex, startIndex + 4);
  const totalPages = Array.from({
    length: Math.ceil(testimonials.length / 4),
  });

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
        } = await response.json();

        setTestimonials(data.testimonials);
        setCurrentPage(1);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Fetch testimonials:", error);
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
  }, [isLoaded, refreshKey]);

  const handleDelete = async (testimonialId: string) => {
    const confirmed = window.confirm("از حذف این دیدگاه اطمینان دارید؟");

    if (!confirmed || deletingId || updatingId) return;

    setDeletingId(testimonialId);

    try {
      const response = await fetch("/api/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId }),
      });

      if (!response.ok) {
        throw new Error("Testimonial deletion failed");
      }

      setTestimonials((prev) =>
        prev.filter((item) => item.id !== testimonialId),
      );
    } catch (error) {
      console.error("Delete testimonial:", error);

      toast.add({
        type: "error",
        description: "حذف دیدگاه با مشکل مواجه شد!",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusUpdate = async (
    testimonialId: string,
    status: "APPROVED" | "REJECTED",
  ) => {
    if (updatingId || deletingId) return;

    setUpdatingId(testimonialId);

    try {
      const response = await fetch("/api/testimonials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ testimonialId, status }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Testimonial status update failed");
      }

      setTestimonials((prev) =>
        prev.map((item) =>
          item.id === testimonialId
            ? { ...item, status: data.testimonial.status }
            : item,
        ),
      );

      toast.add({
        type: "success",
        description:
          status === "APPROVED"
            ? "دیدگاه با موفقیت تأیید شد"
            : "دیدگاه با موفقیت رد شد",
      });
    } catch (error) {
      console.error("Update testimonial status:", error);

      toast.add({
        type: "error",
        description: "تغییر وضعیت دیدگاه با مشکل مواجه شد",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="md:col-span-2">
      <motion.div
        layout
        dir="rtl"
        className="bg-container-background xl:w-[90%] 2xl:w-[80%] max-w-[1800px] p-2 md:p-6 mt-6 mx-auto rounded-3xl md:rounded-4xl flex flex-col shadow-2xl"
      >
        <h2 className="text-2xl md:text-4xl xl:text-6xl font-MyAccentFont text-light2 mt-14 md:mt-8 mb-8 text-center">
          مدیریت دیدگاه‌ها
        </h2>
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
              هنوز دیدگاهی ثبت نشده است.
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
                    const isBusy =
                      comment.id === deletingId || comment.id === updatingId;

                    return (
                      <motion.div
                        key={comment.id}
                        variants={cardVariants}
                        className="flex flex-col gap-2"
                      >
                        <div className="flex flex-wrap items-center justify-end gap-2 px-2">
                          {comment.status !== "APPROVED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(comment.id, "APPROVED")
                              }
                              disabled={isBusy || !!deletingId || !!updatingId}
                              aria-label="تأیید دیدگاه"
                              title="تأیید دیدگاه"
                              className="flex items-center gap-1 py-1 px-4 rounded-full border-2 border-green-400 text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Check size={20} />
                              <span className="text-xs md:text-sm">تأیید</span>
                            </button>
                          )}

                          {comment.status !== "REJECTED" && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusUpdate(comment.id, "REJECTED")
                              }
                              disabled={isBusy || !!deletingId || !!updatingId}
                              aria-label="رد دیدگاه"
                              title="رد دیدگاه"
                              className="flex items-center gap-1 py-1 px-4 rounded-full border-2 border-red-400 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <X size={20} />
                              <span className="text-xs md:text-sm">رد</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(comment.id)}
                            disabled={isBusy || !!deletingId || !!updatingId}
                            aria-label="حذف دیدگاه"
                            title="حذف دیدگاه"
                            className="py-2 px-3 rounded-full text-light5 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Trash2 size={20} />
                          </button>

                          {isBusy && (
                            <span className="text-xs text-light5">
                              در حال پردازش...
                            </span>
                          )}
                        </div>

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
