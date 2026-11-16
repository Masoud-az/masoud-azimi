"use client";

import {
  Guitar,
  HandMetalIcon,
  Home,
  LogOutIcon,
  Menu,
  NotepadText,
  PhoneCall,
  UserSquare2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Show, SignOutButton } from "@clerk/react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/lib/hooks/use-user-role";

export function DropdownMenuIcons() {
  const router = useRouter();
  const { isAdmin } = useUserRole();

  const navigateToSection = (section: string) => {
    router.push(`/?section=${section}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button className="absolute group right-3 md:right-4 lg:right-5 h-8 md:h-10 w-8 md:w-10">
            <Menu className="transition-all cursor-pointer duration-700 group-hover:rotate-90 scale-125 md:scale-150 lg:scale-175 text-accent w-full " />
          </button>
        }
      />
      <DropdownMenuContent
        dir="rtl"
        className={
          "transition-all duration-300 bg-mid shadow-xl rounded-3xl border-2 border-light5/40 mr-2 md:mr-6 w-54 sm:w-64 md:w-84 lg:w-96 p-6 text-light4"
        }
      >
        <DropdownMenuItem
          onClick={() => navigateToSection("")}
          className={`text-sm cursor-pointer p-1 sm:text-lg md:p-2 lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
        >
          <HandMetalIcon className="size-6 sm:size-8 lg:size-10" />
          صفحه اصلی
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => router.replace("/admin")}
            className={`text-sm cursor-pointer p-1 sm:text-lg md:p-2 lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
          >
            <Home className="size-6 sm:size-8 lg:size-10" />
            پنل ادمین
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => navigateToSection("offerings")}
          className={`text-sm p-1 cursor-pointer sm:text-lg md:p-2 lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
        >
          <Guitar className="size-6 sm:size-8 lg:size-10" />
          دوره‌ها
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigateToSection("about")}
          className={`text-sm p-1 sm:text-lg cursor-pointer md:p-2 lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
        >
          <UserSquare2 className="size-6 sm:size-8 lg:size-10" />
          درباره من
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigateToSection("testimonials")}
          className={`text-sm p-1 sm:text-lg cursor-pointer md:p-2 lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
        >
          <NotepadText className="size-6 sm:size-8 lg:size-10 " />
          نظرات
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => navigateToSection("footer")}
          className={`text-sm p-1 sm:text-lg md:p-2 cursor-pointer lg:text-xl lg:gap-4 gap-2 hover:bg-container-background  active:bg-container-background3`}
        >
          <PhoneCall className="size-6 sm:size-8 lg:size-10 " />
          ارتباط با من
        </DropdownMenuItem>

        <Show when="signed-in">
          <DropdownMenuItem
            className={`text-sm p-1 sm:text-lg md:p-2 cursor-pointer lg:text-xl lg:gap-4 gap-2 bg-light5 text-mid group hover:bg-container-background  active:bg-container-background3`}
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
