"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ToastDescription } from "@base-ui/react/toast";
import { toast } from "../ui/toast";

type ManageOfferingsProps = {
  onEdit: (offering: Offering) => void;
  refreshKey: number;
  onRefresh: () => void;
};

export type Offering = {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  durationText: string | null;
  registrationInfo: string | null;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export function ManageOfferings({
  refreshKey,
  onEdit,
  onRefresh,
}: ManageOfferingsProps) {
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchOfferings() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch("/api/offerings", {
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to fetch offerings");
        }

        console.log("API result:", result);
        console.log("Offerings:", result.offerings);

        setOfferings(result.offerings);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }

        setError(
          error instanceof Error ? error.message : "Something went wrong",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchOfferings();

    return () => controller.abort();
  }, [refreshKey]);

  async function handleVisibilityChange(offering: Offering) {
    const updatedVisibility = { isVisible: !offering.isVisible };

    const response = await fetch(`/api/offerings/${offering.id}/visibility`, {
      method: "PATCH",
      body: JSON.stringify(updatedVisibility),
    });

    if (!response.ok) {
      toast.add({
        type: "error",
        description: "تغییر وضعیت دوره شکست خورد",
      });
    }

    onRefresh();
  }

  if (isLoading) {
    return <p dir="rtl">در حال دریافت دوره‌ها...</p>;
  }

  if (error) {
    return <p dir="rtl">خطا در دریافت دوره‌ها: {error}</p>;
  }

  if (offerings.length === 0) {
    return <p dir="rtl">هنوز دوره‌ای ثبت نشده است.</p>;
  }

  return (
    <motion.div
      layout
      dir="rtl"
      className="bg-container-background xl:w-[90%] 2xl:w-[80%] max-w-[1800px] p-2 md:p-6 mt-6 mx-auto rounded-3xl md:rounded-4xl flex flex-col shadow-2xl"
    >
      <div
        dir="rtl"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
      >
        {offerings.map((offering) => (
          <article
            key={offering.id}
            className="bg-container-background2 rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={offering.imageUrl}
              alt={offering.title}
              className="w-full h-78 object-cover"
            />

            <div className="p-5 space-y-3">
              <h2 className="text-light5 text-2xl font-bold">
                {offering.title}
              </h2>

              <p className="text-light4 line-clamp-3">
                {offering.shortDescription}
              </p>

              <p className="text-light4 text-sm">
                {offering.durationText || "مدت زمان مشخص نشده"}
              </p>

              <p
                className={
                  offering.isVisible ? "text-green-500" : "text-yellow-500"
                }
              >
                {offering.isVisible ? "نمایش داده شده در سایت" : "مخفی از سایت"}
              </p>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => onEdit(offering)}
                  className=" bg-light4 text-container-background hover:text-light4  hover:bg-container-background transition-all duration-500 rounded-full text-xl px-4 py-2"
                >
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => handleVisibilityChange(offering)}
                  className="hover:bg-light4 py-2 px-6 md:px-12 rounded-full transition-all duration-500 hover:text-container-background text-lg md:text-xl shadow-2xs bg-container-background3 text-light4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {offering.isVisible ? "مخفی کردن دوره" : "نمایش در سایت"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </motion.div>
  );
}
