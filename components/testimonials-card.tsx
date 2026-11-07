import { Check, Trash2, User, X } from "lucide-react";
import Image from "next/image";

type TestimonialsCardProps = {
  avatarUrl: string | null;
  name: string;
  comment: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  canDelete: boolean;
  isDeleting: boolean;
  onDelete: () => void;
  canModerate: boolean;
  isUpdating: boolean;
  onStatusChange: (status: "APPROVED" | "REJECTED") => void;
};

export default function TestimonialsCard({
  avatarUrl,
  name,
  comment,
  status,
  canDelete,
  isDeleting,
  onDelete,
  canModerate,
  isUpdating,
  onStatusChange,
}: TestimonialsCardProps) {
  return (
    <div
      dir="rtl"
      className="bg-container-background rounded-3xl p-2 md:p-6 shadow-2xl mt-4 relative overflow-hidden"
    >
      <div className="flex flex-wrap items-center justify-end gap-2 lg:absolute lg:left-6 lg:top-6">
        {canModerate && (
          <>
            {status !== "APPROVED" && (
              <button
                type="button"
                onClick={() => onStatusChange("APPROVED")}
                disabled={isUpdating || isDeleting}
                aria-label="تأیید دیدگاه"
                title="تأیید دیدگاه"
                className="flex items-center gap-1 py-1 px-4 rounded-full border-2 border-green-400 text-green-400 hover:bg-green-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={20} />
                <span className="text-xs md:text-sm">تأیید</span>
              </button>
            )}

            {status !== "REJECTED" && (
              <button
                type="button"
                onClick={() => onStatusChange("REJECTED")}
                disabled={isUpdating || isDeleting}
                aria-label="رد دیدگاه"
                title="رد دیدگاه"
                className="flex items-center gap-1 py-1 px-4 rounded-full text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-400"
              >
                <X size={20} />
                <span className="text-xs md:text-sm">رد</span>
              </button>
            )}
          </>
        )}

        {canDelete && (
          <button
            type="button"
            onClick={onDelete}
            disabled={isDeleting || isUpdating}
            aria-label="حذف دیدگاه"
            title="حذف دیدگاه"
            className="py-2 px-3 rounded-full text-light5 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-3 lg:mb-4 mt-2 lg:mt-0 lg:ml-24">
        {status === "PENDING" && (
          <span className="text-xs md:text-sm px-3 py-1 rounded-xl text-amber-500 bg-amber-800/50">
            در انتظار تأیید ادمین
          </span>
        )}

        {status === "APPROVED" && canModerate && (
          <span className="text-xs md:text-sm px-3 py-1 rounded-xl text-green-400 bg-green-800/30">
            تأیید شده
          </span>
        )}

        {status === "REJECTED" && (
          <span className="text-xs md:text-sm px-3 py-1 rounded-xl text-red-400 bg-red-800/30">
            تأیید نشده
          </span>
        )}

        {isUpdating && (
          <span className="text-xs text-light5 flex items-center">
            در حال به‌روزرسانی...
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
