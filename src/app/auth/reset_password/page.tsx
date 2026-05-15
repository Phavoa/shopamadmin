"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useResetPasswordMutation } from "@/api/authApi";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/lib/auth/validationSchemas";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ResetPasswordFormData) {
    setApiError(null);
    setSuccessMessage(null);

    const email = localStorage.getItem("pendingVerificationEmail");
    const resetToken = localStorage.getItem("passwordResetToken");

    if (!email || !resetToken) {
      setApiError("Reset session expired. Please start over from the forgot password page.");
      return;
    }

    try {
      await resetPassword({
        destination: email,
        resetToken,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      setSuccessMessage("Password reset successful! Redirecting to login...");

      // Clear reset session
      localStorage.removeItem("pendingVerificationEmail");
      localStorage.removeItem("passwordResetToken");

      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password failed:", err);
      const error = err as { data?: { message?: string | string[] } };

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
          Reset password
        </h2>
        <p className="mt-3 text-sm text-gray-600">
          Enter your new password below to regain access to your account.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6"
        aria-label="Reset password form"
        noValidate
      >
        <div className="space-y-4">
          <div>
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-500"
            >
              New Password
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Controller
              name="newPassword"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`mt-2 h-12 rounded-lg border ${
                      fieldState.error ? "border-red-500" : "border-[#E5E7EB]"
                    } bg-white focus:border-[#E67E22]`}
                    required
                    aria-required="true"
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

          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-500"
            >
              Confirm Password
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Input
                    {...field}
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    className={`mt-2 h-12 rounded-lg border ${
                      fieldState.error ? "border-red-500" : "border-[#E5E7EB]"
                    } bg-white focus:border-[#E67E22]`}
                    required
                    aria-required="true"
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
        </div>

        {/* API ERROR MESSAGE */}
        {apiError && (
          <div
            role="alert"
            className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200"
          >
            {apiError}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div
            role="status"
            className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200"
          >
            {successMessage}
          </div>
        )}

        <div className="mt-6">
          <Button
            type="submit"
            className="w-full h-12 bg-[#E67E22] hover:bg-[#ea6a0a] active:translate-y-[0.5px] transform transition shadow-sm hover:shadow-md rounded-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E67E22]"
            disabled={isSubmitting || isLoading}
            aria-disabled={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
