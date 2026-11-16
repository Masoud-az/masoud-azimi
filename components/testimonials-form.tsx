"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import { useAuthModal } from "./auth/auth-modal-context";
import { toast } from "./ui/toast";

type TestimonialsFormProps = {
  onSuccess: () => void;
};

export default function TestimonialsForm({ onSuccess }: TestimonialsFormProps) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isSignedIn } = useUser();
  const { openSignIn } = useAuthModal();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (!comment.trim()) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    if (!isSignedIn) {
      openSignIn();

      toast.add({
        type: "error",
        description: "برای ثبت دیدگاه ابتدا وارد شوید",
      });
      return;
    }

    submitTestimonial();
  };

  const submitTestimonial = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: comment,
        }),
      });

      if (!response.ok) {
        throw new Error("Testimonial submission failed");
      }

      setComment("");
      onSuccess();

      toast.add({
        type: "success",
        description:
          " دیدگاه شما با موفقیت ثبت شد و پس از تایید ادمین نمایش داده می‌شود",
      });
    } catch {
      toast.add({
        type: "error",
        description: "ثبت دیدگاه انجام نشد",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full xl:w-5/7 flex flex-col items-center p-2 md:p-4 xl:p-8 justify-between rounded-3xl md:h-70  xl:h-80 "
    >
      <textarea
        id="comment"
        name="comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className="w-full bg-mid shadow-2xs rounded-3xl h-48 mb-3 p-4 md:p-6 text-lg md:text-xl text-light5"
        maxLength={500}
        placeholder="اینجا بنویس..."
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-light5 cursor-pointer py-1 px-3 md:px-12 rounded-full transition-all duration-500 text-container-background text-lg md:text-2xl shadow-2xs hover:bg-container-background3 hover:text-light5"
      >
        {isSubmitting ? "در حال ارسال..." : "ثبت"}
      </button>
    </form>
  );
}
