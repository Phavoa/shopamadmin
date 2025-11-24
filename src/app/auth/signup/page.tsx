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
import { useRegisterMutation } from "@/api/authApi";
import {
  signupSchema,
  type SignupFormData,
} from "@/lib/auth/validationSchemas";

export default function SignUpPage() {
  const router = useRouter();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [apiError, setApiError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: SignupFormData) {
    setApiError(null);
    setSuccessMessage(null);

    try {
      await register({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      // Store the email for the OTP verification step
      localStorage.setItem("pendingVerificationEmail", data.email);
      setSuccessMessage(
        "Account created successfully! Redirecting to verification..."
      );

      // Navigate to OTP verification page after a short delay
      setTimeout(() => {
        router.push("/auth/verify_otp");
      }, 1500);
    } catch (err) {
      console.error("Registration failed:", err);
      const error = err as { data?: { message?: string | string[] } };

      // Handle both string and array error messages
      const errorMessage = Array.isArray(error?.data?.message)
        ? error.data.message.join(", ")
        : error?.data?.message || "Registration failed. Please try again.";

      setApiError(errorMessage);
    }
  }

  return (
    <Card className="w-full max-w-md rounded-2xl p-8 shadow-[0_20px_60px_rgba(17,24,39,0.08)] border border-[#F1F5F9]">
      {/* HEADER */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111827]">
          Create Account
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="underline font-medium text-[#374151] hover:text-[#111827]"
          >
            Log in
          </a>
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {/* FIRST NAME */}
        <div>
          <Label
            htmlFor="firstName"
            className="text-sm font-medium text-gray-500"
          >
            First Name
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="firstName"
                  placeholder="Enter first name"
                  className={`mt-2 h-12 rounded-lg border ${
                    fieldState.error ? "border-red-500" : "border-[#E5E7EB]"
                  }`}
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

        {/* LAST NAME */}
        <div>
          <Label
            htmlFor="lastName"
            className="text-sm font-medium text-gray-500"
          >
            Last Name
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  id="lastName"
                  placeholder="Enter last name"
                  className={`mt-2 h-12 rounded-lg border ${
                    fieldState.error ? "border-red-500" : "border-[#E5E7EB]"
                  }`}
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

        {/* EMAIL */}
        <div>
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
                  }`}
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
        <div>
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-500"
          >
            Password
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <Controller
            name="password"
            control={control}
            render={({ field, fieldState }) => (
              <PasswordInput
                {...field}
                id="password"
                placeholder="Enter password"
                className="mt-2 h-12 rounded-lg"
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* CONFIRM PASSWORD */}
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
              <PasswordInput
                {...field}
                id="confirmPassword"
                placeholder="Confirm password"
                className="mt-2 h-12 rounded-lg"
                error={fieldState.error?.message}
              />
            )}
          />
        </div>

        {/* API ERROR MESSAGE */}
        {apiError && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {apiError}
          </div>
        )}

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
            {successMessage}
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <Button
          type="submit"
          className="w-full h-12 bg-[#E67E22] hover:bg-[#ea6a0a] rounded-lg font-semibold"
          disabled={isSubmitting || isRegistering}
        >
          {isSubmitting || isRegistering ? "Creating account..." : "Sign Up"}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[#E5E7EB]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-3 text-sm text-[#9CA3AF]">Or</span>
        </div>
      </div>

      {/* SOCIAL AUTH */}
      <div className="space-y-3">
        {/* GOOGLE */}
        <button
          type="button"
          className="w-full h-12 flex items-center justify-center gap-3 rounded border border-[#E5E7EB] bg-white text-[#374151] text-sm font-medium hover:bg-[#F9FAFB]"
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
          Sign up with Google
        </button>

        {/* APPLE */}
        <button
          type="button"
          className="w-full h-12 flex items-center justify-center gap-3 rounded border border-[#E5E7EB] bg-white text-[#374151] text-sm font-medium hover:bg-[#F9FAFB]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
            {/* Apple mark simplified */}
            <path
              d="M16.365 1.43c-.93.001-2.08.637-2.76.637-.67 0-1.73-.629-2.86-.615-1.48.016-2.86.855-3.63 2.16-1.55 2.57-.4 6.38 1.16 8.47.78 1.04 1.71 2.22 2.92 2.19 1.12-.03 1.55-.69 3.01-.69 1.46 0 1.85.69 3.01.67 1.37-.01 2.24-1.05 3.02-2.08.98-1.34 1.38-2.63 1.4-2.69-.03-.01-2.53-.97-2.56-3.84-.02-2.28 1.86-3.3 1.94-3.36-.99-1.44-2.53-1.62-3.06-1.64z"
              fill="currentColor"
            />
          </svg>
          Sign up with Apple
        </button>
      </div>
    </Card>
  );
}
