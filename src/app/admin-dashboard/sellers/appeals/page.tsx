"use client";

import React, { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import {
  useGetDisciplineRecordsQuery,
  useAppealDecisionMutation,
  fetchUserById,
  DisciplineRecord,
} from "@/api/disciplineApi";

interface EnrichedAppeal extends DisciplineRecord {
  resolvedName: string;
  resolvedEmail: string;
}

const SellerAppealsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [selectedDecision, setSelectedDecision] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [enrichedAppeals, setEnrichedAppeals] = useState<EnrichedAppeal[]>([]);
  const [enriching, setEnriching] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceNote, setEvidenceNote] = useState("");
  const [isRequestingEvidence, setIsRequestingEvidence] = useState(false);

  const { data, isLoading, isError, refetch } = useGetDisciplineRecordsQuery({
    role: "SELLER",
    sortBy: "createdAt",
    sortDir: "desc",
    limit: 100,
  });

  const [appealDecision, { isLoading: isDeciding }] = useAppealDecisionMutation();

  const rawAppeals = (data?.data?.items ?? []).filter(
    (r) => r.type === "APPEAL" || r.appealText
  );

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

          return { ...appeal, resolvedName: `${firstName} ${lastName}`, resolvedEmail: email };
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
    if (!selectedAppeal || !decisionNote.trim()) return;
    try {
      await appealDecision({ actionId: selectedAppeal.id, data: { appealStatus: decision, adminNote: decisionNote } }).unwrap();
      setDecisionNote("");
      refetch();
    } catch (err) {
      console.error("Appeal decision failed:", err);
    }
  };

  const handleRequestEvidence = async () => {
    if (!selectedAppeal || !evidenceNote.trim()) return;
    setIsRequestingEvidence(true);
    try {
      await appealDecision({
        actionId: selectedAppeal.id,
        data: {
          appealStatus: "PENDING",
          adminNote: `[Evidence Requested] ${evidenceNote.trim()}`,
        },
      }).unwrap();
      setEvidenceNote("");
      setShowEvidenceModal(false);
      refetch();
    } catch (err) {
      console.error("Request evidence failed:", err);
    } finally {
      setIsRequestingEvidence(false);
    }
  };

  const loading = isLoading || enriching;

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB] p-6">
        <h1 className="text-2xl font-semibold mb-6">Seller Appeals and Investigations</h1>

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
              <p className="text-gray-400 text-sm text-center py-8">No pending seller appeals.</p>
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
                    <strong>Seller:</strong> {selectedAppeal.resolvedName} |{" "}
                    <strong>Action Appealed:</strong> {getActionLabel(selectedAppeal)} |{" "}
                    <strong>Issued on:</strong> {new Date(selectedAppeal.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mt-2">
                    <strong>Status:</strong> {selectedAppeal.appealStatus ?? "Awaiting review"} |{" "}
                    <strong>SLA:</strong> 24h to respond
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Seller Statement</h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                    <p>{selectedAppeal.appealText ?? "No statement provided."}</p>
                  </div>
                </div>

                {selectedAppeal.adminNote && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Previous Admin Notes</h3>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                      <p>{selectedAppeal.adminNote}</p>
                    </div>
                  </div>
                )}

                {selectedAppeal.evidence && selectedAppeal.evidence.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Attachments</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {selectedAppeal.evidence.map((url, index) => (
                        <div key={index} className="text-center">
                          <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                            <FileText className="w-8 h-8 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-600">Evidence {index + 1}</p>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#E67E22] mt-1 block">View</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-sm mb-2">Decision</h3>
                  <p className="text-xs text-gray-500 mb-3">Choose Outcome</p>
                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setSelectedDecision("APPROVED")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium text-white border-2 ${selectedDecision === "APPROVED" ? "border-white ring-2 ring-green-400" : "border-transparent"}`}
                      style={{ background: "#E67E22" }}
                    >Remove Strike</button>
                    <button
                      onClick={() => setSelectedDecision("REJECTED")}
                      className={`px-4 py-2 rounded-lg text-sm font-medium text-white border-2 ${selectedDecision === "REJECTED" ? "border-white ring-2 ring-red-400" : "border-transparent"}`}
                      style={{ background: "#E67E22" }}
                    >Deny Appeal</button>
                    <button
                      onClick={() => setSelectedDecision("REJECTED")}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ background: "#FFF3E0", color: "#E67E22", border: "1px solid #E67E22" }}
                    >Uphold Strike</button>
                  </div>
                  {selectedDecision && (
                    <p className="text-xs mb-2 font-medium" style={{ color: selectedDecision === "APPROVED" ? "#10B981" : "#EF4444" }}>
                      Selected: {selectedDecision === "APPROVED" ? "✓ Remove Strike" : "✗ Deny Appeal — suspension remains active"}
                    </p>
                  )}
                  <textarea value={decisionNote} onChange={(e) => setDecisionNote(e.target.value)} placeholder="Add a decision note (required to submit)" className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none mb-3" />
                  <div className="flex gap-3">
                    <button
                      onClick={() => selectedDecision && handleDecision(selectedDecision)}
                      disabled={isDeciding || !selectedDecision || !decisionNote.trim()}
                      className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                      style={{ background: "#E67E22" }}
                    >{isDeciding ? "Submitting..." : "Submit Decision"}</button>
                    <button className="px-4 py-2 rounded-lg text-sm font-medium" style={{ background: "#F5F5F5", color: "#374151", border: "1px solid #D1D5DB" }}>Save as Draft</button>
                    <button
                      onClick={() => setShowEvidenceModal(true)}
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ background: "#FFF3E0", color: "#E67E22", border: "1px solid #E67E22" }}
                    >Request more evidence</button>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm mb-2">Audit Trail</h3>
                  <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 space-y-1">
                    <p>{new Date(selectedAppeal.createdAt).toLocaleString()} — Appeal submitted by seller</p>
                    {selectedAppeal.updatedAt !== selectedAppeal.createdAt && (
                      <p>{new Date(selectedAppeal.updatedAt).toLocaleString()} — Record updated</p>
                    )}
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

      {/* Request More Evidence Modal */}
      {showEvidenceModal && (
        <div
          style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowEvidenceModal(false); }}
        >
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Request More Evidence</h2>
              <button onClick={() => setShowEvidenceModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Specify what additional evidence or documentation you need the seller to provide for this appeal.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600">
              <p><span className="font-medium">Appeal:</span> {selectedAppeal?.id.slice(-8).toUpperCase()}</p>
              <p><span className="font-medium">Seller:</span> {selectedAppeal?.resolvedName}</p>
            </div>
            <textarea
              value={evidenceNote}
              onChange={(e) => setEvidenceNote(e.target.value)}
              rows={4}
              placeholder="e.g. Please provide receipts, screenshots, or any supporting documents that substantiate your appeal..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEvidenceModal(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300"
                style={{ background: "#F5F5F5", color: "#374151" }}
              >Cancel</button>
              <button
                onClick={handleRequestEvidence}
                disabled={isRequestingEvidence || !evidenceNote.trim()}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "#E67E22" }}
              >{isRequestingEvidence ? "Sending..." : "Send Request"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SellerAppealsPage;