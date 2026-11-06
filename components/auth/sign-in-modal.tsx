import { useSignIn } from "@clerk/nextjs";
import { Form, X } from "lucide-react";
import React, { useState } from "react";
import { toast } from "../ui/toast";
import { useAuthModal } from "./auth-modal-context";

export default function SignInModal() {
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const { signInModalOpen, closeSignIn, openSignUp } = useAuthModal();

  const [error, setError] = useState("");
  const { signIn, fetchStatus } = useSignIn();
  const isSubmitting = fetchStatus === "fetching";

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    setError("");

    try {
      const response = await signIn.password({
        identifier: formData.identifier.trim(),
        password: formData.password,
      });

      if (response.error) {
        setError(response.error.message);
        return;
      }

      if (signIn.status === "complete") {
        const finilizeResponse = await signIn.finalize();
        if (finilizeResponse.error) {
          setError(finilizeResponse.error.message);
          return;
        }
        closeSignIn();
        return;
      }

      setError("ورود تکمیل نشد");
    } catch {
      toast.add({
        type: "error",
        description: "ورود انجام نشد. دوباره تلاش کن",
      });
    }
  };

  return (
    <div
      onClick={closeSignIn}
      className={`${signInModalOpen ? "" : "hidden"} fixed inset-0 z-50 flex items-center justify-center bg-black/60`}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        dir="rtl"
        className="relative z-60 bg-mid p-4 md:p-8 rounded-3xl w-72 sm:w-96 md:w-md lg:w-136 "
      >
        <button
          onClick={closeSignIn}
          className="absolute bg-container-background p-1 right-4 top-4 lg:right-6 lg:top-6 cursor-pointer hover:rotate-90 transition-all duration-500 rounded-lg"
        >
          <X className="text-accent font-bold h-6 w-6 lg:h-8 lg:w-8" />
        </button>
        <div className="flex items-center gap-2 md:gap-4 mt-12 lg:mt-14">
          <Form className="text-light5 h-6 w-6  md:h-8 md:w-8 lg:h-10 lg:w-10" />
          <h2 className="text-lg md:text-xl lg:text-2xl text-light5">
            برای ورود اطلاعات زیر را وارد کنید:
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 lg:mt-8">
          <label
            htmlFor="identifier"
            className="text-sm md:text-lg lg:text-xl text-light5"
          >
            ایمیل یا نام کاربری:
          </label>
          <input
            dir="ltr"
            id="identifier"
            name="identifier"
            type="text"
            autoComplete="email"
            placeholder="example@gmail.com"
            value={formData.identifier}
            onChange={handleChange}
            required
            className="bg-container-background text-light4 text-lg lg:text-xl rounded-lg mt-1 mb-6 p-1 lg:p-2 w-full"
          ></input>
          <label
            htmlFor="password"
            className="text-sm md:text-lg lg:text-xl text-light5"
          >
            رمز عبور:
          </label>
          <input
            dir="ltr"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            required
            className="bg-container-background text-light4 text-lg lg:text-xl mt-1 rounded-lg p-1 lg:p-2 w-full"
          ></input>
          <div>
            {error && (
              <p className="mt-4 text-lg text-accent" role="alert">
                {error}
              </p>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              onClick={openSignUp}
              className="hover:bg-light5 hover:text-container-background bg-container-background text-light5 transition-all duration-700 px-4 py-1 lg:py-1.5 text-xl lg:text-2xl rounded-2xl"
            >
              عضویت
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-light5 text-container-background hover:bg-container-background hover:text-light5 transition-all duration-700 px-4 py-1 lg:py-1.5 text-xl lg:text-2xl rounded-2xl"
            >
              {isSubmitting ? "در حال بررسی" : "ورود"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
