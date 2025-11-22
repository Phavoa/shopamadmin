"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PasswordInput } from "@/components/ui/password-input";
import { useLoginMutation } from "@/api/authApi";
import { loginSchema, type LoginFormData } from "@/lib/auth/validationSchemas";

export default function LoginPage() {
  const router = useRouter();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: LoginFormData) {
    setApiError(null);
    setSuccessMessage(null);

    try {
      await login({
        email: data.email,
        password: data.password,
      }).unwrap();

      setSuccessMessage("Login successful! Redirecting to dashboard...");

      // Navigate to admin dashboard after successful login
      setTimeout(() => {
        router.push("/admin-dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      const error = err as { data?: { message?: string | string[] } };

      // Handle both string and array error messages
      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message ||
          "Login failed. Please check your credentials.";

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
          Log in
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Are you new here?{" "}
          <a
            href="/auth/signup"
            className="underline font-medium text-[#374151] hover:text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#E67E22] rounded"
          >
            Create Account
          </a>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-6"
        aria-label="Login form"
      >
        {/* EMAIL */}
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
                  placeholder="Enter your email"
                  className={`mt-2 h-12 rounded-lg border ${
                    fieldState.error ? "border-red-500" : "border-[#E5E7EB]"
                  } placeholder:text-[#9CA3AF]`}
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

        {/* PASSWORD */}
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <Label
              htmlFor="password"
              className="text-sm font-medium text-gray-500"
            >
              Password
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <a
              href="#forgot"
              className="text-sm text-[#9CA3AF] hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E67E22] rounded"
            >
              Forgot password?
            </a>
          </div>

          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                id="password"
                placeholder="Enter your password"
                className="mt-2 h-12 rounded-lg"
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* API ERROR MESSAGE */}
        {apiError && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {apiError}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="mt-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
            {successMessage}
          </div>
        )}

        {/* PRIMARY CTA */}
        <div className="mt-6">
          <Button
            type="submit"
            className="w-full h-12 bg-[#E67E22] hover:bg-[#ea6a0a] active:translate-y-[0.5px] transform transition shadow-sm hover:shadow-md rounded-lg font-semibold"
            disabled={isSubmitting || isLoggingIn}
          >
            {isSubmitting || isLoggingIn ? "Signing in..." : "Log in"}
          </Button>
        </div>

        {/* Divider with "Or" */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden>
            <div className="w-full border-t border-[#E5E7EB]" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-[#9CA3AF]">Or</span>
          </div>
        </div>

        {/* Social buttons */}
        <div className="space-y-3">
          <button
            type="button"
            className="w-full h-12 flex items-center justify-center gap-3 rounded border border-[#E5E7EB] bg-white text-[#374151] text-sm font-medium hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden
            >
              {/* Google "G" simplified mark */}
              <path
                d="M533.5 278.4c0-17.6-1.6-34.4-4.7-50.8H272v96.1h147.5c-6.4 34-25.6 62.8-54.6 82v68.5h88.2c51.6-47.6 81.4-117.6 81.4-196z"
                fill="#4285f4"
              />
              <path
                d="M272 544.3c73.5 0 135.3-24.2 180.4-65.8l-88.2-68.5c-24.5 16.4-56 26.1-92.2 26.1-70.9 0-130.9-47.8-152.3-112.1H30.1v70.7C75.7 484.1 168 544.3 272 544.3z"
                fill="#34a853"
              />
              <path
                d="M119.7 323.9c-7.7-23-12.1-47.6-12.1-72.6s4.4-49.6 12.1-72.6V108H30.1C10.8 152.3 0 202.6 0 252.3s10.8 100 30.1 144.3l89.6-72.7z"
                fill="#fbbc04"
              />
              <path
                d="M272 107.7c39.9-.6 76 14 104.4 40.6l78.1-78.1C405.9 21.8 344.1 0 272 0 168 0 75.7 60.2 30.1 146.3l89.6 70.6C141.1 155.6 201.1 107.7 272 107.7z"
                fill="#ea4335"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full h-12 flex items-center justify-center gap-3 rounded border border-[#E5E7EB] bg-white text-[#374151] text-sm font-medium hover:bg-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#E67E22]"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
              {/* Apple mark simplified */}
              <path
                d="M16.365 1.43c-.93.001-2.08.637-2.76.637-.67 0-1.73-.629-2.86-.615-1.48.016-2.86.855-3.63 2.16-1.55 2.57-.4 6.38 1.16 8.47.78 1.04 1.71 2.22 2.92 2.19 1.12-.03 1.55-.69 3.01-.69 1.46 0 1.85.69 3.01.67 1.37-.01 2.24-1.05 3.02-2.08.98-1.34 1.38-2.63 1.4-2.69-.03-.01-2.53-.97-2.56-3.84-.02-2.28 1.86-3.3 1.94-3.36-.99-1.44-2.53-1.62-3.06-1.64z"
                fill="currentColor"
              />
            </svg>
            Continue with Apple
          </button>
        </div>
      </form>
    </Card>
  );
}
