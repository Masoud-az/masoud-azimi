import Carousel, { cardData } from "./carousel";

export default function Offerings() {
  return (
    <div
      dir="rtl"
      className="overflow-hidden md:max-w-5/7 mx-auto bg-container-background3 rounded-3xl md:rounded-4xl mt-4 md:mt-6 p-8 md:p-12 shadow-2xl"
    >
      <div>
        <h2 className="mt-4 font-MyAccentFont text-light2 text-xl md:text-5xl text-center">
          دوره‌ها و کلاس‌‌ها
        </h2>
        <p className="text-xs md:text-2xl text-center text-light4 mt-1 md:mt-3">
          روش‌هایی که توی مسیر موسیقی‌ میتونم کنارت باشم و کمکت کنم
        </p>
      </div>
      <div>
        <Carousel items={cardData} />
      </div>
    </div>
  );
}
