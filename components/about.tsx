import Image from "next/image";
import RevealRight from "./animations/reveal-right";

export default function About() {
  return (
    <div
      id="about"
      dir="rtl"
      className="relative bg-container-background xl:w-[90%] 2xl:w-[80%] max-w-[1800px] mx-auto lg:py-2 py-8 px-4 xl:py-16 xl:px-16 rounded-3xl md:rounded-4xl shadow-2xl mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center"
    >
      <div className="flex flex-col md:p-6  xl:p-12">
        <RevealRight duration={0.5}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl mr-8 md:mr-0 text-light3 font-MyAccentFont ">
            درباره من
          </h2>
        </RevealRight>
        <RevealRight duration={0.5} delay={0.5}>
          <p className="text-sm sm:text-lg md:text-2xl text-light5 mt-4 md:mt-6 xl:mt-12 sm:px-4 sm:leading-8 xl:leading-10 ">
            مسعود عظیمی‌ هستم، مدرس و نوازنده‌ی گیتار الکتریک. آغاز راه من در
            مسیر پر فراز و نشیب موسیقی به سال ۱۳۹۱ برمی‌گردد. در ابتدا زیر نظر
            اساتید برجسته پرورش یافتم، اما به مرور مسیر خودآموزی با متدهای
            به‌روز را در پیش گرفتم تا موسیقی را با زبان خودم تجربه کنم. حالا
            سال‌هاست که میان دو رویکرد حرکت می‌کنم: دقت و نظم آموزش آکادمیک، و
            آزادی و خلاقیت در خودآموزی. اگر به دنبال مسیری هستید که به دور از
            دشواری‌های مسیر آکادمیک باشد و یادگیری موسیقی در آن تبدیل به
            تجربه‌ای زنده و شخصی شود، خوشحال می‌شوم با من همراه شوید.
          </p>
        </RevealRight>
      </div>

      <div className="relative aspect-square w-full md:max-w-180 xl:max-w-140 mx-auto">
        <Image
          src="/images/about-img.png"
          alt="playing guitar"
          fill
          className="rounded-3xl shadow-2xl object-cover"
        />
      </div>
    </div>
  );
}
