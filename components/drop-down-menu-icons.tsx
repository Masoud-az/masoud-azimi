"use client";

import {
  Guitar,
  HandMetal,
  LogOutIcon,
  Menu,
  PhoneCall,
  UserIcon,
  UserSquare2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Show, SignOutButton } from "@clerk/react";

export function DropdownMenuIcons() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="absolute group right-3 md:right-4 lg:right-5 h-8 md:h-10 w-8 md:w-10">
            <Menu className="transition-all duration-700 group-hover:rotate-90 scale-125 md:scale-150 lg:scale-175 text-accent w-full " />
          </button>
        }
      />
      <DropdownMenuContent
        dir="rtl"
        className={
          "transition-all duration-300 bg-mid shadow-xl rounded-3xl border-2 border-light5/40 mr-2 md:mr-6 w-54 sm:w-64 md:w-84 lg:w-96 p-6 text-light4"
        }
      >
        <Show when="signed-in">
          <DropdownMenuItem
            className={`text-sm p-1 sm:text-lg md:p-2 lg:text-xl lg:gap-4 gap-2  hover:bg-container-background  active:bg-container-background3`}
          >
            <UserIcon className="size-6 sm:size-8 lg:size-10" />
            درخواست‌های من
          </DropdownMenuItem>
        </Show>
        <DropdownMenuItem
          onClick={() =>
            document.getElementById("Offerings")?.scrollIntoView({
              behavior: "smooth",
            })
          }
          className={`text-sm p-1 sm:text-lg md:p-2 lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
        >
          <Guitar className="size-6 sm:size-8 lg:size-10" />
          دوره‌ها
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`text-sm p-1 sm:text-lg md:p-2 lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
        >
          <HandMetal className="size-6 sm:size-8 lg:size-10" />
          وبلاگ
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            document
              .getElementById("about")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className={`text-sm p-1 sm:text-lg md:p-2 lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
        >
          <UserSquare2 className="size-6 sm:size-8 lg:size-10" />
          درباره من
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`text-sm p-1 sm:text-lg md:p-2 lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
        >
          <PhoneCall className="size-6 sm:size-8 lg:size-10 " />
          ارتباط با من
        </DropdownMenuItem>
        <Show when="signed-in">
          <DropdownMenuItem
            className={`text-sm p-1 sm:text-lg md:p-2 lg:text-xl lg:gap-4 gap-2 bg-light5 text-mid group hover:bg-container-background  active:bg-container-background3`}
          >
            <LogOutIcon className="size-6 sm:size-8 lg:size-10 text-mid group-hover:text-light5" />
            <SignOutButton>
              <button className="text-mid group-hover:text-light5">
                خروج از حساب
              </button>
            </SignOutButton>
          </DropdownMenuItem>
        </Show>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
