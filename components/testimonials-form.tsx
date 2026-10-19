"use client";

import React, { useState } from "react";

export default function TestimonialsForm() {
  const [comment, setComment] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    const submitedComment = comment;
    setComment("");
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-5/7 flex flex-col items-center p-2 md:p-8 justify-between rounded-3xl  md:h-80 "
    >
      <textarea
        id="comment"
        name="comment"
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        className="w-full bg-mid shadow-2xs rounded-3xl h-48 mb-6 p-4 md:p-6 text-sm md:text-xl text-light4"
        maxLength={500}
        placeholder="اینجا بنویس..."
      />

      <button
        type="submit"
        className="bg-light4 py-2 px-6 md:px-12 rounded-full text-container-background text-lg md:text-2xl shadow-2xs hover:bg-container-background hover:text-light4"
      >
        ثبت
      </button>
    </form>
  );
}
