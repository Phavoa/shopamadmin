"use client";

import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../lib/store/store";
import { useLazyGetAdminByIdQuery } from "../../api/adminApi";
import { updateUser } from "../../features/auth/authSlice";

/**
 * AuthInitializer handles fetching the enriched user profile (specifically the role)
 * from the specialized admin endpoint after login, as the basic login endpoint
 * may return a generic role.
 */
export const AuthInitializer = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [getAdminById] = useLazyGetAdminByIdQuery();
  
  // Track if we've already fetched the enriched profile for the current user session
  const lastFetchedId = useRef<string | null>(null);

  useEffect(() => {
    const fetchFullUser = async () => {
      // Only fetch if authenticated, has an ID, and we haven't fetched for this ID yet
      if (isAuthenticated && user?.id && lastFetchedId.current !== user.id) {
        try {
          console.log(`🔄 Fetching enriched profile for ${user.email} (ID: ${user.id})...`);
          
          const response = await getAdminById(user.id).unwrap();
          
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
        } catch (error) {
          console.error("❌ Failed to fetch enriched user profile:", error);
          // Don't retry indefinitely for the same ID if it fails once
          lastFetchedId.current = user.id;
        }
      } else if (!isAuthenticated) {
        // Reset tracker when user logs out
        lastFetchedId.current = null;
      }
    };

    fetchFullUser();
  }, [isAuthenticated, user, getAdminById, dispatch]);

  return <>{children}</>;
};
