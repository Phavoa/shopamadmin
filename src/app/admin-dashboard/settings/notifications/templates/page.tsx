"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, Mail, MessageSquare, Bell, Loader2, FileText, 
  Search, Eye, Copy, Check, Info, X, ChevronRight, Layout, Send
} from "lucide-react";
import { 
  useGetEmailTemplatesQuery, 
  useUpdateEmailTemplateMutation,
  useGetSmsTemplatesQuery,
  useUpdateSmsTemplateMutation,
  useGetPushTemplatesQuery,
  useUpdatePushTemplateMutation,
  useSendTestPushMutation,
  EmailTemplate,
  SmsTemplate,
  PushTemplate
} from "@/api/notificationTemplatesApi";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import * as Dialog from "@radix-ui/react-dialog";
import { useDispatch } from "react-redux";
import { setHeaderTitle } from "@/features/shared/headerSice";

export default function MessageTemplatesPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(setHeaderTitle("Message Templates"));
  }, [dispatch]);

  const { data: emailData, isLoading: isLoadingEmail, error: emailError } = useGetEmailTemplatesQuery();
  const { data: smsData, isLoading: isLoadingSms, error: smsError } = useGetSmsTemplatesQuery();
  const { data: pushData, isLoading: isLoadingPush, error: pushError } = useGetPushTemplatesQuery();

  const [updateEmail] = useUpdateEmailTemplateMutation();
  const [updateSms] = useUpdateSmsTemplateMutation();
  const [updatePush] = useUpdatePushTemplateMutation();
  const [sendTestPush] = useSendTestPushMutation();

  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
  const [pushTemplates, setPushTemplates] = useState<PushTemplate[]>([]);

  const [activeTab, setActiveTab] = useState<"email" | "sms" | "push">("email");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

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
    if (items) setEmailTemplates(items);
  }, [emailData]);

  React.useEffect(() => {
    const items = smsData?.data?.items || (smsData as any)?.items;
    if (items) setSmsTemplates(items);
  }, [smsData]);

  React.useEffect(() => {
    const items = pushData?.data?.items || (pushData as any)?.items;
    if (items) setPushTemplates(items);
  }, [pushData]);

  const handleSave = async () => {
    setIsSaving(true);
    const id = toast.loading("Saving templates...");
    try {
      const promises: Promise<any>[] = [];
      emailTemplates.forEach((t) => promises.push(updateEmail({ id: t.id, body: { subject: t.subject, htmlBody: t.htmlBody } }).unwrap()));
      smsTemplates.forEach((t) => promises.push(updateSms({ id: t.id, body: { body: t.body } }).unwrap()));
      pushTemplates.forEach((t) => promises.push(updatePush({ id: t.id, body: { title: t.title, body: t.body } }).unwrap()));
      await Promise.all(promises);
      toast.success("All templates saved successfully!", { id });
    } catch (error) {
      toast.error("Failed to save some templates.", { id });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEmail = emailTemplates.filter(t => 
    t.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSms = smsTemplates.filter(t => 
    t.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPush = pushTemplates.filter(t => 
    t.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isInitialLoading = (isLoadingEmail && !emailData) || (isLoadingSms && !smsData) || (isLoadingPush && !pushData);
  const hasError = emailError || smsError || pushError;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-6 bg-[#FAFAFA]">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#E67E22]/20 border-t-[#E67E22] rounded-full animate-spin"></div>
          <Layout className="w-6 h-6 text-[#E67E22] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <p className="text-sm text-gray-500 font-medium animate-pulse text-center">
          Building your workspace...<br/>
          <span className="text-[10px] text-gray-400 font-normal">Synchronizing notification templates</span>
        </p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-[#FAFAFA]">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-2">
          <Info className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Connection Failed</h2>
        <p className="text-sm text-gray-500 max-w-xs text-center leading-relaxed">
          We couldn't reach the server. Please check your network or refresh the page.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-8 py-3 bg-[#E67E22] text-white rounded-xl font-bold hover:shadow-lg hover:shadow-[#E67E22]/20 transition-all active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] font-sans antialiased text-[var(--color-text-primary)]">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Top Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="space-y-1">
            <button
              onClick={() => router.push("/admin-dashboard/settings/notifications")}
              className="group flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--primary)] transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Settings</span>
            </button>
            <h1 className="text-[var(--text-display-size)] font-bold tracking-tight">Message Templates</h1>
            <p className="text-[var(--text-body-size)] text-[var(--color-text-secondary)] font-medium">Design and personalize multi-channel notifications</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-[var(--radius-md)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] transition-all w-[240px] shadow-sm"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-[var(--radius-md)] font-bold shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save All
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-sm mb-8 w-fit">
          <TabButton active={activeTab === "email"} onClick={() => setActiveTab("email")} icon={Mail} label="Email" />
          <TabButton active={activeTab === "sms"} onClick={() => setActiveTab("sms")} icon={MessageSquare} label="SMS" />
          <TabButton active={activeTab === "push"} onClick={() => setActiveTab("push")} icon={Bell} label="Push" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--card-gap)]">
          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {activeTab === "email" && (
                  <div className="space-y-6">
                    {filteredEmail.length === 0 && <EmptyState label="No email templates found" />}
                    {filteredEmail.map((template, idx) => (
                      <EmailCard 
                        key={template.id} 
                        template={template} 
                        humanizeKey={humanizeKey}
                        onPreview={() => setPreviewTemplate(template)}
                        onChange={(updated) => {
                          const newList = [...emailTemplates];
                          const realIdx = emailTemplates.findIndex(t => t.id === template.id);
                          newList[realIdx] = updated;
                          setEmailTemplates(newList);
                        }}
                      />
                    ))}
                  </div>
                )}

                {activeTab === "sms" && (
                  <div className="space-y-6">
                    {filteredSms.length === 0 && <EmptyState label="No SMS templates found" />}
                    {filteredSms.map((template) => (
                      <SmsCard 
                        key={template.id} 
                        template={template} 
                        humanizeKey={humanizeKey}
                        onChange={(updated) => {
                          const newList = [...smsTemplates];
                          const realIdx = smsTemplates.findIndex(t => t.id === template.id);
                          newList[realIdx] = updated;
                          setSmsTemplates(newList);
                        }}
                      />
                    ))}
                  </div>
                )}

                {activeTab === "push" && (
                  <div className="space-y-6">
                    {filteredPush.length === 0 && <EmptyState label="No push templates found" />}
                    {filteredPush.map((template) => (
                      <PushCard 
                        key={template.id} 
                        template={template} 
                        humanizeKey={humanizeKey}
                        onSendTest={async (t) => {
                          const id = toast.loading("Sending test push...");
                          try {
                            const res = await sendTestPush({
                              title: t.title,
                              body: t.body,
                              data: { test: true }
                            }).unwrap();
                            if (res.success > 0) {
                              toast.success(`Test push sent successfully to ${res.success} device(s)!`, { id });
                            } else {
                              toast.error("Failed to send push: No active tokens found for your account.", { id });
                            }
                          } catch (err: any) {
                            toast.error(err?.data?.message || "Failed to send test push.", { id });
                          }
                        }}
                        onChange={(updated) => {
                          const newList = [...pushTemplates];
                          const realIdx = pushTemplates.findIndex(t => t.id === template.id);
                          newList[realIdx] = updated;
                          setPushTemplates(newList);
                        }}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Sidebar - Toolbox */}
          <div className="lg:col-span-4">
            <div className="sticky top-6 space-y-6">
              <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] shadow-[var(--shadow-level2)] p-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <h3 className="text-[var(--text-h3-size)] font-bold mb-4 flex items-center gap-2">
                  <Layout className="w-5 h-5 text-[var(--primary)]" />
                  Placeholders
                </h3>
                <p className="text-[var(--text-small-size)] text-[var(--color-text-secondary)] mb-6 leading-relaxed">
                  Personalize your messages using these variables. Click any tag to copy.
                </p>
                <div className="flex flex-wrap gap-2">
                  {getUniqueVariables(emailTemplates, smsTemplates, pushTemplates).map(variable => (
                    <VariableBadge key={variable} name={variable} />
                  ))}
                </div>
              </div>

              <div className="bg-[#1A1A1A] rounded-[var(--radius-lg)] p-6 text-white overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/20 rounded-full -mr-16 -mt-16 blur-2xl transition-all group-hover:scale-150"></div>
                <h3 className="text-lg font-bold mb-2">Editor Guide</h3>
                <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                  Emails support full HTML formatting. Use variables within double curly braces like <code>{"{{"}name{"}}"}</code>.
                </p>
                <button 
                  onClick={() => router.push("/admin-dashboard/settings/notifications/docs")}
                  className="text-xs font-bold text-[var(--primary)] flex items-center gap-1 hover:gap-2 transition-all"
                >
                  View Documentation <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <Dialog.Root open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[85vh] bg-white rounded-[var(--radius-lg)] shadow-2xl z-[101] overflow-hidden flex flex-col outline-none">
                <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between bg-white sticky top-0">
                  <div>
                    <Dialog.Title className="text-xl font-bold">Email Preview</Dialog.Title>
                    <Dialog.Description className="text-xs text-[var(--color-text-secondary)]">Subject: {previewTemplate.subject}</Dialog.Description>
                  </div>
                  <button onClick={() => setPreviewTemplate(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-12 flex justify-center">
                  <div 
                    className="w-full max-w-[650px] bg-white shadow-xl rounded-xl border border-gray-100 min-h-[400px] h-fit"
                    dangerouslySetInnerHTML={{ __html: previewTemplate.htmlBody }}
                  />
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Components ---

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-6 py-2 rounded-[var(--radius-sm)] text-sm font-bold transition-all
        ${active ? 'bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20' : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-gray-50'}
      `}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function EmailCard({ template, humanizeKey, onPreview, onChange }: { template: EmailTemplate, humanizeKey: any, onPreview: () => void, onChange: (t: EmailTemplate) => void }) {
  return (
    <div className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-level1)] hover:shadow-[var(--shadow-level2)] transition-all p-6 group">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-orange-50 flex items-center justify-center text-[var(--primary)]">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] leading-none mb-1">{humanizeKey(template.key)}</h3>
            <code className="text-[10px] text-[var(--color-text-secondary)] font-mono uppercase tracking-tight">{template.key}</code>
          </div>
        </div>
        <button 
          onClick={onPreview}
          className="p-2.5 bg-gray-50 text-[var(--color-text-secondary)] hover:text-[var(--primary)] hover:bg-orange-50 rounded-[var(--radius-sm)] transition-all flex items-center gap-2 text-xs font-bold"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">Subject Line</label>
          <input 
            type="text" 
            value={template.subject}
            onChange={(e) => onChange({ ...template, subject: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] transition-all font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">HTML Body</label>
          <textarea 
            value={template.htmlBody}
            onChange={(e) => onChange({ ...template, htmlBody: e.target.value })}
            rows={6}
            className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-[13px] font-mono focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/10 focus:border-[var(--primary)] transition-all leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}

function SmsCard({ template, humanizeKey, onChange }: { template: SmsTemplate, humanizeKey: any, onChange: (t: SmsTemplate) => void }) {
  return (
    <div className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-level1)] hover:shadow-[var(--shadow-level2)] transition-all p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-blue-50 flex items-center justify-center text-blue-500">
          <MessageSquare className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-bold text-[var(--color-text-primary)] leading-none mb-1">{humanizeKey(template.key)}</h3>
          <code className="text-[10px] text-[var(--color-text-secondary)] font-mono uppercase tracking-tight">{template.key}</code>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">Message Content</label>
        <textarea 
          value={template.body}
          onChange={(e) => onChange({ ...template, body: e.target.value })}
          rows={3}
          className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/50 transition-all"
        />
        <div className="flex justify-end pr-2">
          <span className={`text-[10px] font-bold ${template.body.length > 160 ? 'text-red-400' : 'text-[var(--color-text-secondary)]'}`}>
            {template.body.length}/160 characters
          </span>
        </div>
      </div>
    </div>
  );
}

function PushCard({ template, humanizeKey, onChange, onSendTest }: { template: PushTemplate, humanizeKey: any, onChange: (t: PushTemplate) => void, onSendTest: (t: PushTemplate) => void }) {
  return (
    <div className="bg-white rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-level1)] hover:shadow-[var(--shadow-level2)] transition-all p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[var(--radius-sm)] bg-purple-50 flex items-center justify-center text-purple-500">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-[var(--color-text-primary)] leading-none mb-1">{humanizeKey(template.key)}</h3>
            <code className="text-[10px] text-[var(--color-text-secondary)] font-mono uppercase tracking-tight">{template.key}</code>
          </div>
        </div>
        <button 
          onClick={() => onSendTest(template)}
          className="p-2.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-[var(--radius-sm)] transition-all flex items-center gap-2 text-xs font-bold"
        >
          <Send className="w-4 h-4" />
          Send Test
        </button>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">Notification Title</label>
          <input 
            type="text" 
            value={template.title}
            onChange={(e) => onChange({ ...template, title: e.target.value })}
            className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all font-medium"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-[var(--color-text-secondary)] uppercase tracking-wider ml-1">Content Body</label>
          <textarea 
            value={template.body}
            onChange={(e) => onChange({ ...template, body: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/10 focus:border-purple-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
}

function VariableBadge({ name }: { name: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(`{{${name}}}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="group flex items-center gap-1.5 px-3 py-1.5 bg-[var(--color-background)] hover:bg-orange-50 border border-[var(--color-border)] rounded-[var(--radius-sm)] transition-all active:scale-95"
    >
      <span className="text-[11px] font-mono font-bold text-[var(--color-text-secondary)] group-hover:text-[var(--primary)]">{"{{"}{name}{"}}"}</span>
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-300 group-hover:text-[var(--primary)]" />}
    </button>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
        <Search className="w-8 h-8 text-gray-200" />
      </div>
      <p className="text-gray-400 font-medium">{label}</p>
    </div>
  );
}

function getUniqueVariables(emails: EmailTemplate[], sms: SmsTemplate[], push: PushTemplate[]) {
  const vars = new Set<string>();
  emails.forEach(t => t.variables.forEach(v => vars.add(v)));
  sms.forEach(t => t.variables.forEach(v => vars.add(v)));
  push.forEach(t => t.variables.forEach(v => vars.add(v)));
  return Array.from(vars);
}