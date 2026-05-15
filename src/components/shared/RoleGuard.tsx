"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store/store";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackRoute?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  fallbackRoute,
}) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log("🔒 RoleGuard Check:", {
      isAuthenticated,
      role: user?.role,
      user,
    });

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user && user.role) {
      if (allowedRoles.includes(user.role)) {
        setIsAuthorized(true);
      } else {
        if (fallbackRoute) {
          router.push(fallbackRoute);
        } else {
          if (user.role === "HUB_ADMIN") {
            router.push("/logistics/lagos");
          } else if (user.role === "ADMIN") {
            router.push("/admin-dashboard");
          } else {
            router.push("/auth/login");
          }
        }
      }
    }
  }, [user, isAuthenticated, router, allowedRoles, fallbackRoute]);

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};
