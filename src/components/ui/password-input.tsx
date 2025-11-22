"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showToggle?: boolean;
  error?: string;
}

export function PasswordInput({
  showToggle = true,
  error,
  className = "",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={`pr-12 ${
          error ? "border-red-500" : "border-[#E5E7EB]"
        } ${className}`}
        {...props}
      />
      {showToggle && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
