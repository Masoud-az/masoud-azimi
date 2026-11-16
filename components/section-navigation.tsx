"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function SectionNavigation() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const section = searchParams.get("section");

    if (!section) return;

    const element = document.getElementById(section);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      window.history.replaceState(null, "", "/");
    }
  }, [searchParams]);

  return null;
}
