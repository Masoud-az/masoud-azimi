import Carousel, { cardData } from "./carousel";

export default function Offerings() {
  return (
    <div
      dir="rtl"
      id="Offerings"
      className="overflow-hidden xl:w-[90%] 2xl:w-[80%] mx-auto bg-container-background3 rounded-3xl xl:rounded-4xl mt-4 xl:mt-6 p-8 xl:p-12 shadow-2xl"
    >
      <div>
        <h2 className="mt-4 font-MyAccentFont text-light2 text-xl sm:text-2xl md:text-3xl xl:text-5xl text-center">
          دوره‌ها و کلاس‌‌ها
        </h2>
        <p className="text-xs md:text-xl xl:text-2xl text-center text-light4 mt-1 xl:mt-3">
          روش‌هایی که توی مسیر موسیقی‌ میتونم کنارت باشم و کمکت کنم
        </p>
      </div>
      <div>
        <Carousel items={cardData} />
      </div>
    </div>
  );
}
