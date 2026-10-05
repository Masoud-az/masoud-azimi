import Image from "next/image";

export default function About() {
  return (
    <div
      dir="rtl"
      className="relative bg-gray-700 md:max-w-5/7 mx-auto p-16 rounded-3xl shadow-2xl mt-5 flex justify-between"
    >
      <div className="flex flex-col p-12">
        <h2 className="text-6xl text-orange-300 font-extrabold ">درباره من</h2>
        <p className="text-2xl text-orange-300 font-bold mt-12 leading-10 ">
          مسعود عظیمی‌ هستم، مدرس و نوازنده‌ی گیتار الکتریک. آغاز راه من در مسیر
          پر فراز و نشیب موسیقی به سال ۱۳۹۱ برمی‌گردد. در ابتدا زیر نظر اساتید
          برجسته پرورش یافتم، اما به مرور مسیر خودآموزی با متدهای به‌روز را در
          پیش گرفتم تا موسیقی را با زبان خودم تجربه کنم. حالا سال‌هاست که میان
          دو رویکرد حرکت می‌کنم: دقت و نظم آموزش آکادمیک، و آزادی و خلاقیت در
          خودآموزی. اگر به دنبال مسیری هستید که به دور از دشواری‌های مسیر
          آکادمیک باشد و یادگیری موسیقی در آن تبدیل به تجربه‌ای زنده و شخصی شود،
          خوشحال می‌شوم با من همراه شوید.
        </p>
      </div>
      <Image
        src="/images/about-img.png"
        alt="playing guitar"
        width="500"
        height="500"
        className="rounded-3xl shadow-2xl"
      />
    </div>
  );
}
