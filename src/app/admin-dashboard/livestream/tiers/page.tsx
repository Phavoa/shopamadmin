"use client";
import React, { useState } from "react";

// This file is a self-contained Next/React component written in TypeScript
// Stack: Next.js (React), Tailwind CSS, shadcn/ui component primitives
// Save as: app/(admin)/tiers/page.tsx or pages/tiers-and-rules.tsx depending on your Next.js setup

import TierCard from "@/components/tiers/TierCard";
import EditTierModal from "@/components/tiers/EditTierModal";
import GlobalRules from "@/components/tiers/GlobalRules";

type Tier = {
  id: string;
  title: string;
  subtitle?: string;
  meta: string[];
};

const DEFAULT_TIERS: Tier[] = [
  {
    id: "beginner",
    title: "Beginner (Scenario A)",
    subtitle: "Unlock threshold: auto (new sellers)",
    meta: ["Viewer cap: 50", "Duration: 70 mins"],
  },
  {
    id: "bronze",
    title: "Bronze (Scenario B)",
    subtitle: "Unlock threshold: after ₦5,000,000 sales",
    meta: ["Viewer cap: 150", "Duration: 70 mins"],
  },
  {
    id: "gold",
    title: "Gold (Scenario C)",
    subtitle: "Unlock threshold: after ₦20,000,000 sales",
    meta: ["Viewer cap: 3000", "Duration: 70 mins"],
  },
];

const GLOBAL_RULES = [
  "Start window: 7:30 to 9:30 Sundays",
  "One scheduled slot per seller per week (groups allowed if on slot)",
  "Pop-up streams: 60 mins, cap 20 viewers",
  "No-show: auto-release at 7:10, add 1 strike",
  "Penalty: 2 strikes in 30 days → booking cooldown 7 days",
  "Standby sellers: auto-notify if a slot is released",
  "Admin override: can set tier and cap for any seller",
];

export default function TiersAndRulesPage() {
  const [tiers, setTiers] = useState<Tier[]>(DEFAULT_TIERS);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (id: string) => {
    const tier = tiers.find((t) => t.id === id);
    if (tier) {
      setEditingTier(tier);
      setIsModalOpen(true);
    }
  };

  const handleReset = (id: string) => {
    const defaultTier = DEFAULT_TIERS.find((t) => t.id === id);
    if (defaultTier) {
      setTiers((prev) =>
        prev.map((t) => (t.id === id ? { ...defaultTier } : t))
      );
    }
  };

  const handleSaveTier = (updatedTier: Tier) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === updatedTier.id ? updatedTier : t))
    );
  };

  return (
    <main className=" px-6 pt-8 pb-16 font-sans" aria-label="main-content">
      {/* Tiers grid */}
      <section aria-labelledby="tiers-heading">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tiers.map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              onEdit={handleEdit}
              onReset={handleReset}
            />
          ))}
        </div>
      </section>

      <GlobalRules rules={GLOBAL_RULES} />

      <EditTierModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tier={editingTier}
        onSave={handleSaveTier}
      />
    </main>
  );
}
