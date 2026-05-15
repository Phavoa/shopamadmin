"use client";

import React from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";

export default function LogisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["SUPER_ADMIN", "HUB_ADMIN", "ADMIN"]}>
      {children}
    </RoleGuard>
  );
}
