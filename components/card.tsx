import Image from "next/image";

type CardProps = {
  imageSrc: string;
  heading: string;
  description: string;
};

export default function Card({ imageSrc, heading, description }: CardProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-12 rounded-3xl shadow-2xl bg-linear-to-br from-orange-600/80 to-orange-700 md:max-w-180">
      <Image
        src={imageSrc}
        alt="guitar course"
        width={600}
        height={350}
        className="object-cover rounded-2xl shadow-2xl"
      />
      <h2 className="font-extrabold text-5xl text-orange-100 mt-12 text-center">
        {heading}
      </h2>
      <p className="font-bold text-2xl text-orange-100 mt-10 text-center leading-10">
        {description}
      </p>
      <button className="bg-gray-800 text-2xl text-orange-100 hover:bg-gray-500 p-4 mt-12 rounded-2xl">
        جزئیات بیشتر
      </button>
    </div>
  );
}
