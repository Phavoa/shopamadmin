"use client";

import React from "react";
import { RoleGuard } from "@/components/shared/RoleGuard";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RoleGuard allowedRoles={["SUPER_ADMIN", "ADMIN", "HUB_ADMIN"]}>{children}</RoleGuard>;
}
