import Image from "next/image";
import RevealRight from "./animations/reveal-right";

export default function Hero() {
  return (
    <div
      id="hero"
      className="bg-container-background mt-18 md:mt-22 lg:mt-24 xl:mt-36 xl:w-[90%] 2xl:w-[80%] max-w-[1800] mx-auto h-[25vh] sm:h-[45vh] sm:min-h-100 lg:h-[65vh] xl:h-[75vh] relative rounded-4xl shadow-2xl overflow-hidden"
    >
      <Image
        src="/images/Cover.jpg"
        alt="Playing guitar"
        fill
        className="object-cover opacity-80"
      />

      <RevealRight
        duration={0.5}
        className="absolute top-3/5 right-1/9 text-2xl sm:text-4xl md:text-5xl xl:text-7xl font-extrabold text-light3 z-10"
      >
        <h1>گیتار با مسعود</h1>
      </RevealRight>
      <RevealRight
        delay={0.5}
        duration={1}
        className="absolute top-9/12 right-1/9 text-sm sm:text-lg md:text-2xl xl:text-3xl font-bold text-center text-light5 z-10"
      >
        <p>فرآیند یادگیری هم میتونه لذت بخش باشه</p>
      </RevealRight>
    </div>
  );
}
