import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

type Tier = {
  id: string;
  title: string;
  subtitle?: string;
  meta: string[];
};

interface TierCardProps {
  tier: Tier;
  onEdit: (id: string) => void;
  onReset: (id: string) => void;
}

export default function TierCard({ tier, onEdit, onReset }: TierCardProps) {
  return (
    <Card
      className="group flex flex-col justify-between py-5 px-6 rounded-lg border border-gray-200 shadow-card bg-transparent hover:shadow-lg transition-shadow"
      role="group"
      aria-label={`tier-card-${tier.id}`}
    >
      <div>
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-semibold text-slate-900">
            {tier.title}
          </CardTitle>
          {tier.subtitle && (
            <CardDescription className="text-sm text-slate-600 mt-2">
              {tier.subtitle}
            </CardDescription>
          )}
        </CardHeader>

        <CardContent className="p-0 mt-1">
          <ul className="flex flex-col text-sm text-slate-600">
            {tier.meta.map((m, idx) => (
              <li key={idx} className="leading-6">
                {m}
              </li>
            ))}
          </ul>
        </CardContent>
      </div>

      <CardFooter className="p-0 mt-2 flex gap-3">
        <Button
          variant="default"
          onClick={() => onEdit(tier.id)}
          className="bg-[#E67A2B] hover:bg-[#D86A1F] text-white min-w-[110px] py-2 rounded-sm shadow-sm"
          aria-label={`edit-${tier.id}`}
        >
          Edit
        </Button>

        <Button
          variant="outline"
          onClick={() => onReset(tier.id)}
          className="min-w-[120px] py-2 rounded-sm border border-[#E67A2B] text-[#E67A2B] hover:bg-[#FFF4E9] hover:border-[#D86A1F] hover:text-[#D86A1F]"
          aria-label={`reset-${tier.id}`}
        >
          Reset to Default
        </Button>
      </CardFooter>
    </Card>
  );
}
