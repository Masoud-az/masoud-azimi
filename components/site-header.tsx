import { Menu } from "lucide-react";
import Image from "next/image";

type SiteHeaderProps = {
  username: string;
};

export default function SiteHeader({ username }: SiteHeaderProps) {
  return (
    <header className="mt-4">
      <nav className="flex font-bold h-20 items-center justify-between px-6 py-3 rounded-3xl border border-black/50 shadow-2xl bg-gray-700 md:max-w-5/7 mx-auto">
        <div className="flex gap-4  items-center">
          <Image
            width={50}
            height={50}
            src="/images/avatar-icon.svg"
            alt="user avatar"
            className="text-white rounded-full border ring-2 ring-orange-600"
          />
          <span className="text-orange-600 text-lg">
            {" "}
            خوش برگشتی {username}
          </span>
        </div>
        <div className="flex items-center gap-4 font-bold">
          <button className="text-lg text-orange-100 font-bold bg-orange-600 p-2 rounded-full">
            عضویت
          </button>
          <button className="text-lg font-bold text-orange-600">ورود</button>
          <Menu className="text-orange-600 h-10 w-10" />
        </div>
      </nav>
    </header>
  );
}
