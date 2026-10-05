import Image from "next/image";

export default function Hero() {
  return (
    <div className="bg-gray-700 md:max-w-5/7 mx-auto h-[70vh] mt-4 relative rounded-3xl shadow-2xl overflow-hidden">
      <Image
        src="/images/Cover3.jpg"
        alt="Playing guitar"
        fill
        className="object-cover"
      />
      <h1 className="absolute top-3/5 right-1/9 text-8xl font-extrabold text-orange-300 z-10">
        گیتار با مسعود
      </h1>
      <p className="absolute top-4/5 right-1/9 text-3xl font-bold text-center text-orange-300 z-10">
        فرآیند یادگیری هم میتونه لذت بخش باشه
      </p>
    </div>
  );
}
