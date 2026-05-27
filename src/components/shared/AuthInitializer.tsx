"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/store/store";
import { useLazyGetAdminMeQuery } from "../../api/adminApi";
import { updateUser, clearCredentials } from "../../features/auth/authSlice";
import { authStorage } from "../../lib/auth/authUtils";

/**
 * AuthInitializer handles fetching the enriched user profile (specifically the role)
 * from the specialized admin /me endpoint after login, automatically resolving
 * the admin profile using the JWT token without needing an ID parameter.
 */
export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [getAdminMe] = useLazyGetAdminMeQuery();
  
  // Track if we've already fetched the enriched profile for the current user session
  const lastFetchedId = useRef<string | null>(null);

  useEffect(() => {
    const fetchFullUser = async () => {
      // Only fetch if authenticated, has an ID, and we haven't fetched for this ID yet
      if (isAuthenticated && user?.id && lastFetchedId.current !== user.id) {
        try {
          console.log(`🔄 Fetching enriched profile for ${user.email} (ID: ${user.id})...`);
          
          const response = await getAdminMe().unwrap();
          
          if (response.data) {
            console.log("📥 FULL ENRICHED PROFILE RESPONSE:", response.data);
            console.log("✅ Verified Role from Admin Endpoint:", response.data.role);
            
            lastFetchedId.current = user.id;
            
            // Update the user in Redux with the verified data from the admin endpoint
            dispatch(updateUser({
              ...user,
              role: response.data.role,
              firstName: response.data.firstName,
              lastName: response.data.lastName,
            }));
          }
        } catch (error: any) {
          console.error("❌ Failed to fetch enriched user profile:", error);
          // Don't retry indefinitely for the same ID if it fails once
          lastFetchedId.current = user.id;

          // ⚠️ 404 Not Found Handling:
          // If a non-admin user logs in, the endpoint returns a 404.
          // In this case, log them out and redirect to login page.
          if (error?.status === 404) {
            alert("Access Denied: You do not have administrative privileges.");
            authStorage.clearTokens();
            dispatch(clearCredentials());
            window.location.href = "/auth/login";
          }
        }
      } else if (!isAuthenticated) {
        // Reset tracker when user logs out
        lastFetchedId.current = null;
      }
    };

    fetchFullUser();
  }, [isAuthenticated, user, getAdminMe, dispatch]);

  return <>{children}</>;
};
