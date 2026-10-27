import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { X } from "lucide-react";
import { useState } from "react";

export function InputOTPForm({
  isVerificationOpen,
  email,
  handleVerifyEmail,
  closeAction,
}: {
  isVerificationOpen: boolean;
  email: string;
  handleVerifyEmail: (vCode: string) => Promise<void>;
  closeAction: () => void;
}) {
  const [verificationCode, setVerificationCode] = useState("");

  return (
    <Card
      dir="rtl"
      className={`${isVerificationOpen ? "" : "hidden"} mx-auto max-w-md bg-container-background2 shadow-2xl border border-light4`}
    >
      <button
        aria-label="close sign up modal"
        onClick={closeAction}
        className="cursor-pointer"
      >
        <X className="bg-container-background text-accent font-bold w-10 h-10 absolute right-6 top-6 p-1 rounded-xl transition-all duration-500 hover:rotate-90" />
      </button>
      <CardHeader>
        <CardTitle className="text-light4 font-MyFont">
          ایمیل خود را تایید کنید
        </CardTitle>
        <CardDescription>
          کد ارسال شده به ایمیل زیر را وارد کنید:{" "}
          <span className="font-medium">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="otp-verification" className="text-light4">
              کد تایید:
            </FieldLabel>
          </div>
          <div dir="ltr" className="text-light3">
            <InputOTP
              value={verificationCode}
              onChange={(value) => setVerificationCode(value)}
              maxLength={6}
              id="otp-verification"
              required
            >
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl">
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </Field>
      </CardContent>
      <CardFooter>
        <Field>
          <Button
            type="submit"
            className="w-full text-xl"
            disabled={verificationCode.length !== 6}
            onClick={() => handleVerifyEmail(verificationCode)}
          >
            تایید
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
