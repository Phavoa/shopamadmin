import React from "react";
import {
  useForm,
  Controller,
  Control,
  FieldValues,
  Path,
  RegisterOptions,
  DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Form field props
interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: string;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  error?: { message?: string };
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

// Individual form field component
export function FormField<T extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  control,
  rules,
  error,
  className = "",
  disabled = false,
  required = false,
}: FormFieldProps<T>) {
  return (
    <div className={className}>
      <Label htmlFor={name} className="text-sm font-medium text-gray-500">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              className={`mt-2 h-12 rounded-lg border ${
                fieldState.error ? "border-red-500" : "border-[#E5E7EB]"
              } ${fieldState.error ? "focus-visible:ring-red-500" : ""}`}
              disabled={disabled}
              {...field}
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
  );
}

// Password field with show/hide toggle
interface PasswordFieldProps<T extends FieldValues>
  extends Omit<FormFieldProps<T>, "type"> {
  showToggle?: boolean;
}

export function PasswordField<T extends FieldValues>({
  showToggle = true,
  ...props
}: PasswordFieldProps<T>) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className={props.className}>
      <Label htmlFor={props.name} className="text-sm font-medium text-gray-500">
        {props.label}
        {props.required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={props.name}
        control={props.control}
        rules={props.rules}
        render={({ field, fieldState }) => (
          <div className="relative mt-2">
            <Input
              id={props.name}
              type={showToggle && showPassword ? "text" : "password"}
              placeholder={props.placeholder}
              className={`h-12 pr-12 rounded-lg border ${
                fieldState.error ? "border-red-500" : "border-[#E5E7EB]"
              } ${fieldState.error ? "focus-visible:ring-red-500" : ""}`}
              disabled={props.disabled}
              {...field}
            />
            {showToggle && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center px-2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            )}
            {fieldState.error && (
              <p className="mt-1 text-sm text-red-600">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
}

// Note: Main Form wrapper component removed as it was unused and causing TypeScript issues
// The existing auth forms use direct useForm hooks which work correctly

// Error display component
export function FormError({ error }: { error?: string }) {
  if (!error) return null;

  return (
    <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
      {error}
    </div>
  );
}

// Success display component
export function FormSuccess({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <div className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
      {message}
    </div>
  );
}
