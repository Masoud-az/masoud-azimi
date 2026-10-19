"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

type SiteHeaderProps = {
  username: string;
};

export default function SiteHeader({ username }: SiteHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      dir="rtl"
      className="fixed top-0 inset-x-0 mx-auto pt-4 md:pt-10 px-2 w-full md:w-5/7 z-50"
    >
      <nav
        className={` relative overflow-hidden flex h-13 md:h-20 items-center px-6 py-3 rounded-3xl md:rounded-4xl shadow-xl bg-container-background2 transition-all duration-900 ease-in-out md:justify-between ${isScrolled ? "w-14 md:w-21 -translate-x-4" : "w-full"}`}
      >
        <div className="absolute md:static left-6 md:flex md:items-center md:gap-4">
          <div
            className={`flex mr-12 md:mr-16 items-center transition-opacity duration-300 gap-4 ${isScrolled ? "opacity-0" : ""}`}
          >
            <button className="text-sm md:text-lg text-background bg-light4 p-1 md:p-2 rounded-full">
              عضویت
            </button>
            <button className="text-sm md:text-xl text-light4">ورود</button>
          </div>
        </div>
        <div
          className={`hidden relative md:flex md:items-center transition-opacity duration-900  gap-4 ${isScrolled ? "opacity-0" : ""}`}
        >
          <span className="text-light3 text-lg absolute left-12 w-40">
            خوش برگشتی {username}
          </span>
          <Image
            width={50}
            height={50}
            src="/images/avatar-icon.svg"
            alt="user avatar"
            className="rounded-full border ring-2 ring-light4"
          />
        </div>
        <Menu className="absolute right-3 md:right-5 text-accent h-8 md:h-10 w-8 md:w-10" />
      </nav>
    </header>
  );
}
