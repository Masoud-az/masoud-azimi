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
    <div
      dir="rtl"
      className="bg-container-background rounded-3xl p-2 md:p-6 shadow-2xl mt-4"
    >
      <div className="flex items-center px-2 mt-2 gap-2 md:gap-6">
        <Image
          src={avatarUrl}
          alt="user avatar"
          width={60}
          height={60}
          className="border border-light4 rounded-full"
        />
        <h3 className="text-light3 text-xl md:text-3xl">{username}</h3>
      </div>
      <p className="text-light4 p-4 mt-2 text-sm md:text-xl md:leading-8">
        {comment}
      </p>
    </div>
  );
}
