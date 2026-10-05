import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-gray-800 max-w-5/7 mx-auto rounded-3xl shadow-2xl mt-6 mb-12 p-6 flex gap-6 justify-around">
      <Link className="bg-gray-700 p-3 rounded-3xl text-orange-300" href="#">
        insta
      </Link>
      <Link className="bg-gray-700 p-3 rounded-3xl text-orange-300" href="#">
        telegram
      </Link>
      <Link className="bg-gray-700 p-3 rounded-3xl text-orange-300" href="#">
        youtube
      </Link>
      <Link className="bg-gray-700 p-3 rounded-3xl text-orange-300" href="#">
        courses
      </Link>
    </div>
  );
}
