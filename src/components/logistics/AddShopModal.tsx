"use client";

import { useState, useRef } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Upload,
  Check,
  Loader2,
  Store,
  AlertCircle,
} from "lucide-react";

// ─── Error extraction ─────────────────────────────────────────────────────────
// Handles all RTK Query error shapes so toast/banner messages are always useful.
function extractErrorMessage(
  err: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  if (!err) return fallback;

  // RTK FetchBaseQueryError – data is the parsed API JSON body
  if (typeof err === "object" && err !== null && "status" in err) {
    const fe = err as {
      status: number | string;
      data?: unknown;
      error?: string;
    };

    // Network / timeout errors (status = "FETCH_ERROR" | "TIMEOUT_ERROR" etc.)
    if (typeof fe.status === "string") {
      return (
        fe.error ||
        `Network error (${fe.status}). Please check your connection and try again.`
      );
    }

    // API returned a JSON body
    if (fe.data && typeof fe.data === "object") {
      const body = fe.data as Record<string, unknown>;

      // Validation array: { errors: ["field must be ...", ...] }
      if (Array.isArray(body.errors) && body.errors.length > 0) {
        return (body.errors as string[]).join(" · ");
      }
      // Standard { message: string } shape
      if (typeof body.message === "string" && body.message) {
        return body.message;
      }
    }

    // API returned a plain-text body
    if (typeof fe.data === "string" && fe.data) return fe.data;

    // HTTP code fallback
    return `Request failed (HTTP ${fe.status}). Please try again.`;
  }

  // RTK SerializedError – JS exceptions serialised into Redux
  if (typeof err === "object" && err !== null && "message" in err) {
    return (err as { message: string }).message || fallback;
  }

  // Plain string thrown somewhere
  if (typeof err === "string") return err;

  return fallback;
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateHubMutation } from "@/api/hubApi";
import { useGetStatesQuery } from "@/api/userApi";
import { useGetZonesQuery, type DeliveryZone } from "@/api/deliveryApi";
import { useUploadFileMutation } from "@/api/filesApi";
import { toast } from "sonner";

interface AddShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  excludeState?: string;
  allowedStates?: string[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  name: "",
  state: "Lagos",
  city: "",
  phone: "+234",
  email: "",
  deliveryZoneId: "",
  address: "",
};

const INITIAL_FILES = {
  idCard: null as File | null,
  selfie: null as File | null,
  proofOfAddress: null as File | null,
};

function formatPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("234")) digits = digits.substring(3);
  if (digits.startsWith("0")) digits = digits.substring(1);
  return "+234" + digits;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const StepIndicator = ({ step }: { step: number }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "24px",
    }}
  >
    {[1, 2].map((n) => (
      <div
        key={n}
        style={{ display: "flex", alignItems: "center", gap: "8px" }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: step >= n ? "#E67E22" : "#E5E7EB",
            color: step >= n ? "#fff" : "#9CA3AF",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s ease",
            flexShrink: 0,
          }}
        >
          {step > n ? <Check size={14} /> : n}
        </div>
        <span
          style={{
            fontSize: "13px",
            fontWeight: step === n ? 600 : 400,
            color: step >= n ? "#111" : "#9CA3AF",
            transition: "color 0.25s ease",
          }}
        >
          {n === 1 ? "Hub Details" : "Documents"}
        </span>
        {n < 2 && (
          <div
            style={{
              flex: 1,
              height: "2px",
              background: step > n ? "#E67E22" : "#E5E7EB",
              width: "40px",
              transition: "background 0.25s ease",
            }}
          />
        )}
      </div>
    ))}
  </div>
);

interface FieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}
const Field = ({ label, children, required }: FieldProps) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
      {label}
      {required && (
        <span style={{ color: "#E67E22", marginLeft: "2px" }}>*</span>
      )}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #E5E7EB",
  borderRadius: "8px",
  fontSize: "14px",
  color: "#111",
  background: "#FAFAFA",
  outline: "none",
  transition: "border-color 0.2s ease",
  boxSizing: "border-box",
};

interface FileUploadZoneProps {
  label: string;
  sublabel: string;
  accept: string;
  file: File | null;
  onChange: (f: File | null) => void;
}
const FileUploadZone = ({
  label,
  sublabel,
  accept,
  file,
  onChange,
}: FileUploadZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const previewUrl =
    file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}>
        {label} <span style={{ color: "#E67E22" }}>*</span>
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const dropped = e.dataTransfer.files?.[0];
          if (dropped) onChange(dropped);
        }}
        style={{
          border: `2px dashed ${dragging ? "#E67E22" : file ? "#10B981" : "#D1D5DB"}`,
          borderRadius: "10px",
          padding: "16px",
          background: dragging ? "#FFF8F3" : file ? "#F0FDF4" : "#FAFAFA",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          transition: "all 0.2s ease",
          minHeight: "72px",
        }}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt={label}
              style={{
                width: "52px",
                height: "52px",
                objectFit: "cover",
                borderRadius: "6px",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#059669",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {file!.name}
              </p>
              <p style={{ fontSize: "12px", color: "#6B7280" }}>
                {(file!.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
                padding: "4px",
              }}
            >
              <X size={14} />
            </button>
          </>
        ) : file ? (
          <>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "#DCFCE7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={18} color="#059669" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#059669",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {file.name}
              </p>
              <p style={{ fontSize: "12px", color: "#6B7280" }}>
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#9CA3AF",
                padding: "4px",
              }}
            >
              <X size={14} />
            </button>
          </>
        ) : (
          <>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                background: "#F3F4F6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Upload size={18} color="#9CA3AF" />
            </div>
            <div>
              <p
                style={{ fontSize: "13px", fontWeight: 500, color: "#374151" }}
              >
                Click or drag to upload
              </p>
              <p style={{ fontSize: "12px", color: "#9CA3AF" }}>{sublabel}</p>
            </div>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        style={{ display: "none" }}
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
    </div>
  );
};

// ─── Main Modal ──────────────────────────────────────────────────────────────

export default function AddShopModal({
  isOpen,
  onClose,
  excludeState,
  allowedStates,
}: AddShopModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [files, setFiles] = useState(INITIAL_FILES);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [createHub, { isLoading: isCreatingHub }] = useCreateHubMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const { data: statesData } = useGetStatesQuery();
  const { data: zonesData } = useGetZonesQuery({ limit: 50 });
  const [submitError, setSubmitError] = useState<string | null>(null);

  const filteredStates = statesData?.states?.filter((s) => {
    if (allowedStates) return allowedStates.includes(s.state);
    if (excludeState) return s.state !== excludeState;
    return true;
  });

  const selectedState = statesData?.states?.find(
    (s) => s.state === formData.state,
  );
  const isBusy = isCreatingHub || isUploading;

  const set = (field: string, value: string) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "phone") {
      setFormData((prev) => ({ ...prev, phone: formatPhone(value) }));
    } else if (field === "state") {
      setFormData((prev) => ({ ...prev, state: value, city: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const setFile = (field: keyof typeof files, file: File | null) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
    setFiles((prev) => ({ ...prev, [field]: file }));
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Shop name is required";
    if (!formData.city) errs.city = "City / LGA is required";
    if (!formData.email.trim()) errs.email = "Email is required";
    if (formData.phone === "+234" || formData.phone.length < 10)
      errs.phone = "Valid phone number required";
    if (!formData.deliveryZoneId)
      errs.deliveryZoneId = "Delivery zone is required";
    if (!formData.address.trim()) errs.address = "Address is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!files.idCard) errs.idCard = "Required";
    if (!files.selfie) errs.selfie = "Required";
    if (!files.proofOfAddress) errs.proofOfAddress = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setSubmitError(null);

    // Upload files one by one so we can give precise failure messages
    let idCardUrl = "";
    let selfieWithIdUrl = "";
    let proofOfAddressUrl = "";

    try {
      if (files.idCard) {
        const res = await uploadFile({
          file: files.idCard,
          prefix: "hubs/id-cards",
        }).unwrap();
        idCardUrl = res.data.url;
      }
    } catch (err) {
      const msg = extractErrorMessage(
        err,
        "Failed to upload Government ID Card.",
      );
      setSubmitError(msg);
      toast.error(msg);
      return;
    }

    try {
      if (files.selfie) {
        const res = await uploadFile({
          file: files.selfie,
          prefix: "hubs/selfies",
        }).unwrap();
        selfieWithIdUrl = res.data.url;
      }
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to upload Selfie with ID.");
      setSubmitError(msg);
      toast.error(msg);
      return;
    }

    try {
      if (files.proofOfAddress) {
        const res = await uploadFile({
          file: files.proofOfAddress,
          prefix: "hubs/proof-address",
        }).unwrap();
        proofOfAddressUrl = res.data.url;
      }
    } catch (err) {
      const msg = extractErrorMessage(err, "Failed to upload Utility Bill.");
      setSubmitError(msg);
      toast.error(msg);
      return;
    }

    try {
      await createHub({
        ...formData,
        idCardUrl,
        selfieWithIdUrl,
        proofOfAddressUrl,
      }).unwrap();

      toast.success(`Hub "${formData.name}" created successfully!`);
      handleClose();
    } catch (err) {
      console.error("Failed to create hub:", err);
      const msg = extractErrorMessage(
        err,
        "Failed to create hub. Please try again.",
      );
      setSubmitError(msg);
      toast.error(msg);
    }
  };

  const handleClose = () => {
    setStep(1);
    const initialForm = { ...INITIAL_FORM };
    const isStateAllowed = allowedStates
      ? allowedStates.includes(initialForm.state)
      : initialForm.state !== excludeState;

    if (!isStateAllowed && filteredStates && filteredStates.length > 0) {
      initialForm.state = filteredStates[0].state;
    }
    setFormData(initialForm);
    setFiles(INITIAL_FILES);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "20px",
          width: "100%",
          maxWidth: "520px",
          maxHeight: "92vh",
          overflowY: "auto",
          boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
          position: "relative",
          animation: "modalSlideUp 0.25s ease",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 24px 0",
            borderBottom: "1px solid #F3F4F6",
            paddingBottom: "20px",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={handleClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "#F3F4F6",
              border: "none",
              borderRadius: "50%",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#6B7280",
            }}
          >
            <X size={16} />
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "#FEF3E8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Store size={18} color="#E67E22" />
            </div>
            <div>
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "#111",
                  margin: 0,
                }}
              >
                Add New Parcel Shop
              </h2>
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>
                {step === 1
                  ? "Fill in the hub location details"
                  : "Upload required verification documents"}
              </p>
            </div>
          </div>

          <StepIndicator step={step} />
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: "0 24px 24px" }}>
          {step === 1 ? (
            /* ── Step 1: Hub Details ── */
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <Field label="Shop Name" required>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: errors.name ? "#EF4444" : "#E5E7EB",
                  }}
                  placeholder="e.g. Shopam Lagos Hub"
                  value={formData.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                {errors.name && (
                  <span style={{ fontSize: "12px", color: "#EF4444" }}>
                    {errors.name}
                  </span>
                )}
              </Field>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <Field label="State" required>
                  <Select
                    value={formData.state}
                    onValueChange={(v) => set("state", v)}
                    disabled={!excludeState && !allowedStates}
                  >
                    <SelectTrigger
                      style={{
                        ...inputStyle,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredStates?.map((s) => (
                        <SelectItem key={s.state} value={s.state}>
                          {s.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="City / LGA" required>
                  <Select
                    value={formData.city}
                    onValueChange={(v) => set("city", v)}
                    disabled={!selectedState}
                  >
                    <SelectTrigger
                      style={{
                        ...inputStyle,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        borderColor: errors.city ? "#EF4444" : "#E5E7EB",
                      }}
                    >
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedState?.lgas.map((lga) => (
                        <SelectItem key={lga} value={lga}>
                          {lga}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.city && (
                    <span style={{ fontSize: "12px", color: "#EF4444" }}>
                      {errors.city}
                    </span>
                  )}
                </Field>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <Field label="Email Address" required>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: errors.email ? "#EF4444" : "#E5E7EB",
                    }}
                    type="email"
                    placeholder="hub@example.com"
                    value={formData.email}
                    onChange={(e) => set("email", e.target.value)}
                  />
                  {errors.email && (
                    <span style={{ fontSize: "12px", color: "#EF4444" }}>
                      {errors.email}
                    </span>
                  )}
                </Field>

                <Field label="Phone Number" required>
                  <input
                    style={{
                      ...inputStyle,
                      borderColor: errors.phone ? "#EF4444" : "#E5E7EB",
                    }}
                    type="tel"
                    placeholder="+234..."
                    value={formData.phone}
                    onChange={(e) => set("phone", e.target.value)}
                  />
                  {errors.phone && (
                    <span style={{ fontSize: "12px", color: "#EF4444" }}>
                      {errors.phone}
                    </span>
                  )}
                </Field>
              </div>

              <Field label="Delivery Zone" required>
                <Select
                  value={formData.deliveryZoneId}
                  onValueChange={(v) => set("deliveryZoneId", v)}
                >
                  <SelectTrigger
                    style={{
                      ...inputStyle,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderColor: errors.deliveryZoneId
                        ? "#EF4444"
                        : "#E5E7EB",
                    }}
                  >
                    <SelectValue placeholder="Select delivery zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zonesData?.data?.items?.map((zone: DeliveryZone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name} ({zone.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.deliveryZoneId && (
                  <span style={{ fontSize: "12px", color: "#EF4444" }}>
                    {errors.deliveryZoneId}
                  </span>
                )}
              </Field>

              <Field label="Full Address" required>
                <input
                  style={{
                    ...inputStyle,
                    borderColor: errors.address ? "#EF4444" : "#E5E7EB",
                  }}
                  placeholder="Enter hub street address"
                  value={formData.address}
                  onChange={(e) => set("address", e.target.value)}
                />
                {errors.address && (
                  <span style={{ fontSize: "12px", color: "#EF4444" }}>
                    {errors.address}
                  </span>
                )}
              </Field>

              <button
                type="button"
                onClick={handleNext}
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  background: "#E67E22",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "4px",
                  transition: "opacity 0.2s ease",
                }}
              >
                Continue to Documents
                <ChevronRight size={16} />
              </button>
            </div>
          ) : (
            /* ── Step 2: Documents ── */
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {/* Error banner */}
              {submitError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    padding: "12px 14px",
                    borderRadius: "10px",
                    background: "#FEF2F2",
                    border: "1px solid #FECACA",
                  }}
                >
                  <AlertCircle
                    size={16}
                    color="#DC2626"
                    style={{ flexShrink: 0, marginTop: "1px" }}
                  />
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#DC2626",
                      flex: 1,
                      lineHeight: "1.4",
                    }}
                  >
                    {submitError}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSubmitError(null)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#DC2626",
                      padding: 0,
                      flexShrink: 0,
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              <FileUploadZone
                label="Government ID Card"
                sublabel="JPEG, PNG or PDF · Max 5MB"
                accept="image/*,.pdf"
                file={files.idCard}
                onChange={(f) => setFile("idCard", f)}
              />
              {errors.idCard && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#EF4444",
                    marginTop: "-8px",
                  }}
                >
                  {errors.idCard}
                </span>
              )}

              <FileUploadZone
                label="Selfie Holding ID"
                sublabel="JPEG or PNG · Max 5MB"
                accept="image/*"
                file={files.selfie}
                onChange={(f) => setFile("selfie", f)}
              />
              {errors.selfie && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#EF4444",
                    marginTop: "-8px",
                  }}
                >
                  {errors.selfie}
                </span>
              )}

              <FileUploadZone
                label="Utility Bill (Proof of Address)"
                sublabel="JPEG, PNG or PDF · Max 5MB"
                accept="image/*,.pdf"
                file={files.proofOfAddress}
                onChange={(f) => setFile("proofOfAddress", f)}
              />
              {errors.proofOfAddress && (
                <span
                  style={{
                    fontSize: "12px",
                    color: "#EF4444",
                    marginTop: "-8px",
                  }}
                >
                  {errors.proofOfAddress}
                </span>
              )}

              <div style={{ display: "flex", gap: "10px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => {
                    setStep(1);
                    setSubmitError(null);
                  }}
                  disabled={isBusy}
                  style={{
                    flex: "0 0 auto",
                    padding: "13px 18px",
                    borderRadius: "10px",
                    background: "#F3F4F6",
                    color: "#374151",
                    fontSize: "14px",
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <ChevronLeft size={16} />
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isBusy}
                  style={{
                    flex: 1,
                    padding: "13px",
                    borderRadius: "10px",
                    background: "#E67E22",
                    color: "#fff",
                    fontSize: "14px",
                    fontWeight: 600,
                    border: "none",
                    cursor: isBusy ? "not-allowed" : "pointer",
                    opacity: isBusy ? 0.75 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {isBusy ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {isUploading ? "Uploading files..." : "Creating hub..."}
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      Create Hub
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>

      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
