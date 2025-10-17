import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Stream = {
  id: string;
  name: string;
  viewers: number;
  tier: "Bronze" | "Gold" | "Silver";
  live: boolean;
};

const streams: Stream[] = [
  { id: "s1", name: "Maxi Gadgets", viewers: 320, tier: "Bronze", live: true },
  { id: "s2", name: "TechHub", viewers: 210, tier: "Gold", live: true },
  { id: "s3", name: "Mary K Stores", viewers: 180, tier: "Gold", live: true },
  { id: "s4", name: "Phone City", viewers: 120, tier: "Gold", live: true },
];

function LiveStreamsCard() {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--card)]">
      <div className="p-[var(--space-lg)]">
        <h2 className="text-2xl font-semibold leading-[var(--text-h2-line)] text-black">
          Live Livestreams (New)
        </h2>
        <ul className="mt-2 divide-y divide-[var(--border)]">
          {streams.map((s) => (
            <li
              key={s.id}
              className="py-10 flex items-center justify-between h-16"
            >
              <div>
                <div className="text-base font-medium text-black leading-[var(--text-body-lg-line)]">
                  {s.name}
                </div>
                <div className="text-sm text-gray-600 leading-[var(--text-caption-line)] ]">
                  {s.viewers} viewers • {s.tier}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-[#CFFAE6] text-[#066A47] border-0 px-[10px] py-[4px] rounded-full text-[var(--text-caption-size)] font-[var(--text-caption-weight)]">
                  {s.live ? "Live" : "Offline"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--muted)]"
                  onClick={() => alert(`${s.name} — view clicked`)}
                >
                  View
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export { LiveStreamsCard };
