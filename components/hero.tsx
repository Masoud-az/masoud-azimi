import Image from "next/image";
import RevealRight from "./animations/reveal-right";

export default function Hero() {
  return (
    <div className="bg-container-background mt-18 md:mt-36 md:max-w-5/7 mx-auto h-[25vh] md:h-[75vh] relative rounded-4xl shadow-2xl overflow-hidden">
      <Image
        src="/images/Cover.jpg"
        alt="Playing guitar"
        fill
        className="object-cover opacity-80"
      />

      <RevealRight
        duration={0.5}
        className="absolute top-3/5 right-1/9 text-2xl md:text-8xl font-extrabold text-light2 z-10"
      >
        <h1>گیتار با مسعود</h1>
      </RevealRight>
      <RevealRight
        delay={0.5}
        duration={1}
        className="absolute top-9/12 right-1/9 text-sm md:text-3xl font-bold text-center text-light4 z-10"
      >
        <p>فرآیند یادگیری هم میتونه لذت بخش باشه</p>
      </RevealRight>
    </div>
  );
}
