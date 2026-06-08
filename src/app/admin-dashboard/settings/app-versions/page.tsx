"use client";

import React, { useState } from "react";
import { AppVersionSettings } from "@/components/admin/app-versions/AppVersionSettings";
import { Smartphone, Apple } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppVersionsPage() {
  const [activeTab, setActiveTab] = useState<"android" | "ios">("android");

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">App Versions & Maintenance</h1>
        <p className="text-muted-foreground">
          Enforce minimum app versions, push soft updates, and toggle maintenance mode for mobile clients.
        </p>
      </div>

      <div className="flex gap-4 border-b border-border pb-4 w-full max-w-md">
        <Button 
          variant={activeTab === "android" ? "default" : "outline"} 
          onClick={() => setActiveTab("android")}
          className="flex-1 flex items-center gap-2"
        >
          <Smartphone className="w-4 h-4" /> Android
        </Button>
        <Button 
          variant={activeTab === "ios" ? "default" : "outline"} 
          onClick={() => setActiveTab("ios")}
          className="flex-1 flex items-center gap-2"
        >
          <Apple className="w-4 h-4" /> iOS
        </Button>
      </div>
      
      <div className="mt-4">
        {activeTab === "android" && <AppVersionSettings platform="android" />}
        {activeTab === "ios" && <AppVersionSettings platform="ios" />}
      </div>
    </div>
  );
}
