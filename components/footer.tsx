import { FaInstagram, FaTelegram } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function Footer() {
  return (
    <div
      id="footer"
      dir="rtl"
      className="bg-container-background  w-full xl:w-[90%] 2xl:w-[80%] mx-auto rounded-3xl shadow-2xl  md:mt-6 md:mb-12 p-2 md:p-6 flex md:gap-12 justify-center mt-6"
    >
      <div className="flex flex-col sm:gap-4">
        <div className="flex gap-4 items-center justify-center my-1 ">
          <a
            href="https://t.me/Masoud_aziminia"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <FaTelegram className="h-6 w-6 md:h-10 md:w-12  text-light5 m-2" />
          </a>
          <a href="mailto:masoud697@gmail.com" aria-label="Email">
            <MdEmail className="h-6 w-6 md:h-10 md:w-12 text-light5 m-2" />
          </a>
          <a
            href="https://instagram.com/masoud.azimiii"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="h-6 w-6 md:h-10 md:w-12 text-light5 m-2" />
          </a>
        </div>
        <span
          dir="ltr"
          className="mt-2 text-sm lg:text-lg text-center text-light3"
        >
          © 2026 Masoud Azimi. All rights reserved.
        </span>
      </div>
    </div>
  );
}
