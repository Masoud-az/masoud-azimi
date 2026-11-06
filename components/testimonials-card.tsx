import { Trash2, User } from "lucide-react";
import Image from "next/image";

type TestimonialsCardProps = {
  avatarUrl: string | null;
  name: string;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: () => void;
};

export default function TestimonialsCard({
  avatarUrl,
  name,
  comment,
  status,
  canDelete,
  isDeleting,
  onDelete,
}: TestimonialsCardProps) {
  return (
    <div
      dir="rtl"
      className="bg-container-background rounded-3xl p-2 md:p-6 shadow-2xl mt-4 relative"
    >
      <div className="lg:absolute lg:left-6 lg:top-6 left-2 top-2 flex items-center justify-end lg:justify-center gap-1 xl:gap-2">
        <div>
          {canDelete && (
            <button
              type="button"
              onClick={onDelete}
              disabled={isDeleting}
              aria-label="حذف دیدگاه"
              title="حذف دیدگاه"
              className="py-2 px-4 rounded-full text-light5 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={24} />
            </button>
          )}
        </div>
        <div>
          {status === "PENDING" && (
            <span className=" text-xs md:text-sm xl:text-lg px-3 py-1 md:px-4 md:py-1.5 rounded-xl md:rounded-2xl text-amber-500 bg-amber-800/50 ">
              در انتظار تأیید ادمین
            </span>
          )}

          {status === "REJECTED" && (
            <span className="absolute md:left-6 md:top-6 left-2 top-2 text-xs md:text-sm xl:text-lg px-3 py-1 md:px-4 md:py-1.5 rounded-xl md:rounded-2xl text-red-500 bg-red-800/50">
              تأیید نشده
            </span>
          )}
        </div>
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
