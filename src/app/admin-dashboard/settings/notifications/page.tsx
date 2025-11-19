"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, List, Mail, MessageSquare, Bell, Send } from "lucide-react";

export default function NotificationSettingsPage() {
  const router = useRouter();

  // Email Notifications State
  const [emailNotifications, setEmailNotifications] = useState({
    orderConfirmation: true,
    paymentAlerts: true,
    sellerPayouts: false,
    disputeUpdates: true,
  });

  // SMS Notifications State
  const [smsNotifications, setSmsNotifications] = useState({
    orderShipped: true,
    deliveryConfirmation: true,
    payoutAlerts: false,
  });
  const [smsProvider, setSmsProvider] = useState("Twilio");

  // Push Notifications State
  const [pushNotifications, setPushNotifications] = useState({
    newOrders: true,
    livestreamStart: true,
    priceDrops: false,
  });

  const handleSave = () => {
    console.log("Saving notification settings...");
    alert("Settings saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-6">
      <main className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin-dashboard/settings")}
              className="flex items-center gap-2 text-[#E67E22] hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Settings</span>
            </button>
            <h1 className="text-2xl font-semibold text-[rgba(0,0,0,0.9)]">
              Notification Settings
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/admin-dashboard/settings/notifications/templates")}
              className="px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg font-medium text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              Manage Templates
            </button>
            <button
              onClick={() => router.push("/admin-dashboard/settings/notifications/logs")}
              className="px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg font-medium text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <List className="w-4 h-4" />
              View Logs
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-[#E67E22] text-white rounded-lg font-medium hover:bg-[#d67320] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email Notifications Card */}
          <div
            className="bg-white p-5"
            style={{
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#FFF1E5] flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#E67E22]" />
              </div>
              <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">
                Email Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  Order Confirmation
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications.orderConfirmation}
                    onChange={(e) =>
                      setEmailNotifications({
                        ...emailNotifications,
                        orderConfirmation: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  Payment Alerts
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications.paymentAlerts}
                    onChange={(e) =>
                      setEmailNotifications({
                        ...emailNotifications,
                        paymentAlerts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  Seller Payouts
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications.sellerPayouts}
                    onChange={(e) =>
                      setEmailNotifications({
                        ...emailNotifications,
                        sellerPayouts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  Dispute Updates
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications.disputeUpdates}
                    onChange={(e) =>
                      setEmailNotifications({
                        ...emailNotifications,
                        disputeUpdates: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* SMS Notifications Card */}
          <div
            className="bg-white p-5"
            style={{
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#FFF1E5] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-[#E67E22]" />
              </div>
              <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">
                SMS Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  Order Shipped
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications.orderShipped}
                    onChange={(e) =>
                      setSmsNotifications({
                        ...smsNotifications,
                        orderShipped: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  Delivery Confirmation
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications.deliveryConfirmation}
                    onChange={(e) =>
                      setSmsNotifications({
                        ...smsNotifications,
                        deliveryConfirmation: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  Payout Alerts
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifications.payoutAlerts}
                    onChange={(e) =>
                      setSmsNotifications({
                        ...smsNotifications,
                        payoutAlerts: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  SMS Provider
                </label>
                <select
                  value={smsProvider}
                  onChange={(e) => setSmsProvider(e.target.value)}
                  className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
                >
                  <option value="Twilio">Twilio</option>
                  <option value="Nexmo">Nexmo</option>
                  <option value="MessageBird">MessageBird</option>
                </select>
              </div>
            </div>
          </div>

          {/* Push Notifications Card */}
          <div
            className="bg-white p-5"
            style={{
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#FFF1E5] flex items-center justify-center">
                <Bell className="w-5 h-5 text-[#E67E22]" />
              </div>
              <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">
                Push Notifications
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  New Orders
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotifications.newOrders}
                    onChange={(e) =>
                      setPushNotifications({
                        ...pushNotifications,
                        newOrders: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  Livestream Start
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotifications.livestreamStart}
                    onChange={(e) =>
                      setPushNotifications({
                        ...pushNotifications,
                        livestreamStart: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                  Price Drops
                </label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={pushNotifications.priceDrops}
                    onChange={(e) =>
                      setPushNotifications({
                        ...pushNotifications,
                        priceDrops: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#E67E22]"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div
            className="bg-white p-5"
            style={{
              borderRadius: "18px",
              border: "0.3px solid rgba(0, 0, 0, 0.20)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#FFF1E5] flex items-center justify-center">
                <Send className="w-5 h-5 text-[#E67E22]" />
              </div>
              <h2 className="text-lg font-semibold text-[rgba(0,0,0,0.9)]">
                Quick Actions
              </h2>
            </div>

            <div className="space-y-3">
              <button className="w-full px-4 py-3 border border-[rgba(0,0,0,0.2)] rounded-lg font-medium text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors text-left flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Send Test Email
              </button>
              <button className="w-full px-4 py-3 border border-[rgba(0,0,0,0.2)] rounded-lg font-medium text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors text-left flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Send Test SMS
              </button>
              <button className="w-full px-4 py-3 border border-[rgba(0,0,0,0.2)] rounded-lg font-medium text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors text-left flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Send Test Push
              </button>
              <button className="w-full px-4 py-3 border border-[rgba(0,0,0,0.2)] rounded-lg font-medium text-[rgba(0,0,0,0.7)] hover:bg-gray-50 transition-colors text-left flex items-center gap-2">
                <List className="w-4 h-4" />
                View All Logs
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}