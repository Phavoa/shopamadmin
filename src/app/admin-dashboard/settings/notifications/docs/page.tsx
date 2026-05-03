"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, BookOpen, Code, Mail, MessageSquare, 
  Bell, CheckCircle2, AlertCircle, Info, Copy, 
  ChevronRight, Sparkles, ShieldCheck, Zap
} from "lucide-react";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import { motion } from "framer-motion";

export default function NotificationDocsPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setHeaderTitle("Documentation"));
  }, [dispatch]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans antialiased text-[var(--color-text-primary)]">
      <div className="max-w-5xl mx-auto px-6 py-6 pb-20">
        
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => router.push("/admin-dashboard/settings/notifications/templates")}
            className="group flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--primary)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Editor</span>
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-[var(--text-display-size)] font-bold tracking-tight">Notification System Guide</h1>
          </div>
          <p className="text-[var(--text-body-size)] text-[var(--color-text-secondary)] max-w-2xl">
            Learn how to manage, edit, and personalize automated communications across Email, SMS, and Push channels.
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Section 1: Overview */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-xl font-bold">System Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
                <Mail className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">Full HTML support for branded, rich-text notifications like receipts and welcomes.</p>
              </div>
              <div className="p-6 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
                <MessageSquare className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-bold mb-2">SMS</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">Short, high-urgency text messages. Best for OTPs and immediate order alerts.</p>
              </div>
              <div className="p-6 bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm">
                <Bell className="w-8 h-8 text-purple-500 mb-4" />
                <h3 className="font-bold mb-2">Push</h3>
                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">Real-time app notifications to keep users engaged with live auctions and followers.</p>
              </div>
            </div>
          </motion.section>

          {/* Section 2: Editing Templates */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
              <Zap className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-xl font-bold">How to Edit & Save</h2>
            </div>
            <div className="bg-white p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-sm space-y-8">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">1</div>
                <div>
                  <h4 className="font-bold mb-1">Select Category</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">Navigate to the <b>Message Templates</b> page and use the tabs at the top to choose between Email, SMS, or Push.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">2</div>
                <div>
                  <h4 className="font-bold mb-1">Modify Content</h4>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-3">Update the Subject Line, Title, or Message Body. For emails, you can paste raw HTML code directly into the editor.</p>
                  <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Pro Tip: Use the Preview Button</p>
                    <p className="text-xs text-gray-500 leading-relaxed">Always click the "Preview" button on email templates to verify your HTML layout before saving.</p>
                  </div>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm">3</div>
                <div>
                  <h4 className="font-bold mb-1">Save All Changes</h4>
                  <p className="text-sm text-[var(--color-text-secondary)]">Click the <b>"Save All"</b> button in the top right corner. This will sync all modified templates across all tabs to the server simultaneously.</p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 3: Variables */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
              <Code className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-xl font-bold">Dynamic Variables</h2>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Variables allow you to inject real user data into your messages. They must be wrapped in double curly braces: <code>{"{{"}variable_name{"}}"}</code>.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">Example Usage</h4>
                <div className="p-5 bg-white border border-[var(--color-border)] rounded-2xl space-y-4 shadow-sm">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Input</p>
                    <div className="p-3 bg-gray-50 rounded-lg text-xs font-mono text-gray-600">
                      Hello {"{{"}buyer_name{"}}"}, your order {"{{"}order_id{"}}"} has been shipped!
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-green-500 uppercase">Output</p>
                    <div className="p-3 bg-green-50 rounded-lg text-xs font-medium text-green-700">
                      Hello John Doe, your order #SH-12345 has been shipped!
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400">Common Placeholders</h4>
                <div className="space-y-2">
                  <VariableRow name="buyer_name" desc="The full name of the user receiving the notification." />
                  <VariableRow name="seller_name" desc="The name of the vendor or auctioneer." />
                  <VariableRow name="order_id" desc="The unique tracking ID for a purchase." />
                  <VariableRow name="amount" desc="Currency formatted value (e.g. ₦25,000)." />
                  <VariableRow name="item_name" desc="Title of the product related to the alert." />
                </div>
              </div>
            </div>
          </motion.section>

          {/* Section 4: Activation */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-4">
              <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />
              <h2 className="text-xl font-bold">Activating Triggers</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="flex-1 space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                <p>Editing a template does not automatically start sending it. You must ensure the <b>Trigger</b> is active in the main settings.</p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Go to <b>Notification Settings</b> (the landing page).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Locate the event you want to enable (e.g. "Buyer - New Items").</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Toggle the switch to the "Active" state.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>Click <b>"Save Settings"</b> at the top of the page.</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-72 p-6 bg-blue-50 rounded-3xl border border-blue-100 relative overflow-hidden">
                <Info className="w-12 h-12 text-blue-200 absolute -top-2 -right-2 rotate-12" />
                <h4 className="text-blue-700 font-bold mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Important
                </h4>
                <p className="text-xs text-blue-600 leading-relaxed font-medium">
                  If a template is updated but the toggle is "Off", the system will not send any messages for that event.
                </p>
              </div>
            </div>
          </motion.section>

        </div>

        {/* Footer CTA */}
        <div className="mt-20 p-10 bg-[#1A1A1A] rounded-[var(--radius-lg)] text-white text-center space-y-6">
          <h2 className="text-2xl font-bold">Ready to start editing?</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto">Your changes will take effect immediately for all subsequent notifications sent by the system.</p>
          <div className="flex items-center justify-center gap-4">
            <button 
              onClick={() => router.push("/admin-dashboard/settings/notifications")}
              className="px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition-all active:scale-95"
            >
              Go to Settings
            </button>
            <button 
              onClick={() => router.push("/admin-dashboard/settings/notifications/templates")}
              className="px-8 py-3 bg-[var(--primary)] text-white rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-all active:scale-95"
            >
              Open Editor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function VariableRow({ name, desc }: { name: string, desc: string }) {
  return (
    <div className="group flex items-center justify-between p-3 hover:bg-white hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-[var(--color-border)]">
      <div>
        <code className="text-xs font-bold text-[var(--primary)]">{"{{"}{name}{"}}"}</code>
        <p className="text-[10px] text-gray-400 font-medium">{desc}</p>
      </div>
      <button 
        onClick={() => navigator.clipboard.writeText(`{{${name}}}`)}
        className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-50 rounded-lg transition-all"
      >
        <Copy className="w-3 h-3 text-gray-300" />
      </button>
    </div>
  );
}
