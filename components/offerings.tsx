import Card from "./card";

export default function Offerings() {
  return (
    <div
      dir="rtl"
      className="max-w-5/7 mx-auto bg-gray-700 flex-col rounded-3xl mt-5 p-12"
    >
      <div>
        <h2 className="font-extrabold text-orange-300 text-5xl text-center">
          دوره‌ها و کلاس‌‌ها
        </h2>
        <p className="font-bold text-2xl text-center text-orange-300 mt-5">
          روش‌هایی که توی مسیر موسیقی‌ میتونم کنارت باشم و کمکت کنم
        </p>
      </div>
      <div className="mt-12 flex gap-6">
        <Card
          imageSrc="/images/Cover.jpg"
          heading="گیتارالکتریک برای نوآموزان ۱"
          description="دوره آفلاین بیش از ۶۰۰ دقیقه ویدیو و ۱۰۰ صفحه جزوه کتبی به همراه پشتیبانی آنلاین... دیگه خلاصه خیلی خوبه و حسابی یاد میگیده و کلی حال میکنی اگگه تمرین کنی این حرفا و و و و و خیلی دووره خفنیه"
        />
        <Card
          imageSrc="/images/Cover.jpg"
          heading="کلاس‌های حضوری"
          description="دوره آفلاین بیش از ۶۰۰ دقیقه ویدیو و ۱۰۰ صفحه جزوه کتبی به همراه پشتیبانی آنلاین... دیگه خلاصه خیلی خوبه و حسابی یاد میگیده و کلی حال میکنی اگگه تمرین کنی این حرفا و و و و و خیلی دووره خفنیه"
        />
        <Card
          imageSrc="/images/Cover.jpg"
          heading="کلاس‌‌های آنلاین"
          description="دوره آفلاین بیش از ۶۰۰ دقیقه ویدیو و ۱۰۰ صفحه جزوه کتبی به همراه پشتیبانی آنلاین... دیگه خلاصه خیلی خوبه و حسابی یاد میگیده و کلی حال میکنی اگگه تمرین کنی این حرفا و و و و و خیلی دووره خفنیه"
        />
      </div>
    </div>
  );
}
