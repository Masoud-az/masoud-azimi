"use client";

import { useSignUp } from "@clerk/nextjs";
import { Form, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { InputOTPForm } from "../input-otp-form";
import { toast } from "../ui/toast";

export default function SignUpModal({
  isSignUpOpen,
  onClose,
}: {
  isSignUpOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [step, setStep] = useState<"signUp" | "verify">("signUp");
  const { signUp, fetchStatus } = useSignUp();
  const isSubmitting = fetchStatus === "fetching";

  const persianNameRegex = /^[آ-ی]+(?:[ \u200C][آ-ی]+)*$/;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]*$/;
  const phoneRegex = /^09[0-9]{9}$/;

  const closeVerificationWindow = () => setStep("signUp");

  const handleVerifyEmail = async (vCode: string) => {
    const result = await signUp.verifications.verifyEmailCode({
      code: vCode,
    });

    if (result.error) {
      toast.add({
        type: "error",
        description: `تایید ایمیل انجام نشد: ${result.error}`,
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

    if (finalizeSignUp.error) {
      toast.add({
        type: "error",
        description: `${finalizeSignUp.error.message}`,
      });
      return;
    }

    toast.add({
      type: "success",
      description: "حساب کاربری شما با موفقیت ثبت شد",
    });
    setStep("signUp");
    onClose();
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
        onClick={onClose}
        className={`text-4xl ${isSignUpOpen ? "" : "hidden"} fixed inset-0 z-50 bg-black/70 flex items-center justify-center`}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className={`${step === "verify" ? "" : "hidden"} fixed inset-0 z-60 bg-black/40 flex items-center justify-center`}
        >
          <InputOTPForm
            closeAction={closeVerificationWindow}
            handleVerifyEmail={handleVerifyEmail}
            isVerificationOpen={step === "verify"}
            email={formData.email}
          />
        </div>
        <div
          onClick={(event) => event.stopPropagation()}
          className="bg-mid lg:w-2/7 lg:h-6/7  lg:rounded-4xl p-6 relative "
        >
          <button
            aria-label="close sign up modal"
            onClick={onClose}
            className="cursor-pointer"
          >
            <X className="bg-container-background text-accent font-bold w-10 h-10 absolute right-6 top-6 p-1 rounded-xl transition-all duration-500 hover:rotate-90" />
          </button>
          <div className="flex gap-3 mt-10 items-center">
            <Form className="h-6 w-6 text-light4" />
            <p className="text-light4 text-3xl">برای عضویت فرم زیر رو پر کن:</p>
          </div>
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div dir="rtl">
                <div className="flex gap-2 items-end-safe">
                  <label
                    htmlFor="firstName"
                    className="mr-2 text-2xl text-light4"
                  >
                    نام
                  </label>
                  <span className="text-lg text-light4">(به فارسی)</span>
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
                  className="bg-container-background text-light4 text-xl rounded-xl mt-1 p-2 w-full"
                />
              </div>
              <div>
                <div className="flex gap-2 items-end-safe">
                  <label
                    htmlFor="lastName"
                    className="mr-2 text-2xl text-light4"
                  >
                    نام خانوادگی
                  </label>
                  <span className="text-lg text-light4">(به فارسی)</span>
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
                  className="bg-container-background text-light4 text-xl rounded-xl mt-1 p-2 w-full"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="email" className="mr-2 text-2xl text-light4">
                  ایمیل
                </label>
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
                  className="bg-container-background text-light4 text-xl rounded-xl mt-1 p-2 w-full"
                />
              </div>
              <div dir="rtl">
                <label htmlFor="username" className="mr-2 text-2xl text-light4">
                  نام کاربری
                </label>
                <input
                  dir="ltr"
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  placeholder="a-z / 0-9"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-container-background text-light4 text-xl rounded-xl mt-1 p-2 w-full"
                />
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mr-2 text-2xl text-light4"
                >
                  شماره موبایل
                </label>
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
                  className="bg-container-background shadow-2xl text-light4 text-xl rounded-xl mt-1 p-2 w-full"
                />
              </div>
              <div className="col-span-2">
                <div className="flex gap-2 items-end-safe">
                  <label
                    htmlFor="password"
                    className="mr-2 text-2xl text-light4"
                  >
                    رمز عبور
                  </label>
                  <span className="text-lg text-light4">(حداقل ۸ کاراکتر)</span>
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
                  className="bg-container-background text-light4 text-xl rounded-xl mt-1 p-2 w-full"
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="confirmPassword"
                  className="mr-2 text-2xl text-light4"
                >
                  تکرار رمز عبور
                </label>
                <input
                  dir="ltr"
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="***"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="bg-container-background text-light4 text-xl rounded-xl mt-1 p-2 w-full"
                />
              </div>
            </div>
            {error && (
              <p className="text-accent text-lg mt-4 col-span-2" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-light5 p-2 text-2xl text-container-background rounded-2xl absolute bottom-12 left-1/2 -translate-x-1/2"
            >
              {isSubmitting ? "در حال بررسی..." : "ایجاد حساب"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
