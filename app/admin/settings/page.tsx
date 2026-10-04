"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Database,
  CheckCircle,
  AlertCircle,
  Save,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Instagram,
  Youtube,
  ExternalLink,
  Code,
  Copy,
  Check,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // Password change state
  const [pwForm, setPwForm] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
  const [pwChanging, setPwChanging] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [settings, setSettings] = useState({
    businessName: "JP CARS Kallakurichi",
    tagline: "Premium Pre-Owned Cars",
    phone: "+91 99438 82320",
    whatsapp: "+91 97518 82320",
    email: "contact@jpcars.in",
    address: "Kallakurichi, Tamil Nadu",
    hours: "Mon – Sat: 9:00 AM – 7:00 PM",
    googleMapsUrl: "https://maps.app.goo.gl/rbqMaVbvSzqXwjzk9",
    instagramUrl: "https://www.instagram.com/jp_cars_kallakurichi_/",
    youtubeUrl: "https://youtube.com/@jpcarskallakurichi",
    whatsappCommunityUrl: "https://chat.whatsapp.com/CC1299Sh5ia1z42NeJ3mBb?mode=ac_t",
    whatsappCatalogUrl: "https://wa.me/c/919751882320",
    currency: "INR (₹)",
  });

  const [dbStatus, setDbStatus] = useState({
    mode: "local_file",
    supabaseConfigured: false,
    hasSupabaseUrl: false,
    hasSupabaseAnonKey: false,
    status: "Active (Local Persistent Database)",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.success) {
          if (data.settings) setSettings(data.settings);
          if (data.database) setDbStatus(data.database);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const copyEnvSnippet = () => {
    const text = `NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key\nSUPABASE_SERVICE_ROLE_KEY=your-service-key`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied environment template to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (pwForm.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }
    try {
      setPwChanging(true);
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: pwForm.oldPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("✅ Password changed successfully!");
        setPwForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(data.error || "Failed to change password.");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setPwChanging(false);
    }
  };


  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-jp-text dark:text-white flex items-center gap-2">
          Settings & Configuration
        </h1>
        <p className="text-sm text-jp-muted mt-0.5">
          Manage business profile, contact details, and database connections.
        </p>
      </div>

      {/* Database Connection Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark space-y-4 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-jp-text dark:text-white text-base">
                Database Status
              </h2>
              <p className="text-xs text-jp-muted">
                Engine: {dbStatus.status}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            Operational & Persistent
          </span>
        </div>

        <div className="p-4 rounded-xl bg-jp-bg dark:bg-jp-black text-xs text-jp-text dark:text-jp-muted space-y-2 border border-jp-border dark:border-jp-border-dark">
          <div className="flex items-center justify-between">
            <span className="font-medium">Local JSON Database:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Enabled (/data/*.json)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Remote Supabase Project:</span>
            <span className={dbStatus.supabaseConfigured ? "text-emerald-600 font-semibold" : "text-jp-muted"}>
              {dbStatus.supabaseConfigured ? "Connected" : "Optional / Standby"}
            </span>
          </div>
        </div>

        <div className="border-t border-jp-border dark:border-jp-border-dark pt-4 space-y-3">
          <h3 className="font-semibold text-jp-text dark:text-white text-sm flex items-center gap-2">
            <Code className="w-4 h-4 text-jp-gold" />
            Connect External Supabase (Optional)
          </h3>
          <p className="text-xs text-jp-muted leading-relaxed">
            Your application runs with local file persistence in <code>data/</code> for Vehicles, Leads, Finance, Test Drives, Reviews, and FAQs. If you want cloud syncing with Supabase:
          </p>
          <ol className="list-decimal list-inside text-xs text-jp-muted space-y-1.5 pl-1">
            <li>Create a new project at <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-jp-gold hover:underline">supabase.com</a>.</li>
            <li>Run the migration script in <code>supabase/migrations/001_initial_schema.sql</code> inside the Supabase SQL Editor.</li>
            <li>Add your project credentials to <code>.env.local</code>:</li>
          </ol>

          <div className="relative">
            <pre className="p-3 rounded-lg bg-jp-bg dark:bg-jp-black text-xs font-mono text-jp-text dark:text-neutral-300 overflow-x-auto border border-jp-border dark:border-jp-border-dark">
{`NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...`}
            </pre>
            <button
              onClick={copyEnvSnippet}
              className="absolute right-2 top-2 p-1.5 rounded-md bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark text-jp-muted hover:text-jp-text text-xs flex items-center gap-1 shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      {/* Business Details Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark space-y-5 shadow-sm">
        <h2 className="font-bold text-jp-text dark:text-white text-base">
          Dealership Profile & Contact
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5">
              Dealership Name
            </label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings((p) => ({ ...p, businessName: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings((p) => ({ ...p, tagline: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-jp-gold" /> Calling Phone Number
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => setSettings((p) => ({ ...p, phone: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5 flex items-center gap-1.5">
              <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" /> WhatsApp Number
            </label>
            <input
              type="text"
              value={settings.whatsapp}
              onChange={(e) => setSettings((p) => ({ ...p, whatsapp: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-jp-gold" /> Working Hours
            </label>
            <input
              type="text"
              value={settings.hours}
              onChange={(e) => setSettings((p) => ({ ...p, hours: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-jp-gold" /> Location Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings((p) => ({ ...p, address: e.target.value }))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2 border-t border-jp-border dark:border-jp-border-dark">
          <h3 className="font-semibold text-jp-text dark:text-white text-sm">
            Social Media & Navigation Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5">
                Google Maps URL
              </label>
              <input
                type="text"
                value={settings.googleMapsUrl}
                onChange={(e) => setSettings((p) => ({ ...p, googleMapsUrl: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-xs text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5">
                Instagram URL
              </label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => setSettings((p) => ({ ...p, instagramUrl: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-xs text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5">
                YouTube Channel URL
              </label>
              <input
                type="text"
                value={settings.youtubeUrl}
                onChange={(e) => setSettings((p) => ({ ...p, youtubeUrl: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-xs text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5">
                WhatsApp Community URL
              </label>
              <input
                type="text"
                value={settings.whatsappCommunityUrl}
                onChange={(e) => setSettings((p) => ({ ...p, whatsappCommunityUrl: e.target.value }))}
                className="w-full px-3.5 py-2 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-xs text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
              />
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>
      </form>
      {/* ── Change Password Card ── */}
      <form
        onSubmit={handleChangePassword}
        className="p-6 rounded-2xl bg-white dark:bg-jp-dark border border-jp-border dark:border-jp-border-dark space-y-5 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-jp-gold/15 text-jp-gold flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-jp-text dark:text-white text-base">Change Admin Password</h2>
            <p className="text-xs text-jp-muted">Enter your current password to set a new one.</p>
          </div>
        </div>

        {/* Old Password */}
        <div>
          <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              required
              placeholder="Enter current password"
              value={pwForm.oldPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, oldPassword: e.target.value }))}
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-jp-muted hover:text-jp-text dark:hover:text-white"
            >
              {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              required
              minLength={6}
              placeholder="Min. 6 characters"
              value={pwForm.newPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))}
              className="w-full px-3.5 py-2.5 pr-10 rounded-xl bg-jp-bg dark:bg-jp-black border border-jp-border dark:border-jp-border-dark text-sm text-jp-text dark:text-white focus:outline-none focus:border-jp-gold"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-jp-muted hover:text-jp-text dark:hover:text-white"
            >
              {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* Strength bar */}
          {pwForm.newPassword.length > 0 && (
            <div className="mt-1.5 flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    pwForm.newPassword.length >= level * 3
                      ? level <= 1 ? "bg-red-400" : level <= 2 ? "bg-amber-400" : level <= 3 ? "bg-yellow-400" : "bg-green-500"
                      : "bg-jp-border dark:bg-jp-border-dark"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-xs font-semibold text-jp-text dark:text-white mb-1.5">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Re-enter new password"
              value={pwForm.confirmPassword}
              onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))}
              className={`w-full px-3.5 py-2.5 pr-10 rounded-xl bg-jp-bg dark:bg-jp-black border text-sm text-jp-text dark:text-white focus:outline-none transition-colors ${
                pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword
                  ? "border-red-400 focus:border-red-400"
                  : pwForm.confirmPassword && pwForm.confirmPassword === pwForm.newPassword
                  ? "border-green-500 focus:border-green-500"
                  : "border-jp-border dark:border-jp-border-dark focus:border-jp-gold"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-jp-muted hover:text-jp-text dark:hover:text-white"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {pwForm.confirmPassword && pwForm.confirmPassword !== pwForm.newPassword && (
            <p className="text-xs text-red-500 mt-1">Passwords do not match.</p>
          )}
          {pwForm.confirmPassword && pwForm.confirmPassword === pwForm.newPassword && (
            <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Passwords match!
            </p>
          )}
        </div>

        <div className="pt-1 flex justify-end">
          <button
            type="submit"
            disabled={pwChanging || !pwForm.oldPassword || !pwForm.newPassword || pwForm.newPassword !== pwForm.confirmPassword}
            className="btn btn-primary text-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <KeyRound className="w-4 h-4" />
            {pwChanging ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
