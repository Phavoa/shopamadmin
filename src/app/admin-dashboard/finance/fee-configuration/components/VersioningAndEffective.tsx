import React from "react";

interface VersioningAndEffectiveProps {
  effectiveDate: string;
  gracePeriod: string;
  whoCanPublish: string;
  setEffectiveDate: (val: string) => void;
  setGracePeriod: (val: string) => void;
  setWhoCanPublish: (val: string) => void;
}

export const VersioningAndEffective: React.FC<VersioningAndEffectiveProps> = ({
  effectiveDate,
  gracePeriod,
  whoCanPublish,
  setEffectiveDate,
  setGracePeriod,
  setWhoCanPublish,
}) => {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "18px",
        border: "0.3px solid rgba(0, 0, 0, 0.20)",
        background: "#FFF",
      }}
    >
      <h2 className="text-base font-semibold text-black mb-6">
        Effective Date and Versioning
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-black block mb-2">
            Effective from:
          </label>
          <input
            type="text"
            value={effectiveDate}
            onChange={(e) => setEffectiveDate(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label className="text-sm text-black block mb-2">
            Grace period (days):
          </label>
          <input
            type="text"
            value={gracePeriod}
            onChange={(e) => setGracePeriod(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              fontSize: "14px",
              outline: "none",
            }}
          />
        </div>

        <div>
          <label className="text-sm text-black block mb-2">
            Who can publish:
          </label>
          <select
            value={whoCanPublish}
            onChange={(e) => setWhoCanPublish(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              fontSize: "14px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="FINANCE_ADMIN">Finance Admins Only</option>
            <option value="ADMIN">All Admins</option>
            <option value="SUPER_ADMIN">Super Admins</option>
          </select>
        </div>
      </div>
    </div>
  );
};
