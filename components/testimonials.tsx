import TestimonialsCard from "./testimonials-card";

export default function Testimonials() {
  return (
    <div
      dir="rtl"
      className="bg-gray-700/80 max-w-5/7 p-6 mt-5 mx-auto rounded-3xl flex flex-col"
    >
      <h2 className="text-6xl font-extrabold text-orange-300 mt-10 text-center">
        از تجربه‌ات با من بگو
      </h2>
      <div className="grid grid-cols-2 gap-6 mt-12">
        <TestimonialsCard
          avatarUrl="/images/avatar-icon.png"
          username="mamad"
          comment="آقای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوده و هردفه که باهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده.."
        />
        <TestimonialsCard
          avatarUrl="/images/avatar-icon.png"
          username="mamad"
          comment="آقای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوده و هردفه که باهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده.."
        />
        <TestimonialsCard
          avatarUrl="/images/avatar-icon.png"
          username="mamad"
          comment="آقای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوده و هردفه که باهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده.."
        />
        <TestimonialsCard
          avatarUrl="/images/avatar-icon.png"
          username="mamad"
          comment="آقای عظیمی فوق‌العاده‌اس.. اصلا نمیدونم چجوری توصیفش کنم. بهترین لحظات زندگیم تا الان فقط تایم های کلاس با ایشون بوده و هردفه که باهاشون کلاس داشتم بعدش امید به زندگیم ۱۰ برابر میشده.."
        />
      </div>
    </div>
  );
}
