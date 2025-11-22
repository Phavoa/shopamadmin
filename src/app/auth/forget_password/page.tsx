"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import { useForgotPasswordMutation } from "@/api/authApi";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/auth/validationSchemas";

export default function ForgotPasswordCard() {
  const [forgotPassword, { isLoading: isSending }] =
    useForgotPasswordMutation();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setApiError(null);
    setSuccessMessage(null);

    try {
      await forgotPassword({
        destination: data.email,
      }).unwrap();

      // Show success message without revealing if email exists
      setSuccessMessage(
        "If an account exists for that email, you'll receive password reset instructions shortly."
      );
      reset(); // Clear the form
    } catch (err) {
      console.error("Forgot password failed:", err);
      const error = err as { data?: { message?: string | string[] } };

      // Handle both string and array error messages
      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message ||
          "Something went wrong. Please try again later.";

      setApiError(errorMessage);
    }
  }

  return (
    <Card className="w-full max-w-md rounded-2xl p-8 shadow-[0_20px_60px_rgba(17,24,39,0.08)] border border-[#F1F5F9]">
      <div className="text-center">
        <h2
          className="text-2xl sm:text-3xl font-bold text-[#111827]"
          style={{ lineHeight: 1.05 }}
        >
          Forgot password
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          Enter the email address you and we'll send you instructions to reset
          your password
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6"
        aria-label="Forgot password form"
        noValidate
      >
        <div className="mb-4">
          <Label htmlFor="email" className="text-sm font-medium text-gray-500">
            Email
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className={`mt-2 h-12 placeholder:text-[#9CA3AF] rounded-lg border ${
                    fieldState.error ? "border-red-500" : "border-[#E5E7EB]"
                  } bg-white focus:border-[#E67E22]`}
                  required
                  aria-required="true"
                  autoComplete="email"
                  aria-invalid={Boolean(fieldState.error) || undefined}
                />
                {fieldState.error && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>

        {/* API ERROR MESSAGE */}
        {apiError && (
          <div
            role="alert"
            className="mb-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
          >
            {apiError}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div
            role="status"
            className="mb-3 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200"
          >
            {successMessage}
          </div>
        )}

        <div className="mt-4">
          <Button
            type="submit"
            className="w-full h-12 bg-[#E67E22] hover:bg-[#ea6a0a] active:translate-y-[0.5px] transform transition shadow-sm hover:shadow-md rounded-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E67E22]"
            disabled={isSubmitting || isSending}
            aria-disabled={isSubmitting || isSending}
          >
            {isSubmitting || isSending ? "Sending..." : "Send reset link"}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500">
          <Link
            href="/auth/login"
            className="underline hover:text-[#111827] focus-visible:ring-2 focus-visible:ring-[#E67E22] rounded"
          >
            <MoveLeft className="inline w-4 h-4 mr-1 mb-0.5 text-gray-700" />
            Back to login
          </Link>
        </div>
      </form>
    </Card>
  );
}
