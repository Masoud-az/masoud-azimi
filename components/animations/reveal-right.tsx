"use client";

import { easeOut, motion } from "motion/react";

export default function RevealRight({
  delay = 0,
  children,
  className,
  duration,
}: {
  children: React.ReactNode;
  className?: string;
  duration: number;
  delay?: number;
}) {
  const revealRightVariants = {
    hidden: { opacity: 0, x: -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        delay: delay,
        duration: duration,
        ease: easeOut,
      },
    },
  };
  return (
    <motion.div variants={revealRightVariants} className={className}>
      {children}
    </motion.div>
  );
}
