"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/store/store";
import { ShieldAlert, ArrowLeft } from "lucide-react";

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
  const [isChecking, setIsChecking] = useState(true);

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
        setIsAuthorized(false);
      }
      setIsChecking(false);
    }
  }, [user, isAuthenticated, router, allowedRoles, fallbackRoute]);

  if (!isAuthenticated) {
    return null;
  }

  if (isChecking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    const handleGoBack = () => {
      if (fallbackRoute) {
        router.push(fallbackRoute);
      } else if (user?.role === "HUB_ADMIN") {
        router.push("/logistics/lagos");
      } else if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
        router.push("/admin-dashboard");
      } else {
        router.push("/auth/login");
      }
    };

    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 w-full">
        <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl border border-gray-200/80 shadow-sm flex flex-col items-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            You do not have the required permissions to view this section. 
            This area is restricted to specific administrative roles.
          </p>
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors cursor-pointer text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go to Your Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
