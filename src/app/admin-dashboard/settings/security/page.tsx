"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function SecurityAuditSettingsPage() {
  const router = useRouter();

  // Authentication state
  const [require2FA, setRequire2FA] = useState(false);
  const [kycForSellers, setKycForSellers] = useState(true);
  const [systemDowntime, setSystemDowntime] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");

  // Password Policy state
  const [minLength, setMinLength] = useState("8");
  const [requireUppercase, setRequireUppercase] = useState(false);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(false);
  const [passwordExpiry, setPasswordExpiry] = useState("90");

  // Audit Logging state
  const [logAdminActions, setLogAdminActions] = useState(false);
  const [logUserAccess, setLogUserAccess] = useState(true);
  const [logRetention, setLogRetention] = useState("365");

  // Security Monitoring state
  const [failedLoginAlerts, setFailedLoginAlerts] = useState(false);
  const [ipBlocking, setIpBlocking] = useState(true);
  const [alertThreshold, setAlertThreshold] = useState("10");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h1 className="text-2xl font-semibold text-black">
          Security & Audit Settings
        </h1>
      </div>

      {/* Back Button and Save Button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => router.push("/admin-dashboard/settings")}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Settings
        </button>

        <button
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            background: "#E67E22",
            color: "#FFF",
            fontSize: "14px",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
          }}
        >
          Save Changes
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Authentication */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              Authentication
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              User verification and access control
            </p>

            <div className="space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Require 2FA for Admins
                  </h3>
                  <p className="text-xs text-gray-600">
                    Mandatory two-factor authentication
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={require2FA}
                  onChange={(e) => setRequire2FA(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    KYC for Sellers
                  </h3>
                  <p className="text-xs text-gray-600">
                    Bank Verification Number required
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={kycForSellers}
                  onChange={(e) => setKycForSellers(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    System Downtime
                  </h3>
                  <p className="text-xs text-gray-600">
                    Alert on service interruptions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={systemDowntime}
                  onChange={(e) => setSystemDowntime(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="text"
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Max Login Attempts
                </label>
                <input
                  type="text"
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Password Policy */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              Password Policy
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Password strength requirements
            </p>

            <div className="space-y-4">
              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Minimum Length
                </label>
                <input
                  type="text"
                  value={minLength}
                  onChange={(e) => setMinLength(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Require Uppercase
                  </h3>
                  <p className="text-xs text-gray-600">
                    At least one capital letter
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={requireUppercase}
                  onChange={(e) => setRequireUppercase(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Require Numbers
                  </h3>
                  <p className="text-xs text-gray-600">At least one digit</p>
                </div>
                <input
                  type="checkbox"
                  checked={requireNumbers}
                  onChange={(e) => setRequireNumbers(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Require Special Characters
                  </h3>
                  <p className="text-xs text-gray-600">At least one symbol</p>
                </div>
                <input
                  type="checkbox"
                  checked={requireSpecialChars}
                  onChange={(e) => setRequireSpecialChars(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Password Expiry (days)
                </label>
                <input
                  type="text"
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Audit Logging */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              Audit Logging
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Track system changes and access
            </p>

            <div className="space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Log Admin Actions
                  </h3>
                  <p className="text-xs text-gray-600">
                    Track all administrative changes
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={logAdminActions}
                  onChange={(e) => setLogAdminActions(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Log User Access
                  </h3>
                  <p className="text-xs text-gray-600">
                    Track login attempts and sessions
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={logUserAccess}
                  onChange={(e) => setLogUserAccess(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Log Retention (days)
                </label>
                <input
                  type="text"
                  value={logRetention}
                  onChange={(e) => setLogRetention(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Security Monitoring */}
          <div
            style={{
              padding: "20px",
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
              background: "#FFF",
            }}
          >
            <h2 className="text-lg font-semibold text-black mb-2">
              Security Monitoring
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Real-time security alerts
            </p>

            <div className="space-y-4">
              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    Failed Login Alerts
                  </h3>
                  <p className="text-xs text-gray-600">
                    Notify on suspicious activity
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={failedLoginAlerts}
                  onChange={(e) => setFailedLoginAlerts(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="flex items-start justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-sm font-medium text-black mb-1">
                    IP Blocking
                  </h3>
                  <p className="text-xs text-gray-600">
                    Auto-block suspicious IPs
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={ipBlocking}
                  onChange={(e) => setIpBlocking(e.target.checked)}
                  className="w-5 h-5 mt-1"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-black mb-2">
                  Alert Threshold (attempts)
                </label>
                <input
                  type="text"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}