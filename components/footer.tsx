import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-container-background w-full xl:w-[90%] 2xl:w-[80%] mx-auto rounded-3xl shadow-2xl mt-2 md:mt-6 md:mb-12 p-2 md:p-6 flex md:gap-12 justify-center">
      <Link className="p-3 rounded-3xl text-light4 text-sm md:text-xl" href="#">
        insta
      </Link>
      <Link className="p-3 rounded-3xl text-light4 text-sm md:text-xl" href="#">
        telegram
      </Link>
      <Link className="p-3 rounded-3xl text-light4 text-sm md:text-xl" href="#">
        youtube
      </Link>
      <Link className="p-3 rounded-3xl text-light4 text-sm md:text-xl" href="#">
        courses
      </Link>
    </div>
  );
}
