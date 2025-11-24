import { SellerProfile } from "./user";

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  isDefault: boolean;
  deliveryZoneId?: string;
  deliveryZone?: {
    id: string;
    code: string;
    name: string;
  };
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  imageUrl: string | null;
  isVerified: boolean;
  role: string;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
  defaultAddress?: Address;
  followersCount?: number;
  followingCount?: number;
  followers?: string[];
  following?: string[];
  blocks?: string[];
  blockedBy?: string[];
  seller?: SellerProfile | null;
}

export interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// API Request Types
export interface RegisterRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RequestOtpRequest {
  destination: string;
  purpose: "SIGNUP" | "RESET";
}

export interface VerifyOtpRequest {
  destination: string;
  purpose: "SIGNUP" | "RESET";
  code: string;
}

export interface ForgotPasswordRequest {
  destination: string;
}

export interface ResetPasswordRequest {
  destination: string;
  resetToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface LogoutAllRequest {
  userId: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

// API Response Types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  message: string;
  data: T;
  statusCode: number;
}

export interface RegisterResponse {
  next: "VERIFY_OTP";
  destination: string;
  expiresAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface OtpResponse {
  expiresAt: string;
}

export interface VerifyOtpSignupResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface VerifyOtpResetResponse {
  resetToken: string;
  expiresAt: string;
}

export interface ForgotPasswordResponse {
  next: "ENTER_OTP";
  expiresAt: string;
}

export interface ResetPasswordResponse {
  ok: boolean;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LogoutAllResponse {
  ok: boolean;
}

export interface OAuthResponse {
  ok: boolean;
  todo: string;
}
