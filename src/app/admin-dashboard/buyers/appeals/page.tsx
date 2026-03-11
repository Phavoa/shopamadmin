"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  useGetDisciplineRecordsQuery,
  useGetDisciplineRecordQuery,
  useAppealDecisionMutation,
  useSaveDraftNotesMutation,
  useRequestMoreEvidenceMutation,
  fetchUserById,
  DisciplineRecord,
  AppealStatus,
} from "@/api/disciplineApi";

// ─── Appeal Status Badge ──────────────────────────────────────────────────────
const AppealStatusBadge = ({ status }: { status: AppealStatus | null }) => {
  const map: Record<string, { label: string; bg: string; color: string; border: string }> = {
    APPROVED:       { label: "Approved",        bg: "#D1FAE5", color: "#065F46", border: "#A7F3D0" },
    REJECTED:       { label: "Rejected",        bg: "#FEE2E2", color: "#991B1B", border: "#FECACA" },
    INFO_REQUESTED: { label: "Info Requested",  bg: "#DBEAFE", color: "#1E40AF", border: "#BFDBFE" },
    PENDING:        { label: "Pending Review",  bg: "#FEF3C7", color: "#92400E", border: "#FDE68A" },
  };
  const s = status ? map[status] : null;
  if (!s) return (
    <span className="px-3 py-1 rounded-lg text-xs font-medium bg-white text-gray-700 border border-gray-300">Review</span>
  );
  return (
    <span className="px-3 py-1 rounded-lg text-xs font-medium" style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {s.label}
    </span>
  );
};

const DocumentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.96 5.415L10.71 0.165C10.6046 0.0594807 10.4616 0.000131289 10.3125 0H1.3125C0.964403 0 0.630564 0.138281 0.384422 0.384422C0.138281 0.630564 0 0.964403 0 1.3125V17.8125C0 18.1606 0.138281 18.4944 0.384422 18.7406C0.630564 18.9867 0.964403 19.125 1.3125 19.125H14.8125C15.1606 19.125 15.4944 18.9867 15.7406 18.7406C15.9867 18.4944 16.125 18.1606 16.125 17.8125V5.8125C16.1249 5.66337 16.0655 5.52039 15.96 5.415ZM10.875 1.92L14.205 5.25H10.875V1.92ZM14.8125 18H1.3125C1.26277 18 1.21508 17.9802 1.17992 17.9451C1.14475 17.9099 1.125 17.8622 1.125 17.8125V1.3125C1.125 1.26277 1.14475 1.21508 1.17992 1.17992C1.21508 1.14475 1.26277 1.125 1.3125 1.125H9.75V5.8125C9.75 5.96168 9.80926 6.10476 9.91475 6.21025C10.0202 6.31574 10.1633 6.375 10.3125 6.375H15V17.8125C15 17.8622 14.9802 17.9099 14.9451 17.9451C14.9099 17.9802 14.8622 18 14.8125 18Z" fill="#9CA3AF"/>
  </svg>
);

const BuyerAppealsPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [draftNote, setDraftNote] = useState("");
  const [selectedDecision, setSelectedDecision] = useState<"APPROVED" | "REJECTED" | "INFO_REQUESTED" | null>(null);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [evidenceMessage, setEvidenceMessage] = useState("");
  // Gallery lightbox: stores all files + which one is open
  const [lightbox, setLightbox] = useState<{ files: string[]; index: number } | null>(null);
  // Map of userId -> resolved { name, email } — populated by fetchUserById
  const [nameMap, setNameMap] = useState<Record<string, { name: string; email: string }>>({});

  // ── List all buyer appeals ───────────────────────────────────────────────
  const { data, isLoading, isError, refetch } = useGetDisciplineRecordsQuery({
    role: "BUYER",
    sortBy: "createdAt",
    sortDir: "desc",
    limit: 100,
    populate: ["user"],
  });

  const rawAppeals = (data?.data?.items ?? []).filter(
    (r) => r.appealText || r.appealStatus
  );

  // ── Resolve user names via fetchUserById for missing names ────────────────
  useEffect(() => {
    if (!rawAppeals.length) return;
    const missing = rawAppeals.filter(
      (r) => !r.sellerName && !r.user?.firstName && !nameMap[r.userId]
    );
    if (!missing.length) return;
    missing.forEach(async (r) => {
      const fetched = await fetchUserById(r.userId);
      setNameMap((prev) => ({
        ...prev,
        [r.userId]: {
          name: `${fetched.firstName} ${fetched.lastName}`.trim(),
          email: fetched.email,
        },
      }));
    });
  }, [rawAppeals.length]);

  const activeId = selectedId ?? rawAppeals[0]?.id ?? null;

  // ── Fetch full case detail ────────────────────────────────────────────────
  const {
    data: caseDetailData,
    isFetching: loadingDetail,
    isError: detailError,
  } = useGetDisciplineRecordQuery(activeId!, { skip: !activeId });

  // Immediately show list-level data while detail is loading, then upgrade
  const listRecord = rawAppeals.find((a) => a.id === activeId) ?? null;
  const selectedAppeal: DisciplineRecord | null = caseDetailData?.data ?? listRecord;

  // ── Mutations ─────────────────────────────────────────────────────────────
  const [appealDecision, { isLoading: isDeciding }] = useAppealDecisionMutation();
  const [saveDraftNotes, { isLoading: isSavingDraft }] = useSaveDraftNotesMutation();
  const [requestMoreEvidence, { isLoading: isRequestingEvidence }] = useRequestMoreEvidenceMutation();

  useEffect(() => {
    if (selectedAppeal?.adminNote) setDraftNote(selectedAppeal.adminNote);
    else setDraftNote("");
  }, [selectedAppeal?.id]);

  const getActionLabel = (r: DisciplineRecord) =>
    r.type === "SUSPENSION" ? "Suspension" : r.type === "STRIKE" ? "Strike" : r.type;

  const getDaysAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "Today" : `${days}d ago`;
  };

  const getDisplayName = (r: DisciplineRecord) =>
    r.sellerName ??
    (r.user ? `${r.user.firstName} ${r.user.lastName}` : null) ??
    nameMap[r.userId]?.name ??
    `User …${r.userId.slice(-6)}`;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleDecision = async () => {
    if (!activeId || !selectedDecision || !decisionNote.trim()) {
      toast.error("Please select an outcome and add a decision note.");
      return;
    }
    try {
      await appealDecision({
        actionId: activeId,
        data: { appealStatus: selectedDecision, adminNote: decisionNote.trim() },
      }).unwrap();
      toast.success("Decision submitted successfully.");
      setDecisionNote("");
      setSelectedDecision(null);
      refetch();
    } catch {
      toast.error("Failed to submit decision.");
    }
  };

  const handleSaveDraft = async () => {
    if (!activeId || !draftNote.trim()) {
      toast.error("Please add a note to save.");
      return;
    }
    try {
      await saveDraftNotes({ actionId: activeId, data: { adminNote: draftNote.trim() } }).unwrap();
      toast.success("Draft notes saved.");
    } catch {
      toast.error("Failed to save draft.");
    }
  };

  const handleRequestEvidence = async () => {
    if (!activeId || !evidenceMessage.trim()) return;
    try {
      await requestMoreEvidence({ actionId: activeId, data: { message: evidenceMessage.trim() } }).unwrap();
      toast.success("Evidence request sent to buyer.");
      setEvidenceMessage("");
      setShowEvidenceModal(false);
      refetch();
    } catch {
      toast.error("Failed to send evidence request.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#F9FAFB] p-6">
        <h1 className="text-2xl font-semibold mb-6">Buyer Appeals and Investigations</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* ── Left: Appeals Inbox ──────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ borderRadius: "18px" }}>
            <h2 className="text-lg font-semibold mb-4">Appeals Inbox</h2>

            {isLoading && (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-16 bg-gray-100 animate-pulse rounded-lg" />)}
              </div>
            )}
            {isError && (
              <p className="text-red-500 text-sm">
                Failed to load appeals.{" "}
                <button onClick={refetch} className="underline">Retry</button>
              </p>
            )}
            {!isLoading && !isError && rawAppeals.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">No buyer appeals found.</p>
            )}

            <div className="space-y-3">
              {rawAppeals.map((appeal) => (
                <div
                  key={appeal.id}
                  onClick={() => setSelectedId(appeal.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    appeal.id === activeId
                      ? "border-[#E67E22] bg-[#FFF3E0]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{appeal.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-gray-500">
                        {getDisplayName(appeal)} • {getActionLabel(appeal)} • {getDaysAgo(appeal.createdAt)}
                      </p>
                    </div>
                    <AppealStatusBadge status={appeal.appealStatus} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Case Detail ───────────────────────────────────────── */}
          {activeId ? (
            <div className="bg-white rounded-xl border border-gray-200 p-6" style={{ borderRadius: "18px" }}>
              {!selectedAppeal && loadingDetail ? (
                // Only show skeleton if we have NO data at all yet
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => <div key={i} className="h-8 bg-gray-100 animate-pulse rounded-lg" />)}
                </div>
              ) : detailError && !selectedAppeal ? (
                <p className="text-red-500 text-sm">Failed to load case detail. The case may not exist or you may lack permission.</p>
              ) : selectedAppeal ? (
                <>
                  <h2 className="text-lg font-semibold mb-4">
                    Case Detail: {selectedAppeal.id.slice(-8).toUpperCase()}
                  </h2>

                  <div className="space-y-4">
                    {/* Meta */}
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Buyer:</strong>{" "}
                        {selectedAppeal.sellerName ?? getDisplayName(selectedAppeal)}
                        {selectedAppeal.sellerEmail && (
                          <span className="text-gray-500 ml-1">({selectedAppeal.sellerEmail})</span>
                        )}
                      </p>
                      <p>
                        <strong>Action Appealed:</strong> {getActionLabel(selectedAppeal)} |{" "}
                        <strong>Issued:</strong> {getDaysAgo(selectedAppeal.createdAt)}
                      </p>
                      <p className="flex items-center gap-2">
                        <strong>Appeal Status:</strong>
                        <AppealStatusBadge status={selectedAppeal.appealStatus} />
                        <span className="text-gray-400">| SLA: 24h to respond</span>
                      </p>
                      {selectedAppeal.reason && (
                        <p><strong>Reason:</strong> {selectedAppeal.reason}</p>
                      )}
                    </div>

                    {/* Buyer Statement */}
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Buyer Statement</h3>
                      <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-700">
                        {selectedAppeal.appealText ?? "No statement provided."}
                      </div>
                    </div>

                    {/* Evidence */}
                    {(() => {
                      const files = selectedAppeal.appealEvidence ?? selectedAppeal.evidence ?? [];
                      return files.length > 0 ? (
                        <div>
                          <h3 className="font-semibold text-sm mb-2">Evidence Submitted</h3>
                          <div className="grid grid-cols-3 gap-3">
                            {files.map((url, i) => (
                              <div key={i} className="text-center">
                                <button
                                  onClick={() => setLightbox({ files, index: i })}
                                  className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2 hover:bg-gray-200 transition-colors"
                                >
                                  {/\.(jpe?g|png|gif|webp|svg)$/i.test(url) ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={url} alt={`Evidence ${i + 1}`} className="w-full h-full object-cover rounded-lg" />
                                  ) : (
                                    <DocumentIcon />
                                  )}
                                </button>
                                <p className="text-xs text-gray-600">Evidence {i + 1}</p>
                                <button
                                  onClick={() => setLightbox({ files, index: i })}
                                  className="text-xs text-[#E67E22] mt-1 block w-full"
                                >
                                  View
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    })()}

                    {/* Admin Draft Notes */}
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Admin Notes (Draft)</h3>
                      <textarea
                        value={draftNote}
                        onChange={(e) => setDraftNote(e.target.value)}
                        placeholder="Add internal notes, e.g. verified via support logs..."
                        className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none"
                      />
                    </div>

                    {/* Decision */}
                    <div>
                      <h3 className="font-semibold text-sm mb-2">Decision</h3>
                      <p className="text-xs text-gray-500 mb-3">Choose an Outcome</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {(["APPROVED", "REJECTED", "INFO_REQUESTED"] as const).map((d) => (
                          <button
                            key={d}
                            onClick={() => setSelectedDecision(d)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium text-white border-2 transition-all ${
                              selectedDecision === d ? "ring-2 ring-offset-1 ring-[#E67E22]" : "border-transparent"
                            }`}
                            style={{ background: d === "REJECTED" ? "#EF4444" : "#E67E22" }}
                          >
                            {d === "APPROVED" ? "Approve Appeal" : d === "REJECTED" ? "Deny Appeal" : "Request Info"}
                          </button>
                        ))}
                      </div>
                      {selectedDecision && (
                        <p className="text-xs mb-2 font-medium" style={{
                          color: selectedDecision === "APPROVED" ? "#10B981" : selectedDecision === "REJECTED" ? "#EF4444" : "#3B82F6",
                        }}>
                          {selectedDecision === "APPROVED" && "✓ Suspension / strike will be resolved immediately."}
                          {selectedDecision === "REJECTED" && "✗ Disciplinary action remains active."}
                          {selectedDecision === "INFO_REQUESTED" && "ℹ Buyer will be notified to submit more information."}
                        </p>
                      )}
                      <textarea
                        value={decisionNote}
                        onChange={(e) => setDecisionNote(e.target.value)}
                        placeholder="Add a decision note (required to submit)..."
                        className="w-full h-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E67E22] resize-none mb-3"
                      />
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={handleDecision}
                          disabled={isDeciding || !selectedDecision || !decisionNote.trim()}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                          style={{ background: "#E67E22" }}
                        >
                          {isDeciding ? "Submitting..." : "Submit Decision"}
                        </button>
                        <button
                          onClick={handleSaveDraft}
                          disabled={isSavingDraft || !draftNote.trim()}
                          className="px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                          style={{ background: "#F5F5F5", color: "#374151", border: "1px solid #D1D5DB" }}
                        >
                          {isSavingDraft ? "Saving..." : "Save as Draft"}
                        </button>
                        <button
                          onClick={() => setShowEvidenceModal(true)}
                          className="px-4 py-2 rounded-lg text-sm font-medium"
                          style={{ background: "#FFF3E0", color: "#E67E22", border: "1px solid #E67E22" }}
                        >
                          Request More Evidence
                        </button>
                      </div>
                    </div>

                    {/* Audit Trail */}
                    {selectedAppeal.auditTrail && selectedAppeal.auditTrail.length > 0 && (
                      <div>
                        <h3 className="font-semibold text-sm mb-2">Audit Trail</h3>
                        <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600 space-y-2">
                          {selectedAppeal.auditTrail.map((entry) => (
                            <div key={entry.id} className="flex gap-2">
                              <span className="text-gray-400 shrink-0">
                                {new Date(entry.createdAt).toLocaleString()}
                              </span>
                              <span>
                                <span className="font-medium">{entry.actorName ?? "System"}</span>
                                {" — "}
                                {entry.note}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex items-center justify-center" style={{ borderRadius: "18px", minHeight: "400px" }}>
              <p className="text-gray-500">Select an appeal to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Request More Evidence Modal ────────────────────────────────────── */}
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
              Describe what additional evidence the buyer needs to provide. They will receive an in-app notification.
            </p>
            {selectedAppeal && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-xs text-gray-600">
                <p><span className="font-medium">Case:</span> {selectedAppeal.id.slice(-8).toUpperCase()}</p>
                <p><span className="font-medium">Buyer:</span> {selectedAppeal.sellerName ?? getDisplayName(selectedAppeal)}</p>
              </div>
            )}
            <textarea
              value={evidenceMessage}
              onChange={(e) => setEvidenceMessage(e.target.value)}
              rows={4}
              placeholder="e.g. Please upload the order confirmation email and delivery photos."
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
                disabled={isRequestingEvidence || !evidenceMessage.trim()}
                className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50"
                style={{ background: "#E67E22" }}
              >{isRequestingEvidence ? "Sending..." : "Send Request"}</button>
            </div>
          </div>
        </div>
      )}
      {/* ── Gallery Lightbox ─────────────────────────────────────────────── */}
      {lightbox && (() => {
        const { files, index } = lightbox;
        const currentUrl = files[index];
        const isImage = /\.(jpe?g|png|gif|webp|svg)$/i.test(currentUrl);
        const hasPrev = index > 0;
        const hasNext = index < files.length - 1;
        return (
          <div
            style={{
              position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
            }}
            onClick={() => setLightbox(null)}
          >
            <div
              style={{ position: "relative", maxWidth: "90vw", maxHeight: "90vh", display: "flex", alignItems: "center", gap: "16px" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: "absolute", top: "-44px", right: 0,
                  color: "#111", background: "transparent", border: "none",
                  fontSize: "30px", cursor: "pointer", lineHeight: 1,
                }}
              >&times;</button>

              {/* Counter */}
              <span
                style={{
                  position: "absolute", top: "-44px", left: 0,
                  color: "#444", fontSize: "14px", fontWeight: 500,
                }}
              >
                {index + 1} / {files.length}
              </span>

              {/* Prev button */}
              <button
                onClick={() => setLightbox({ files, index: index - 1 })}
                disabled={!hasPrev}
                style={{
                  background: hasPrev ? "rgba(0,0,0,0.10)" : "rgba(0,0,0,0.03)",
                  border: "none", borderRadius: "50%", width: "44px", height: "44px",
                  color: hasPrev ? "#111" : "#bbb", fontSize: "22px", cursor: hasPrev ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >&#8592;</button>

              {/* Media */}
              <div style={{ maxWidth: "80vw", maxHeight: "85vh" }}>
                {isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={currentUrl}
                    src={currentUrl}
                    alt={`Evidence ${index + 1}`}
                    style={{ maxWidth: "80vw", maxHeight: "85vh", borderRadius: "8px", objectFit: "contain", display: "block" }}
                  />
                ) : (
                  <iframe
                    key={currentUrl}
                    src={currentUrl}
                    style={{ width: "75vw", height: "82vh", borderRadius: "8px", border: "none", background: "#fff" }}
                    title={`Evidence ${index + 1}`}
                  />
                )}
              </div>

              {/* Next button */}
              <button
                onClick={() => setLightbox({ files, index: index + 1 })}
                disabled={!hasNext}
                style={{
                  background: hasNext ? "rgba(0,0,0,0.10)" : "rgba(0,0,0,0.03)",
                  border: "none", borderRadius: "50%", width: "44px", height: "44px",
                  color: hasNext ? "#111" : "#bbb", fontSize: "22px", cursor: hasNext ? "pointer" : "default",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >&#8594;</button>
            </div>
          </div>
        );
      })()}
    </>
  );
};

export default BuyerAppealsPage;