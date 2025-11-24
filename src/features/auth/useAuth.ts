// src/features/auth/useAuth.ts
import { useSelector } from "react-redux";
import {
  selectAccessToken,
  selectCurrentUser,
  selectIsAuthenticated,
  selectIsAuthenticatedWithValidToken,
  selectIsTokenExpired,
  selectRefreshToken,
} from "./authSelectors";

export const useAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAuthenticatedWithValidToken = useSelector(
    selectIsAuthenticatedWithValidToken
  );
  const user = useSelector(selectCurrentUser);
  const accessToken = useSelector(selectAccessToken);
  const refreshToken = useSelector(selectRefreshToken);
  const isTokenExpired = useSelector(selectIsTokenExpired);

  return {
    // Basic authentication state
    isAuthenticated,
    user,

    // Token information
    accessToken,
    refreshToken,

    // Advanced checks
    isAuthenticatedWithValidToken,
    isTokenExpired,

    // Computed properties
    isLoggedIn: isAuthenticatedWithValidToken,
    hasValidToken: !isTokenExpired && !!accessToken,
  };
};
