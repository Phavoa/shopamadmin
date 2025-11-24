"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useVerifyOtpMutation, useRequestOtpMutation } from "@/api/authApi";
import { otpSchema, type OtpFormData } from "@/lib/auth/validationSchemas";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [requestOtp, { isLoading: isRequestingOtp }] = useRequestOtpMutation();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );
  const [status, setStatus] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<number>(0);
  const cooldownRef = useRef<number | null>(null);

  const LENGTH = 4;
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  // Get email from localStorage
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("pendingVerificationEmail") || ""
      : "";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    inputsRef.current[0]?.focus();
    return () => {
      if (cooldownRef.current) window.clearInterval(cooldownRef.current);
    };
  }, []);

  useEffect(() => {
    if (cooldown === 0 && cooldownRef.current) {
      window.clearInterval(cooldownRef.current);
      cooldownRef.current = null;
    }
  }, [cooldown]);

  function startCooldown() {
    const RESEND_COOLDOWN = 60;
    setCooldown(RESEND_COOLDOWN);
    if (cooldownRef.current) window.clearInterval(cooldownRef.current);
    cooldownRef.current = window.setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          if (cooldownRef.current) {
            window.clearInterval(cooldownRef.current);
            cooldownRef.current = null;
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }

  function handleOtpChange(index: number, value: string) {
    const otpArray = getValues("otp").split("");

    if (value.length > 1) {
      // Handle paste
      const digits = value.slice(0, LENGTH).split("");
      const newOtp = Array.from({ length: LENGTH }, (_, i) => digits[i] ?? "");
      setValue("otp", newOtp.join(""));

      const firstEmpty = newOtp.findIndex((d) => d === "");
      if (firstEmpty >= 0) inputsRef.current[firstEmpty]?.focus();
      else inputsRef.current[LENGTH - 1]?.focus();
    } else {
      // Handle single character input
      otpArray[index] = value.replace(/\D/g, "");
      setValue("otp", otpArray.join(""));

      if (index < LENGTH - 1 && otpArray[index]) {
        inputsRef.current[index + 1]?.focus();
        inputsRef.current[index + 1]?.select();
      }
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace") {
      if (getValues("otp")[index]) {
        const otpArray = getValues("otp").split("");
        otpArray[index] = "";
        setValue("otp", otpArray.join(""));
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const otpArray = getValues("otp").split("");
        otpArray[index - 1] = "";
        setValue("otp", otpArray.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    } else if (e.key === "Enter") {
      void submitIfComplete();
    }
  }

  async function submitIfComplete() {
    const otp = getValues("otp").replace(/\D/g, "");
    if (otp.length !== LENGTH) {
      setApiError("Please enter the full 4-digit code.");
      return;
    }

    if (!email) {
      setApiError("Email not found. Please try signing up again.");
      return;
    }

    try {
      await verifyOtp({
        destination: email,
        purpose: "SIGNUP",
        code: otp,
      }).unwrap();

      // Clear the stored email
      localStorage.removeItem("pendingVerificationEmail");

      setSuccessMessage("Email verified successfully! Redirecting to login...");

      // Redirect to login after successful verification
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (err) {
      console.error("OTP verification failed:", err);
      const error = err as { data?: { message?: string | string[] } };

      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message ||
          "Verification failed. Please check your code and try again.";

      setApiError(errorMessage);
    }
  }

  async function handleResend() {
    setApiError(null);
    setSuccessMessage(null);
    setStatus(null);

    if (!email) {
      setApiError("Email not found. Please try signing up again.");
      return;
    }

    try {
      await requestOtp({
        destination: email,
        purpose: "SIGNUP",
      }).unwrap();

      setStatus("A new code was sent. Check your messages.");
      setValue("otp", ""); // Clear the OTP input
      inputsRef.current[0]?.focus();
      startCooldown();
    } catch (err) {
      console.error("Resend OTP failed:", err);
      const error = err as { data?: { message?: string | string[] } };

      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message || "Failed to resend code. Please try again.";

      setApiError(errorMessage);
    }
  }

  function onSubmit(data: OtpFormData) {
    void submitIfComplete();
  }

  return (
    <Card className="w-full max-w-md rounded-2xl p-8 shadow-[0_20px_60px_rgba(17,24,39,0.08)] border border-[#F1F5F9]">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
          Verify code
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Please enter the 4 digit code that was sent to you.
          <span className="font-medium text-[#374151]">
            {email || "your contact"}
          </span>
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 mt-6"
        aria-label="Verify OTP form"
      >
        <div>
          <label className="text-sm font-medium text-gray-500 block mb-2">
            Verification Code
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex items-center justify-center gap-3">
            {Array.from({ length: LENGTH }).map((_, i) => (
              <Input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                  return undefined;
                }}
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={getValues("otp")[i] || ""}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={(e) => {
                  const paste = e.clipboardData?.getData("text") || "";
                  handleOtpChange(i, paste);
                  e.preventDefault();
                }}
                className="w-14 h-14 text-center text-lg font-semibold rounded-lg border border-[#E5E7EB] focus-visible:ring-2 focus-visible:ring-[#E67E22] p-0"
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>
          {errors.otp && (
            <p className="mt-1 text-sm text-red-600 text-center">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* Timer and Resend Option */}
        <div className="flex flex-col items-center gap-2">
          {cooldown > 0 ? (
            <div className="text-sm text-gray-500">
              Resend code in <span className="font-medium">{cooldown}s</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isRequestingOtp || isVerifying}
              className="text-sm text-[#E67E22] hover:text-[#ea6a0a] hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRequestingOtp ? "Sending..." : "Didn't get a code? send again"}
            </button>
          )}
        </div>

        {/* API ERROR MESSAGE */}
        {apiError && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 text-center">
            {apiError}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200 text-center">
            {successMessage}
          </div>
        )}

        {/* STATUS MESSAGE */}
        {status && (
          <div className="text-sm text-blue-700 bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
            {status}
          </div>
        )}

        {/* PRIMARY VERIFY BUTTON */}
        <div>
          <Button
            type="submit"
            className="w-full h-12 bg-[#E67E22] hover:bg-[#ea6a0a] rounded-lg font-semibold"
            disabled={isSubmitting || isVerifying}
            aria-disabled={isSubmitting || isVerifying}
          >
            {isSubmitting || isVerifying ? "Verifying..." : "Verify"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
