// src/features/auth/authSelectors.ts
import { RootState } from "../../lib/store/store";

// Basic authentication check
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;

// Get current user
export const selectCurrentUser = (state: RootState) => state.auth.user;

// Get access token
export const selectAccessToken = (state: RootState) => state.auth.accessToken;

// Get refresh token
export const selectRefreshToken = (state: RootState) => state.auth.refreshToken;

// Check if token is expired (basic check - you might want to decode JWT)
export const selectIsTokenExpired = (state: RootState): boolean => {
  const token = state.auth.accessToken;
  if (!token) return true;

  try {
    // Basic JWT decode (you might want to use a proper JWT library)
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch {
    // If we can't decode, assume it's expired for safety
    return true;
  }
};

// Combined selector for authenticated state with token validation
export const selectIsAuthenticatedWithValidToken = (
  state: RootState
): boolean => state.auth.isAuthenticated && !selectIsTokenExpired(state);
