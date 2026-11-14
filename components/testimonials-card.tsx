import { User } from "lucide-react";
import Image from "next/image";

type TestimonialsCardProps = {
  avatarUrl: string | null;
  name: string;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
};

export default function TestimonialsCard({
  avatarUrl,
  name,
  comment,
  status,
}: TestimonialsCardProps) {
  return (
    <div
      dir="rtl"
      className="bg-container-background rounded-3xl p-2 md:p-6 shadow-2xl mt-4 relative overflow-hidden"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3 lg:mb-4 mt-2 lg:mt-0 lg:ml-24">
        {status === "PENDING" && (
          <span className="text-xs md:text-sm px-3 py-1 rounded-xl text-amber-500 bg-amber-800/50">
            در انتظار تأیید ادمین
          </span>
        )}
      </div>

      <div className="flex items-center px-2 mt-2 gap-2 md:gap-6">
        {avatarUrl ? (
          <Image
            src={avatarUrl || "/images/avatar-icon.svg"}
            alt="user avatar"
            width={60}
            height={60}
            className="border border-light4 rounded-full"
          />
        ) : (
          <User
            className={`w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-light5 ring-3 ring-light5 rounded-full`}
          />
        )}
        <h3 className="text-light3 text-xl md:text-2xl lg:text-3xl">{name}</h3>
      </div>
      <p className="text-light4 p-4 mt-2 text-sm md:text-xl md:leading-8">
        {comment}
      </p>
    </div>
  );
}
