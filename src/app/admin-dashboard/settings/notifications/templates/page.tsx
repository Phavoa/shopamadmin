"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MessageSquare, Bell } from "lucide-react";

export default function MessageTemplatesPage() {
  const router = useRouter();

  // Email Templates State
  const [emailTemplates, setEmailTemplates] = useState({
    orderConfirmation: {
      subject: "Your Order is Confirmed!",
      body: "Hi {{buyer_name}}, your order #{{order_id}} has been confirmed."
    },
    paymentSuccess: {
      subject: "Payment Successful",
      body: "Your payment of {{amount}} was successful."
    },
    sellerPayout: {
      subject: "Payout Processed",
      body: "Hi {{seller_name}}, your payout of {{amount}} has been processed."
    }
  });

  // SMS Templates State
  const [smsTemplates, setSmsTemplates] = useState({
    orderShipped: "Hi {{buyer_name}}, your order #{{order_id}} has been shipped!",
    deliveryConfirmation: "Your order #{{order_id}} has been delivered. Thank you!",
    payoutAlert: "Hi {{seller_name}}, payout of {{amount}} processed to your account."
  });

  // Push Notification Templates State
  const [pushTemplates, setPushTemplates] = useState({
    newOrder: {
      title: "New Order Received!",
      body: "You have a new order #{{order_id}}"
    },
    livestreamStart: {
      title: "Livestream Starting Soon",
      body: "{{seller_name}} is going live in 5 minutes!"
    },
    priceAlert: {
      title: "Price Drop Alert",
      body: "{{product_name}} is now {{new_price}}"
    }
  });

  const handleSave = () => {
    console.log("Saving templates...");
    alert("Templates saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[var(--background)] pt-6">
      <main className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin-dashboard/settings/notifications")}
              className="flex items-center gap-2 text-[#E67E22] hover:underline"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Notifications</span>
            </button>
            <h1 className="text-2xl font-semibold text-[rgba(0,0,0,0.9)]">
              Message Templates
            </h1>
          </div>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-[#E67E22] text-white rounded-lg font-medium hover:bg-[#d67320] transition-colors"
          >
            Save All Templates
          </button>
        </div>

        {/* Email Templates Card */}
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
              Email Templates
            </h2>
          </div>

          <div className="space-y-4">
            {/* Order Confirmation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                Order Confirmation
              </label>
              <input
                type="text"
                value={emailTemplates.orderConfirmation.subject}
                onChange={(e) =>
                  setEmailTemplates({
                    ...emailTemplates,
                    orderConfirmation: {
                      ...emailTemplates.orderConfirmation,
                      subject: e.target.value,
                    },
                  })
                }
                placeholder="Subject"
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
              <textarea
                value={emailTemplates.orderConfirmation.body}
                onChange={(e) =>
                  setEmailTemplates({
                    ...emailTemplates,
                    orderConfirmation: {
                      ...emailTemplates.orderConfirmation,
                      body: e.target.value,
                    },
                  })
                }
                placeholder="Email body"
                rows={3}
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
            </div>

            {/* Payment Success */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                Payment Success
              </label>
              <input
                type="text"
                value={emailTemplates.paymentSuccess.subject}
                onChange={(e) =>
                  setEmailTemplates({
                    ...emailTemplates,
                    paymentSuccess: {
                      ...emailTemplates.paymentSuccess,
                      subject: e.target.value,
                    },
                  })
                }
                placeholder="Subject"
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
              <textarea
                value={emailTemplates.paymentSuccess.body}
                onChange={(e) =>
                  setEmailTemplates({
                    ...emailTemplates,
                    paymentSuccess: {
                      ...emailTemplates.paymentSuccess,
                      body: e.target.value,
                    },
                  })
                }
                placeholder="Email body"
                rows={3}
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
            </div>

            {/* Seller Payout */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                Seller Payout
              </label>
              <input
                type="text"
                value={emailTemplates.sellerPayout.subject}
                onChange={(e) =>
                  setEmailTemplates({
                    ...emailTemplates,
                    sellerPayout: {
                      ...emailTemplates.sellerPayout,
                      subject: e.target.value,
                    },
                  })
                }
                placeholder="Subject"
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
              <textarea
                value={emailTemplates.sellerPayout.body}
                onChange={(e) =>
                  setEmailTemplates({
                    ...emailTemplates,
                    sellerPayout: {
                      ...emailTemplates.sellerPayout,
                      body: e.target.value,
                    },
                  })
                }
                placeholder="Email body"
                rows={3}
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
            </div>
          </div>
        </div>

        {/* SMS Templates Card */}
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
              SMS Templates
            </h2>
          </div>

          <div className="space-y-4">
            {/* Order Shipped */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                Order Shipped
              </label>
              <textarea
                value={smsTemplates.orderShipped}
                onChange={(e) =>
                  setSmsTemplates({
                    ...smsTemplates,
                    orderShipped: e.target.value,
                  })
                }
                placeholder="SMS message (160 characters max)"
                rows={2}
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
            </div>

            {/* Delivery Confirmation */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                Delivery Confirmation
              </label>
              <textarea
                value={smsTemplates.deliveryConfirmation}
                onChange={(e) =>
                  setSmsTemplates({
                    ...smsTemplates,
                    deliveryConfirmation: e.target.value,
                  })
                }
                placeholder="SMS message (160 characters max)"
                rows={2}
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
            </div>

            {/* Payout Alert */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                Payout Alert
              </label>
              <textarea
                value={smsTemplates.payoutAlert}
                onChange={(e) =>
                  setSmsTemplates({
                    ...smsTemplates,
                    payoutAlert: e.target.value,
                  })
                }
                placeholder="SMS message (160 characters max)"
                rows={2}
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
            </div>
          </div>
        </div>

        {/* Push Notification Templates Card */}
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
              Push Notification Templates
            </h2>
          </div>

          <div className="space-y-4">
            {/* New Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                New Order Notification
              </label>
              <input
                type="text"
                value={pushTemplates.newOrder.title}
                onChange={(e) =>
                  setPushTemplates({
                    ...pushTemplates,
                    newOrder: {
                      ...pushTemplates.newOrder,
                      title: e.target.value,
                    },
                  })
                }
                placeholder="Notification title"
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
              <textarea
                value={pushTemplates.newOrder.body}
                onChange={(e) =>
                  setPushTemplates({
                    ...pushTemplates,
                    newOrder: {
                      ...pushTemplates.newOrder,
                      body: e.target.value,
                    },
                  })
                }
                placeholder="Notification body"
                rows={2}
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
            </div>

            {/* Livestream Start */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                Livestream Starting
              </label>
              <input
                type="text"
                value={pushTemplates.livestreamStart.title}
                onChange={(e) =>
                  setPushTemplates({
                    ...pushTemplates,
                    livestreamStart: {
                      ...pushTemplates.livestreamStart,
                      title: e.target.value,
                    },
                  })
                }
                placeholder="Notification title"
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
              <textarea
                value={pushTemplates.livestreamStart.body}
                onChange={(e) =>
                  setPushTemplates({
                    ...pushTemplates,
                    livestreamStart: {
                      ...pushTemplates.livestreamStart,
                      body: e.target.value,
                    },
                  })
                }
                placeholder="Notification body"
                rows={2}
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
            </div>

            {/* Price Alert */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-[rgba(0,0,0,0.7)]">
                Price Drop Alert
              </label>
              <input
                type="text"
                value={pushTemplates.priceAlert.title}
                onChange={(e) =>
                  setPushTemplates({
                    ...pushTemplates,
                    priceAlert: {
                      ...pushTemplates.priceAlert,
                      title: e.target.value,
                    },
                  })
                }
                placeholder="Notification title"
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
              <textarea
                value={pushTemplates.priceAlert.body}
                onChange={(e) =>
                  setPushTemplates({
                    ...pushTemplates,
                    priceAlert: {
                      ...pushTemplates.priceAlert,
                      body: e.target.value,
                    },
                  })
                }
                placeholder="Notification body"
                rows={2}
                className="w-full px-4 py-2 border border-[rgba(0,0,0,0.2)] rounded-lg focus:outline-none focus:border-[#E67E22]"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}