import Image from "next/image";

type TestimonialsCardProps = {
  avatarUrl: string;
  username: string;
  comment: string;
};

export default function TestimonialsCard({
  avatarUrl,
  username,
  comment,
}: TestimonialsCardProps) {
  return (
    <div dir="rtl" className="bg-black/20 rounded-3xl p-6 shadow-2xl mt-4">
      <div className="flex items-center gap-6">
        <Image
          src={avatarUrl}
          alt="user avatar"
          width={60}
          height={60}
          className="border border-orange-600 rounded-full"
        />
        <h3 className="text-orange-300 text-3xl font-extrabold">{username}</h3>
      </div>
      <p className="text-orange-200 text-xl font-bold leading-8">{comment}</p>
    </div>
  );
}
