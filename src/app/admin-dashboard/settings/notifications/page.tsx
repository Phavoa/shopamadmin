"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, MessageSquare, Bell, Loader2, 
  ChevronRight, Settings, Info, Save, ShieldCheck, Zap, Send
} from "lucide-react";
import { 
  useGetEmailTemplatesQuery, 
  useUpdateEmailTemplateMutation,
  useGetSmsTemplatesQuery,
  useUpdateSmsTemplateMutation,
  useGetPushTemplatesQuery,
  useUpdatePushTemplateMutation,
  EmailTemplate,
  SmsTemplate,
  PushTemplate
} from "@/api/notificationTemplatesApi";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { useDispatch, useSelector } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";
import TestPushModal from "@/components/shared/TestPushModal";
import BroadcastPushModal from "@/components/shared/BroadcastPushModal";
import { RootState } from "@/lib/store/store";

export default function NotificationSettingsPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setHeaderTitle("Notification Settings"));
  }, [dispatch]);

  const { data: emailData, isLoading: isLoadingEmail, error: emailError } = useGetEmailTemplatesQuery();
  const { data: smsData, isLoading: isLoadingSms, error: smsError } = useGetSmsTemplatesQuery();
  const { data: pushData, isLoading: isLoadingPush, error: pushError } = useGetPushTemplatesQuery();

  const [updateEmail] = useUpdateEmailTemplateMutation();
  const [updateSms] = useUpdateSmsTemplateMutation();
  const [updatePush] = useUpdatePushTemplateMutation();

  const [emailNotifications, setEmailNotifications] = useState<EmailTemplate[]>([]);
  const [smsNotifications, setSmsNotifications] = useState<SmsTemplate[]>([]);
  const [pushNotifications, setPushNotifications] = useState<PushTemplate[]>([]);

  const [isSaving, setIsSaving] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const humanizeKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/[_-]/g, " ")
      .replace(/\//g, " - ")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  React.useEffect(() => {
    const items = emailData?.data?.items || (emailData as any)?.items;
    if (items) setEmailNotifications(items);
  }, [emailData]);

  React.useEffect(() => {
    const items = smsData?.data?.items || (smsData as any)?.items;
    if (items) setSmsNotifications(items);
  }, [smsData]);

  React.useEffect(() => {
    const items = pushData?.data?.items || (pushData as any)?.items;
    if (items) setPushNotifications(items);
  }, [pushData]);

  const handleSave = async () => {
    setIsSaving(true);
    const id = toast.loading("Saving changes...");
    try {
      const promises: Promise<any>[] = [];
      emailNotifications.forEach((t) => promises.push(updateEmail({ id: t.id, body: { isActive: t.isActive } }).unwrap()));
      smsNotifications.forEach((t) => promises.push(updateSms({ id: t.id, body: { isActive: t.isActive } }).unwrap()));
      pushNotifications.forEach((t) => promises.push(updatePush({ id: t.id, body: { isActive: t.isActive } }).unwrap()));
      await Promise.all(promises);
      toast.success("Settings updated successfully!", { id });
    } catch (error) {
      toast.error("Failed to update settings.", { id });
    } finally {
      setIsSaving(false);
    }
  };

  const isInitialLoading = (isLoadingEmail && !emailData) || (isLoadingSms && !smsData) || (isLoadingPush && !pushData);
  const hasError = emailError || smsError || pushError;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-[#FAFAFA]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#E67E22]/20 border-t-[#E67E22] rounded-full animate-spin"></div>
          <Settings className="w-6 h-6 text-[#E67E22] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm text-gray-500 font-medium animate-pulse">Syncing preferences...</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-[#FAFAFA]">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-2">
          <Info className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
        <p className="text-sm text-gray-500 text-center max-w-xs leading-relaxed">
          We couldn't load your notification settings. Please try again later.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-3 bg-[#E67E22] text-white rounded-xl font-bold hover:shadow-lg transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  const activeCount = 
    emailNotifications.filter(t => t.isActive).length + 
    smsNotifications.filter(t => t.isActive).length + 
    pushNotifications.filter(t => t.isActive).length;

  const totalCount = emailNotifications.length + smsNotifications.length + pushNotifications.length;

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans antialiased">
      <div className="max-w-7xl mx-auto px-6 py-6">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <h1 className="text-[var(--text-display-size)] font-bold tracking-tight text-[var(--color-text-primary)]">Notification Settings</h1>
            <p className="text-[var(--text-body-size)] text-[var(--color-text-secondary)] font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Configure how automated alerts are delivered across channels
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(true)}
                className="px-6 py-2.5 bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-[var(--radius-md)] font-semibold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95"
              >
                <Send className="w-4 h-4 text-red-500" />
                Broadcast Push
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsTestModalOpen(true)}
              className="px-6 py-2.5 bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-[var(--radius-md)] font-semibold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-purple-600" />
              Test Push
            </button>
            <button
              onClick={() => router.push("/admin-dashboard/settings/notifications/templates")}
              className="px-6 py-2.5 bg-white border border-[var(--color-border)] text-[var(--color-text-primary)] rounded-[var(--radius-md)] font-semibold text-sm shadow-sm hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <Zap className="w-4 h-4 text-[var(--primary)]" />
              Message Templates
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-2.5 bg-[var(--primary)] text-white rounded-[var(--radius-md)] font-bold text-sm shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Settings
            </button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--card-gap)] mb-10">
          <MetricCard label="Active Alerts" value={activeCount} total={totalCount} color="orange" />
          <MetricCard label="System Integrity" value="100%" subValue="All delivery channels online" color="green" />
          <MetricCard label="Configuration" value="Custom" subValue="Last changed 2h ago" color="blue" />
        </div>

        {/* Content Sections */}
        <div className="space-y-10">
          <AnimatePresence mode="popLayout">
            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <SectionHeader 
                icon={Mail} 
                title="Email Notifications" 
                count={emailNotifications.length} 
                color="orange" 
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--card-gap)]">
                {emailNotifications.map((t, idx) => (
                  <NotificationToggle 
                    key={t.id} 
                    template={t} 
                    humanizeKey={humanizeKey}
                    onChange={(isActive) => {
                      const newList = [...emailNotifications];
                      newList[idx] = { ...t, isActive };
                      setEmailNotifications(newList);
                    }}
                  />
                ))}
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="space-y-4"
            >
              <SectionHeader 
                icon={MessageSquare} 
                title="SMS Notifications" 
                count={smsNotifications.length} 
                color="blue" 
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--card-gap)]">
                {smsNotifications.map((t, idx) => (
                  <NotificationToggle 
                    key={t.id} 
                    template={t} 
                    humanizeKey={humanizeKey}
                    onChange={(isActive) => {
                      const newList = [...smsNotifications];
                      newList[idx] = { ...t, isActive };
                      setSmsNotifications(newList);
                    }}
                  />
                ))}
              </div>
            </motion.section>

            <motion.section 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <SectionHeader 
                icon={Bell} 
                title="Push Notifications" 
                count={pushNotifications.length} 
                color="purple" 
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--card-gap)]">
                {pushNotifications.map((t, idx) => (
                  <NotificationToggle 
                    key={t.id} 
                    template={t} 
                    humanizeKey={humanizeKey}
                    onChange={(isActive) => {
                      const newList = [...pushNotifications];
                      newList[idx] = { ...t, isActive };
                      setPushNotifications(newList);
                    }}
                  />
                ))}
              </div>
            </motion.section>
          </AnimatePresence>
        </div>
      </div>
      <TestPushModal isOpen={isTestModalOpen} onOpenChange={setIsTestModalOpen} />
      <BroadcastPushModal isOpen={isBroadcastModalOpen} onOpenChange={setIsBroadcastModalOpen} />
    </div>
  );
}

// --- Sub-components ---

function MetricCard({ label, value, total, subValue, color }: { label: string, value: any, total?: number, subValue?: string, color: string }) {
  const colorMap: Record<string, string> = {
    orange: "text-[var(--primary)] bg-orange-50",
    green: "text-green-600 bg-green-50",
    blue: "text-blue-600 bg-blue-50",
  };
  
  return (
    <div className="bg-white p-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-level1)] relative overflow-hidden group">
      <p className="text-[var(--text-caption-size)] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-baseline gap-2">
        <h4 className="text-3xl font-bold text-[var(--color-text-primary)]">{value}</h4>
        {total && <span className="text-sm text-[var(--color-text-secondary)]">/ {total}</span>}
      </div>
      {subValue && <p className="text-[10px] text-[var(--color-text-secondary)] mt-1 font-medium">{subValue}</p>}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, count, color }: { icon: any, title: string, count: number, color: string }) {
  const colorMap: Record<string, string> = {
    orange: "bg-orange-50 text-[var(--primary)] border-orange-100",
    blue: "bg-blue-50 text-blue-500 border-blue-100",
    purple: "bg-purple-50 text-purple-500 border-purple-100",
  };

  return (
    <div className="flex items-center gap-4 py-2">
      <div className={`w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center border ${colorMap[color]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-[var(--text-h2-size)] font-bold text-[var(--color-text-primary)]">{title}</h2>
        <p className="text-[var(--text-small-size)] text-[var(--color-text-secondary)] font-medium">{count} automated triggers</p>
      </div>
    </div>
  );
}

function NotificationToggle({ template, humanizeKey, onChange }: { template: any, humanizeKey: any, onChange: (v: boolean) => void }) {
  return (
    <div className="bg-white p-5 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-level1)] hover:border-[var(--primary)]/30 transition-all flex items-center justify-between group">
      <div className="space-y-1">
        <h4 className="text-[var(--text-body-size)] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--primary)] transition-colors">
          {humanizeKey(template.key)}
        </h4>
        <div className="flex items-center gap-2">
          <code className="text-[9px] text-[var(--color-text-secondary)] font-mono uppercase tracking-tight bg-gray-50 px-1.5 py-0.5 rounded">
            {template.key}
          </code>
          {template.isActive && (
            <span className="flex items-center gap-1 text-[9px] font-bold text-green-600">
              <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              Active
            </span>
          )}
        </div>
      </div>
      <Switch 
        checked={template.isActive} 
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-[var(--primary)]"
      />
    </div>
  );
}