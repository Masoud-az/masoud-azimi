"use client";

import { User } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useUser, Show } from "@clerk/nextjs";
import SignUpModal from "./auth/sign-up-modal";
import SignInModal from "./auth/sign-in-modal";
import { DropdownMenuIcons } from "./drop-down-menu-icons";
import { toast } from "./ui/toast";
import { useAuthModal } from "./auth/auth-modal-context";

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  // const [isOpen, setIsOpen] = useState(false);
  // const [signInModalOpen, setSignInModalOpen] = useState(false);
  // const openSignUp = () => setIsOpen(true);
  // const onClose = () => setIsOpen(false);
  // const onSignInClose = () => setSignInModalOpen(false);
  const { user } = useUser();
  const [profile, setProfile] = useState<{
    firstName: string;
    lastName: string;
  } | null>(null);

  const {
    signInModalOpen,
    signUpModalOpen,
    openSignIn,
    openSignUp,
    closeSignIn,
    closeSignUp,
  } = useAuthModal();

  const fetchUserInPersian = async () => {
    try {
      const response = await fetch("api/users/me", {
        method: "GET",
        headers: { "content-type": "application/json" },
      });

      if (!response.ok && user) {
        toast.add({
          type: "error",
          description: "مشخصات کاربر در دسترس نیست",
        });
        setProfile(null);
        return;
      }

      const data = await response.json();
      setProfile(data);
    } catch {
      toast.add({
        type: "error",
        description: "اختلال در سرور",
      });
      setProfile(null);
    }
  };

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

  useEffect(() => {
    fetchUserInPersian();
  }, [user]);

  return (
    <header
      dir="rtl"
      className="fixed top-0 inset-x-0  mx-auto pt-4 md:pt-6 xl:pt-10 px-2 w-full xl:w-[90%] 2xl:w-[80%] max-w-[1800px] z-50"
    >
      <SignUpModal />
      <SignInModal />
      <nav
        className={`border border-light5/40 relative overflow-hidden flex h-13 md:h-14 lg:h-16  xl:h-20 items-center px-2 md:px-6 py-3 rounded-3xl xl:rounded-4xl shadow-xl bg-container-background2 transition-all duration-900 ease-in-out justify-between ${isScrolled ? "w-14.5 md:w-18 xl:w-21 -translate-x-4" : "w-full"}`}
      >
        <div className="left-0 md:left-4 lg:left-6 md:flex md:items-center md:gap-4">
          <div
            className={`flex mr-12 lg:mr-16 items-center transition-opacity duration-300 gap-4 ${isScrolled ? "opacity-0" : ""}`}
          >
            <Show when="signed-out">
              <button
                onClick={openSignUp}
                className="text-sm md:text-lg transition-colors duration-500 text-mid hover:text-light5 bg-light5 hover:bg-mid cursor-pointer p-1 lg:p-2 rounded-full"
              >
                عضویت
              </button>
              <button
                onClick={openSignIn}
                className="text-sm md:text-xl transition-colors duration-500 text-light5 hover:text-mid hover:bg-light5 p-1 md:p-2 rounded-full cursor-pointer"
              >
                ورود
              </button>
            </Show>
          </div>
        </div>
        <div
          className={`relative flex items-center justify-start transition-opacity duration-900  gap-4 ${isScrolled ? "opacity-0" : ""}`}
        >
          <Show when="signed-out">
            <span
              dir="ltr"
              className="text-light5 text-lg mt-0.5 md:text-2xl absolute left-2 w-42 sm:w-60"
            >
              Masoud-Azimi.com
            </span>
          </Show>
          <Show when="signed-in">
            <span
              className={` text-light5 text-sm md:text-lg lg:text-xl absolute pr-4 lg:pr-0 left-0 sm:left-4 md:left-12 w-40`}
            >
              خوش برگشتی{" "}
              {profile?.firstName ||
                profile?.lastName ||
                user?.username ||
                "کاربر"}
            </span>
            {user?.hasImage ? (
              <Image
                width={50}
                height={50}
                src={user?.imageUrl || "/images/avatar-icon.svg"}
                alt="user avatar"
                className={`rounded-full scale-65 md:scale-75 lg:scale-100 border ring-2 ring-light4`}
              />
            ) : (
              <User
                className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-light5 ring-3 ring-light5 rounded-full`}
              />
            )}
          </Show>
        </div>
        <DropdownMenuIcons />
      </nav>
    </header>
  );
}
