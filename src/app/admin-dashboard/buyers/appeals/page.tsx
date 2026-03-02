"use client";

import React, { useState, useEffect } from "react";
import {
  useGetDisciplineRecordsQuery,
  useAppealDecisionMutation,
  fetchUserById,
  DisciplineRecord,
} from "@/api/disciplineApi";

const DocumentIcon = () => (
  <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.96 5.415L10.71 0.165C10.6046 0.0594807 10.4616 0.000131289 10.3125 0H1.3125C0.964403 0 0.630564 0.138281 0.384422 0.384422C0.138281 0.630564 0 0.964403 0 1.3125V17.8125C0 18.1606 0.138281 18.4944 0.384422 18.7406C0.630564 18.9867 0.964403 19.125 1.3125 19.125H14.8125C15.1606 19.125 15.4944 18.9867 15.7406 18.7406C15.9867 18.4944 16.125 18.1606 16.125 17.8125V5.8125C16.1249 5.66337 16.0655 5.52039 15.96 5.415ZM10.875 1.92L14.205 5.25H10.875V1.92ZM14.8125 18H1.3125C1.26277 18 1.21508 17.9802 1.17992 17.9451C1.14475 17.9099 1.125 17.8622 1.125 17.8125V1.3125C1.125 1.26277 1.14475 1.21508 1.17992 1.17992C1.21508 1.14475 1.26277 1.125 1.3125 1.125H9.75V5.8125C9.75 5.96168 9.80926 6.10476 9.91475 6.21025C10.0202 6.31574 10.1633 6.375 10.3125 6.375H15V17.8125C15 17.8622 14.9802 17.9099 14.9451 17.9451C14.9099 17.9802 14.8622 18 14.8125 18ZM11.625 10.3125C11.625 10.4617 11.5657 10.6048 11.4602 10.7102C11.3548 10.8157 11.2117 10.875 11.0625 10.875H5.0625C4.91332 10.875 4.77024 10.8157 4.66475 10.7102C4.55926 10.6048 4.5 10.4617 4.5 10.3125C4.5 10.1633 4.55926 10.0202 4.66475 9.91475C4.77024 9.80926 4.91332 9.75 5.0625 9.75H11.0625C11.2117 9.75 11.3548 9.80926 11.4602 9.91475C11.5657 10.0202 11.625 10.1633 11.625 10.3125ZM11.625 13.3125C11.625 13.4617 11.5657 13.6048 11.4602 13.7102C11.3548 13.8157 11.2117 13.875 11.0625 13.875H5.0625C4.91332 13.875 4.77024 13.8157 4.66475 13.7102C4.55926 13.6048 4.5 13.4617 4.5 13.3125C4.5 13.1633 4.55926 13.0202 4.66475 12.9148C4.77024 12.8093 4.91332 12.75 5.0625 12.75H11.0625C11.2117 12.75 11.3548 12.8093 11.4602 12.9148C11.5657 13.0202 11.625 13.1633 11.625 13.3125Z" fill="black"/>
  </svg>
);

interface EnrichedAppeal extends DisciplineRecord {
  resolvedName: string;
  resolvedEmail: string;
}

const BuyerAppealsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [decisionNote, setDecisionNote] = useState("");
  const [selectedDecision, setSelectedDecision] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [enrichedAppeals, setEnrichedAppeals] = useState<EnrichedAppeal[]>([]);
  const [enriching, setEnriching] = useState(false);

  const { data, isLoading, isError, refetch } = useGetDisciplineRecordsQuery({
    role: "BUYER",
    sortBy: "createdAt",
    sortDir: "desc",
    limit: 100, // Fetch more to filter on frontend
  });

  const [appealDecision, { isLoading: isDeciding }] = useAppealDecisionMutation();
  // Filter for records that have an appeal or are specifically of type APPEAL
  const rawAppeals = (data?.data?.items ?? []).filter(
    (r) => r.type === "APPEAL" || r.appealText
  );

  // ✅ Enrich with real user names
  useEffect(() => {
    if (!rawAppeals.length) { setEnrichedAppeals([]); return; }

    const enrich = async () => {
      setEnriching(true);
      const enriched = await Promise.all(
        rawAppeals.map(async (appeal) => {
          let firstName = appeal.user?.firstName;
          let lastName = appeal.user?.lastName;
          let email = appeal.user?.email ?? "N/A";

          if (!firstName || !lastName) {
            const fetched = await fetchUserById(appeal.userId);
            firstName = fetched.firstName;
            lastName = fetched.lastName;
            email = fetched.email;
          }

          return {
            ...appeal,
            resolvedName: `${firstName} ${lastName}`,
            resolvedEmail: email,
          };
        })
      );
      setEnrichedAppeals(enriched);
      setEnriching(false);
    };

    enrich();
  }, [data]);

  const selectedAppeal = enrichedAppeals.find((a) => a.id === selectedId) ?? enrichedAppeals[0] ?? null;

  const getActionLabel = (record: DisciplineRecord) =>
    record.type === "SUSPENSION" ? "Suspended" : "Strike";

  const getDaysAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days}d ago`;
  };

  const handleDecision = async (decision: "APPROVED" | "REJECTED") => {
    if (!selectedAppeal) return;
    try {
      await appealDecision({
        actionId: selectedAppeal.id,
        data: { appealStatus: decision, adminNote: decisionNote || adminNote || "Decision recorded by admin." },
      }).unwrap();
      setDecisionNote("");
      setAdminNote("");
      refetch();
    } catch (err) {
      console.error("Appeal decision failed:", err);
    }
  };

  const loading = isLoading || enriching;

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-6">
      <h1 className="text-2xl font-semibold mb-6">Buyer Appeals and Investigations</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left - Appeals Inbox */}
        <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ borderRadius: "18px" }}>
          <h2 className="text-lg font-semibold mb-4">Appeals Inbox</h2>

          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />)}
            </div>
          )}
          {isError && <p className="text-red-500 text-sm">Failed to load appeals. <button onClick={refetch} className="underline">Retry</button></p>}
          {!loading && !isError && enrichedAppeals.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">No pending appeals.</p>
          )}

          <div className="space-y-3">
            {enrichedAppeals.map((appeal) => (
              <div
                key={appeal.id}
                onClick={() => setSelectedId(appeal.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedId === appeal.id || (!selectedId && appeal === enrichedAppeals[0])
                    ? "border-[#E67E22] bg-[#FFF3E0]"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-sm">{appeal.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">
                      {appeal.resolvedName} • {getActionLabel(appeal)} • {getDaysAgo(appeal.createdAt)}
                    </p>
                  </div>
                  <button className={`px-3 py-1 rounded-lg text-xs font-medium border ${
                    appeal.appealStatus === "APPROVED" 
                      ? "bg-green-100 text-green-700 border-green-200" 
                      : appeal.appealStatus === "REJECTED"
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}>
                    {appeal.appealStatus ? (appeal.appealStatus === "APPROVED" ? "Approved" : "Rejected") : "Review"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right - Case Detail */}
        {selectedAppeal ? (
          <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ borderRadius: "18px" }}>
            <h2 className="text-lg font-semibold mb-4">Case Detail: {selectedAppeal.id.slice(-8).toUpperCase()}</h2>

            <div className="space-y-4">
              <div className="text-sm">
                <p>
                  <strong>Buyer:</strong> {selectedAppeal.resolvedName} |{" "}
                  <strong>Action Appealed:</strong> {getActionLabel(selectedAppeal)} |{" "}
                  <strong>Issued:</strong> {getDaysAgo(selectedAppeal.createdAt)}
                </p>
                <p className="mt-2"><strong>Reason:</strong> {selectedAppeal.reason}</p>
                <p className="mt-2">
                  <strong>Status:</strong> {selectedAppeal.appealStatus ?? "Pending Review"} |{" "}
                  <strong>SLA:</strong> 24h to respond
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Buyer Statement</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                  <p>{selectedAppeal.appealText ?? "No statement provided."}</p>
                </div>
              </div>

              {selectedAppeal.evidence && selectedAppeal.evidence.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm mb-2">Attachments</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedAppeal.evidence.map((url, index) => (
                      <div key={index} className="text-center">
                        <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                          <DocumentIcon />
                        </div>
                        <p className="text-xs text-gray-600">Evidence {index + 1}</p>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E67E22] mt-1 block">View</a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-sm mb-2">Add Admin Notes</label>
                <textarea value={adminNote} onChange={(e) => setAdminNote(e.target.value)} placeholder="Add a note, e.g., verified incident via support logs" className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none" />
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Decision</h3>
                <p className="text-xs text-gray-500 mb-3">Choose Outcome</p>
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setSelectedDecision("APPROVED")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white border-2 ${selectedDecision === "APPROVED" ? "border-white ring-2 ring-green-400" : "border-transparent"}`}
                    style={{ background: "#E67E22" }}
                  >Approve Appeal</button>
                  <button
                    onClick={() => setSelectedDecision("REJECTED")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-white border-2 ${selectedDecision === "REJECTED" ? "border-white ring-2 ring-red-400" : "border-transparent"}`}
                    style={{ background: "#E67E22" }}
                  >Deny Appeal</button>
                  <button
                    onClick={() => setSelectedDecision("REJECTED")}
                    className="px-4 py-2 rounded-lg text-sm font-medium"
                    style={{ background: "#FFF3E0", color: "#E67E22", border: "1px solid #E67E22" }}
                  >Uphold Decision</button>
                </div>
                {selectedDecision && (
                  <p className="text-xs mb-2 font-medium" style={{ color: selectedDecision === "APPROVED" ? "#10B981" : "#EF4444" }}>
                    Selected: {selectedDecision === "APPROVED" ? "✓ Approve Appeal" : "✗ Deny Appeal — suspension remains active"}
                  </p>
                )}
                <textarea value={decisionNote} onChange={(e) => setDecisionNote(e.target.value)} placeholder="Add a decision note, e.g., verified incident via support logs" className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none mb-3" />
                <div className="flex gap-3">
                  <button
                    onClick={() => selectedDecision && handleDecision(selectedDecision)}
                    disabled={isDeciding || !selectedDecision}
                    className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                    style={{ background: "#E67E22" }}
                  >{isDeciding ? "Submitting..." : "Submit Decision"}</button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#F5F5F5", color: "#374151", border: "1px solid #D1D5DB" }}>Save as Draft</button>
                  <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#FFF3E0", color: "#E67E22", border: "1px solid #E67E22" }}>Request more evidence</button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-2">Audit Trail</h3>
                <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 space-y-1">
                  <p>{new Date(selectedAppeal.createdAt).toLocaleString()} — Appeal submitted by buyer</p>
                  {selectedAppeal.updatedAt !== selectedAppeal.createdAt && (
                    <p>{new Date(selectedAppeal.updatedAt).toLocaleString()} — Record updated</p>
                  )}
                  {selectedAppeal.adminNote && <p>Admin note: {selectedAppeal.adminNote}</p>}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center" style={{ borderRadius: "18px", minHeight: "400px" }}>
            <p className="text-gray-500">Select an appeal to view details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerAppealsPage;