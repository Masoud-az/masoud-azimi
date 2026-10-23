"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { useUser, Show } from "@clerk/nextjs";

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user } = useUser();

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
      className="fixed top-0 inset-x-0  mx-auto pt-4 md:pt-10 px-2 w-full md:w-5/7 z-50"
    >
      <nav
        className={`border border-light5/40 relative overflow-hidden flex h-13 md:h-20 items-center px-6 py-3 rounded-3xl md:rounded-4xl shadow-xl bg-container-background2 transition-all duration-900 ease-in-out md:justify-between ${isScrolled ? "w-14.5 md:w-21 -translate-x-4" : "w-full"}`}
      >
        <div className="absolute md:static left-6 md:flex md:items-center md:gap-4">
          <div
            className={`flex mr-12 md:mr-16 items-center transition-opacity duration-300 gap-4 ${isScrolled ? "opacity-0" : ""}`}
          >
            <Show when="signed-out">
              <SignUpButton mode="modal">
                <button className="text-sm md:text-lg transition-colors duration-500 text-mid hover:text-light4 bg-light4 hover:bg-mid cursor-pointer p-1 md:p-2 rounded-full">
                  عضویت
                </button>
              </SignUpButton>
              <SignInButton mode="modal">
                <button className="text-sm md:text-xl transition-colors duration-500 text-light4 hover:text-mid hover:bg-light4 p-1 md:p-2 rounded-full cursor-pointer">
                  ورود
                </button>
              </SignInButton>
            </Show>
          </div>
        </div>
        <div
          className={`hidden relative md:flex md:items-center transition-opacity duration-900  gap-4 ${isScrolled ? "opacity-0" : ""}`}
        >
          <Show when="signed-out">
            <span className="text-light3 text-2xl absolute left-0 w-60">
              Masoud-Azimi.com
            </span>
          </Show>
          <Show when="signed-in">
            <span className="text-light3 text-lg absolute left-12 w-40">
              خوش برگشتی {user?.firstName || user?.username || "کاربر"}
            </span>
            <Image
              width={50}
              height={50}
              src={user?.imageUrl || "/images/avatar-icon.svg"}
              alt="user avatar"
              className="rounded-full border ring-2 ring-light4"
            />
          </Show>
        </div>
        <Menu className=" absolute transition-all duration-700 hover:rotate-90 right-3 md:right-5 text-accent h-8 md:h-10 w-8 md:w-10" />
      </nav>
    </header>
  );
}
