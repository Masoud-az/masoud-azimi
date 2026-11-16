"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type ExpandableDescriptionProps = {
  description: string;
};

export default function ExpandableDescription({
  description,
}: ExpandableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  return (
    <div>
      <motion.div
        initial={false}
        animate={{
          height: isExpanded
            ? (contentRef.current?.scrollHeight ?? "auto")
            : "8rem",
        }}
        transition={{
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative overflow-hidden md:h-auto"
      >
        <p
          ref={contentRef}
          className="text-light5 text-sm sm:text-lg md:text-xl xl:text-2xl leading-8 md:leading-9 whitespace-pre-line"
        >
          {description}
        </p>

        <AnimatePresence>
          {!isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute bottom-0 inset-x-0 h-12 bg-linear-to-t from-container-background to-transparent"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <button
        onClick={() => setIsExpanded((prev) => !prev)}
        className="mt-3 mr-2 text-light3 hover:text-light5 transition-colors cursor-pointer text-sm md:text-lg"
      >
        {isExpanded ? "نمایش کمتر" : "ادامه مطلب"}
      </button>
    </div>
  );
}
