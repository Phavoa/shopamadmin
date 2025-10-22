import React from "react";

interface GlobalRulesProps {
  rules: string[];
}

export default function GlobalRules({ rules }: GlobalRulesProps) {
  return (
    <section
      aria-label="global-rules"
      className="mt-8 rounded-lg border border-gray-200 p-6 max-w-full shadow-none"
    >
      <h2 className="text-xl font-semibold text-slate-900 mb-4">
        Global Rules
      </h2>

      <ul className="list-disc pl-5 space-y-2 text-slate-600">
        {rules.map((rule, i) => (
          <li key={i} className="leading-6">
            {rule}
          </li>
        ))}
      </ul>
    </section>
  );
}
