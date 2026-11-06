"use client";

import { useSignUp } from "@clerk/nextjs";
import { Form, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { InputOTPForm } from "../input-otp-form";
import { toast } from "../ui/toast";
import { useAuthModal } from "./auth-modal-context";

export default function SignUpModal() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const { closeSignUp, signUpModalOpen } = useAuthModal();

  const [error, setError] = useState("");
  const [step, setStep] = useState<"signUp" | "verify">("signUp");
  const { signUp, fetchStatus } = useSignUp();
  const [syncFailed, setSyncFailed] = useState(false);
  const isSubmitting = fetchStatus === "fetching";

  const persianNameRegex = /^[آ-ی]+(?:[ \u200C][آ-ی]+)*$/;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  const phoneRegex = /^09[0-9]{9}$/;

  const closeVerificationWindow = () => setStep("signUp");

  const syncUserToDatabase = async () => {
    try {
      const response = await fetch("/api/users/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const result: { error?: string; message?: string } =
        await response.json();

      if (!response.ok) {
        setSyncFailed(true);

        toast.add({
          type: "error",
          description: result.error ?? "ذخیره اطلاعات انجام نشد دوباره تلاش کن",
        });

        return;
      }

      setSyncFailed(false);

      toast.add({
        type: "success",
        description: "حساب کاربری شما با موفقیت ثبت شد",
      });

      setStep("signUp");
      closeSignUp();
    } catch (error) {
      setSyncFailed(true);

      toast.add({
        type: "error",
        description: "ارتباط با سرور برقرار نشد دوباره تلاش کن",
      });
    }
  };

  const handleVerifyEmail = async (vCode: string) => {
    const result = await signUp.verifications.verifyEmailCode({
      code: vCode,
    });

    if (result.error) {
      toast.add({
        type: "error",
        description: `تایید ایمیل انجام نشد: ${result.error.message}`,
      });
      return;
    }

    if (signUp.status !== "complete") {
      toast.add({
        type: "error",
        description: "ایمیل تایید شد اما اکانت ساخته نشد -خطای ناشناخته-",
      });
      return;
    }

    const finalizeSignUp = await signUp.finalize();

    console.log("Finalize result:", finalizeSignUp);

    if (finalizeSignUp.error) {
      toast.add({
        type: "error",
        description: `${finalizeSignUp.error.message}`,
      });
      return;
    }

    await syncUserToDatabase();
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("رمز عبور ها یکسان نیستند!");
      return;
    }

    if (!persianNameRegex.test(formData.firstName)) {
      setError("نام باید تنها شامل حروف فارسی باشد");
      return;
    }

    if (!persianNameRegex.test(formData.lastName)) {
      setError("نام خانوادگی باید تنها شامل حروف فارسی باشد");
      return;
    }

    if (!usernameRegex.test(formData.username)) {
      setError(
        "نام کاربری باید فقط شامل حروف انگلیسی و اعداد باشد و با عدد شروع نشود",
      );
      return;
    }
    if (!phoneRegex.test(formData.phoneNumber)) {
      setError("شماره موبایل باید با صفر شروع شود و یازده رقم باشد");
      return;
    }
    setError("");

    const response = await signUp.password({
      emailAddress: formData.email,
      password: formData.password,
      username: formData.username,
    });

    if (response.error) {
      toast.add({
        type: "error",
        description: ` ایجاد اکانت با شکست مواجه شد:${response.error.message}`,
      });
      return;
    }

    const { error: sendCodeError } = await signUp.verifications.sendEmailCode();

    if (sendCodeError) {
      setError(sendCodeError.message);
      return;
    }

    setStep("verify");
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  return (
    <div dir="rtl">
      <div
        onClick={closeSignUp}
        className={`text-4xl ${signUpModalOpen ? "" : "hidden"} fixed inset-0 z-80 bg-black/70 flex items-center justify-center`}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className={`${step === "verify" ? "" : "hidden"} fixed inset-0 z-90 bg-black/40 flex items-center justify-center`}
        >
          {syncFailed ? (
            <div className="rounded-2xl bg-mid p-6 text-center relative">
              <button
                aria-label="close"
                onClick={() => setSyncFailed(false)}
                className="cursor-pointer abolute left-1 top-1"
              >
                <X className="bg-container-background text-accent font-bold w-8 h-8 absolute right-6 top-6 p-1 rounded-xl transition-all duration-500 hover:rotate-90" />
              </button>
              <p className="mb-4 text-xl text-light4">
                حساب شما در سامانهٔ احراز هویت ساخته شده، اما ذخیره اطلاعات در
                پایگاه داده انجام نشد.
              </p>

              <button
                type="button"
                onClick={syncUserToDatabase}
                className="rounded-xl bg-light5 p-3 text-xl text-container-background"
              >
                تلاش دوباره
              </button>
            </div>
          ) : (
            <InputOTPForm
              closeAction={closeVerificationWindow}
              handleVerifyEmail={handleVerifyEmail}
              isVerificationOpen={step === "verify"}
              email={formData.email}
            />
          )}
        </div>
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-mid max-h-124 lg:max-h-screen w-72 sm:w-96 md:w-124 lg:w-148 p-2 lg:p-6 rounded-3xl relative"
        >
          <button
            aria-label="close sign up modal"
            onClick={closeSignUp}
            className="cursor-pointer"
          >
            <X className="bg-container-background text-accent font-bold w-8 h-8 lg:w-10 lg:h-10 absolute right-4 top-4 p-1 rounded-lg transition-all duration-500 hover:rotate-90" />
          </button>
          <div className="flex gap-2  mt-4 items-center">
            <Form className="h-6 w-6 sm:h-8 sm:w-8 lg:w-10 lg:h-10 text-light5" />
            <p className="text-light5 text-xl sm:text-2xl">
              برای عضویت فرم زیر رو پر کن:
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-6 ">
            <div className="max-h-72 lg:max-h-screen flex flex-col overflow-y-scroll lg:overflow-y-auto p-2 rounded-2xl bg-black/10">
              <div className="grid grid-cols-2 gap-4 sm:gap-4">
                <div dir="rtl" className="col-span-2 md:col-span-1">
                  <div className="flex gap-2 items-end-safe h-4 sm:h-8">
                    <label
                      htmlFor="firstName"
                      className="mr-2 text-sm sm:text-lg text-light5"
                    >
                      نام
                    </label>
                    <span className="text-sm sm:text-lg text-light5">
                      (به فارسی)
                    </span>
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    placeholder="..."
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="bg-container-background text-light4 text-lg rounded-xl mt-1 p-1 w-full"
                  />
                </div>
                <div dir="rtl" className="col-span-2 md:col-span-1">
                  <div className="flex gap-2 items-end-safe h-4 sm:h-8">
                    <label
                      htmlFor="lastName"
                      className="mr-2 text-sm sm:text-lg text-light5"
                    >
                      نام خانوادگی
                    </label>
                    <span className="text-sm sm:text-lg text-light5">
                      (به فارسی)
                    </span>
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    placeholder="..."
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="bg-container-background text-light4 text-lg rounded-xl mt-1 p-1 w-full"
                  />
                </div>
                <div className="col-span-2">
                  <div className="flex h-4 sm:h-8">
                    <label
                      htmlFor="email"
                      className="mr-2 text-sm sm:text-lg text-light5"
                    >
                      ایمیل
                    </label>
                  </div>
                  <input
                    dir="ltr"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="*****@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className=" bg-container-background text-light4 text-lg rounded-xl mt-1 p-1 w-full"
                  />
                </div>
                <div dir="rtl" className="col-span-2 md:col-span-1">
                  <div className="flex h-4 sm:h-8">
                    <label
                      htmlFor="username"
                      className="mr-2 text-sm sm:text-lg text-light5"
                    >
                      نام کاربری
                    </label>
                  </div>
                  <input
                    dir="ltr"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="a-z / 0-9"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="bg-container-background text-light4 text-lg rounded-xl mt-1 p-1 w-full"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <div className="flex h-4 sm:h-8">
                    <label
                      htmlFor="phoneNumber"
                      className="mr-2 text-sm sm:text-lg text-light5"
                    >
                      شماره موبایل
                    </label>
                  </div>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    inputMode="numeric"
                    type="tel"
                    autoComplete="tel"
                    placeholder="09*********"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="bg-container-background shadow-2xl text-light4 text-lg rounded-xl mt-1 p-1 w-full"
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="flex gap-2 items-end-safe h-4 sm:h-8">
                    <label
                      htmlFor="password"
                      className="mr-2 text-sm sm:text-lg text-light5"
                    >
                      رمز عبور
                    </label>
                    <span className="text-sm sm:text-lg text-light5">
                      (حداقل ۸ کاراکتر)
                    </span>
                  </div>
                  <input
                    dir="ltr"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="a-z / A-Z / 0-9"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-container-background text-light4 text-lg rounded-xl mt-1 p-1 w-full"
                  />
                </div>
                <div className="col-span-2 lg:col-span-1">
                  <div className="flex h-4 sm:h-8">
                    <label
                      htmlFor="confirmPassword"
                      className="mr-2 text-sm sm:text-lg text-light5"
                    >
                      تکرار رمز عبور
                    </label>
                  </div>
                  <input
                    dir="ltr"
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="***"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-container-background text-light4 text-lg rounded-xl mt-1 p-1 w-full"
                  />
                </div>
              </div>
              {error && (
                <p
                  className="text-accent text-sm sm:text-lg mt-4 col-span-2"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
            <div className="flex justify-center p-2 lg:mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-light5 hover:bg-container-background py-1 px-3 text-lg sm:text-2xl hover:text-light5 transition-all duration-700 text-container-background rounded-xl"
              >
                {isSubmitting ? "در حال بررسی..." : "ایجاد حساب"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
