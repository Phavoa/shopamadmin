import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RequestOtpRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshRequest,
  LogoutAllRequest,
  LogoutAllResponse,
  ApiResponse,
  OtpResponse,
  VerifyOtpSignupResponse,
  VerifyOtpResetResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  RefreshResponse,
  User,
} from "../types/auth";
import {
  setCredentials,
  clearCredentials,
  updateUser,
} from "../features/auth/authSlice";
import { authStorage, handleApiError } from "../lib/auth/authUtils";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://shapam-ecomerce-backend.onrender.com/api";

/**
 * Base query with authentication
 */
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = authStorage.getAccessToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    headers.set("content-type", "application/json");
    return headers;
  },
});

/**
 * Base query with reauthentication
 */
const baseQueryWithReauth = async (
  args: Parameters<typeof baseQuery>[0],
  api: Parameters<typeof baseQuery>[1],
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Try to refresh token
    const refreshToken = authStorage.getRefreshToken();
    if (refreshToken) {
      try {
        const refreshResult = await baseQuery(
          {
            url: "/auth/refresh",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult?.data && typeof refreshResult.data === "object") {
          const refreshData = refreshResult.data as {
            accessToken: string;
            refreshToken?: string;
          };

          // Store new tokens in localStorage
          authStorage.setTokens(
            refreshData.accessToken,
            refreshData.refreshToken
          );

          // Update Redux state
          api.dispatch(
            setCredentials({
              accessToken: refreshData.accessToken,
              refreshToken: refreshData.refreshToken,
            })
          );

          // Retry the original query
          result = await baseQuery(args, api, extraOptions);
          return result;
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    }

    // If refresh failed or no refresh token, logout
    if (result?.error?.status === 401) {
      authStorage.clearTokens();
      api.dispatch(clearCredentials());
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "User"],
  endpoints: (builder) => ({
    // Login user
    login: builder.mutation<ApiResponse<LoginResponse>, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data.accessToken) {
            authStorage.setTokens(
              data.data.accessToken,
              data.data.refreshToken
            );
            dispatch(
              setCredentials({
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
                user: data.data.user,
              })
            );
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // Register new user
    register: builder.mutation<ApiResponse<RegisterResponse>, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Request OTP
    requestOtp: builder.mutation<ApiResponse<OtpResponse>, RequestOtpRequest>({
      query: (request) => ({
        url: "/auth/request-otp",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Verify OTP
    verifyOtp: builder.mutation<
      ApiResponse<VerifyOtpSignupResponse | VerifyOtpResetResponse>,
      VerifyOtpRequest
    >({
      query: (request) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: request,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // If it's a signup verification and returns tokens, store them
          if (arg.purpose === "SIGNUP" && data.data) {
            const responseData = data.data as VerifyOtpSignupResponse;
            if (responseData.accessToken) {
              authStorage.setTokens(
                responseData.accessToken,
                responseData.refreshToken
              );
              dispatch(
                setCredentials({
                  accessToken: responseData.accessToken,
                  refreshToken: responseData.refreshToken,
                  user: responseData.user,
                })
              );
            }
          }
        } catch (error) {
          console.error("OTP verification failed:", error);
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // Forgot password
    forgotPassword: builder.mutation<
      ApiResponse<ForgotPasswordResponse>,
      ForgotPasswordRequest
    >({
      query: (request) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Reset password
    resetPassword: builder.mutation<
      ApiResponse<ResetPasswordResponse>,
      ResetPasswordRequest
    >({
      query: (request) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: request,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Refresh token
    refreshToken: builder.mutation<
      ApiResponse<RefreshResponse>,
      RefreshRequest
    >({
      query: (request) => ({
        url: "/auth/refresh",
        method: "POST",
        body: request,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data.accessToken) {
            authStorage.setTokens(
              data.data.accessToken,
              data.data.refreshToken
            );
            dispatch(
              setCredentials({
                accessToken: data.data.accessToken,
                refreshToken: data.data.refreshToken,
              })
            );
          }
        } catch (error) {
          console.error("Token refresh failed:", error);
        }
      },
      invalidatesTags: ["Auth"],
    }),

    // Logout
    logout: builder.mutation<ApiResponse<{ ok: boolean }>, void>({
      query: () => ({
        url: "/auth/logout-all",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Logout request failed:", error);
        } finally {
          // Always clear local storage and Redux state using authStorage utility
          authStorage.clearTokens();
          dispatch(clearCredentials());
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // Logout from all devices
    logoutAll: builder.mutation<
      ApiResponse<LogoutAllResponse>,
      LogoutAllRequest
    >({
      query: (request) => ({
        url: "/auth/logout-all",
        method: "POST",
        body: request,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Logout all request failed:", error);
        } finally {
          // Always clear local storage and Redux state using authStorage utility
          authStorage.clearTokens();
          dispatch(clearCredentials());
        }
      },
      invalidatesTags: ["Auth", "User"],
    }),

    // Get current user
    getCurrentUser: builder.query<ApiResponse<User>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<ApiResponse<User>, Partial<User>>({
      query: (userData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateUser(data.data));
        } catch (error) {
          console.error("Profile update failed:", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    // Change password
    changePassword: builder.mutation<
      ApiResponse<{ ok: boolean }>,
      { currentPassword: string; newPassword: string; confirmPassword: string }
    >({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Verify token
    verifyToken: builder.query<boolean, void>({
      query: () => ({
        url: "/auth/verify",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<{ ok: boolean }>) => {
        return response.data?.ok ?? false;
      },
      providesTags: ["Auth"],
    }),
  }),
});

// EXPORT ALL HOOKS
export const {
  useLoginMutation,
  useRegisterMutation,
  useRequestOtpMutation,
  useVerifyOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useLogoutAllMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useVerifyTokenQuery,
  useLazyVerifyTokenQuery,
} = authApi;
