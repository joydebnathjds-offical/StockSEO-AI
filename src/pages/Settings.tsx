import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Settings as SettingsIcon, Key, Bell, Monitor, Zap, Eye, EyeOff, Check, Save } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "../utils/cn";

export const Settings: React.FC = () => {
  const { currentUser, selectedEngine, setSelectedEngine, theme } = useAppStore();
  const [apiKeys, setApiKeys] = useState({ gemini: "", openai: "", grok: "" });
  const [showKeys, setShowKeys] = useState({ gemini: false, openai: false, grok: false });
  const [notifications, setNotifications] = useState({ email: true, browser: false, weekly: true });

  const handleSaveApiKey = (provider: string) => {
    toast.success(`${provider} API key saved`);
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-black gradient-text-primary mb-1">Settings</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Configure your workspace and preferences</p>
      </div>

      {/* Profile section */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <SettingsIcon className="w-5 h-5 text-cyan-400 dark:text-pink-400" />
          <h3 className="font-bold text-[var(--color-text)]">Profile Information</h3>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center text-white text-2xl font-black shadow-xl">
            {currentUser?.displayName?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <div className="text-lg font-bold text-[var(--color-text)]">{currentUser?.displayName || "Guest"}</div>
            <div className="text-sm text-[var(--color-text-muted)]">{currentUser?.email || "Not signed in"}</div>
            <div className="text-xs text-cyan-400 dark:text-pink-400 font-bold mt-1">{currentUser?.tier || "BASIC"} Plan</div>
          </div>
        </div>
      </GlassCard>

      {/* Appearance */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Monitor className="w-5 h-5 text-violet-400" />
          <h3 className="font-bold text-[var(--color-text)]">Appearance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[var(--color-text)]">Color Theme</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-0.5">Currently: {theme === "dark" ? "Dark Mode" : "Light Mode"}</div>
          </div>
          <ThemeToggle />
        </div>
      </GlassCard>

      {/* AI Engine */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Zap className="w-5 h-5 text-amber-400" />
          <h3 className="font-bold text-[var(--color-text)]">Default AI Engine</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {([
            { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", sub: "Fast & efficient" },
            { id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", sub: "High quality" },
            { id: "gpt-4o", label: "GPT-4o", sub: "OpenAI balanced" },
            { id: "gpt-5", label: "GPT-5", sub: "OpenAI premium" },
            { id: "grok-fast", label: "Grok Fast", sub: "xAI speed" },
            { id: "grok-4", label: "Grok 4", sub: "xAI quality" },
          ] as const).map((engine) => (
            <button
              key={engine.id}
              onClick={() => setSelectedEngine(engine.id)}
              className={cn(
                "flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer",
                selectedEngine === engine.id
                  ? "border-cyan-400/60 dark:border-pink-400/60 bg-cyan-400/5 dark:bg-pink-400/5"
                  : "border-[var(--color-glass-border)] hover:border-cyan-400/30"
              )}
            >
              <div>
                <div className="text-sm font-semibold text-[var(--color-text)]">{engine.label}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{engine.sub}</div>
              </div>
              {selectedEngine === engine.id && (
                <Check className="w-4 h-4 text-cyan-400 dark:text-pink-400 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* API Keys */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Key className="w-5 h-5 text-emerald-400" />
          <h3 className="font-bold text-[var(--color-text)]">API Keys</h3>
        </div>
        <div className="space-y-4">
          {([
            { id: "gemini", label: "Google Gemini API Key", placeholder: "AIzaSy..." },
            { id: "openai", label: "OpenAI API Key", placeholder: "sk-..." },
            { id: "grok", label: "xAI Grok API Key", placeholder: "xai-..." },
          ] as const).map((provider) => (
            <div key={provider.id}>
              <label className="text-xs font-semibold text-[var(--color-text-muted)] block mb-2">{provider.label}</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type={showKeys[provider.id] ? "text" : "password"}
                    placeholder={provider.placeholder}
                    value={apiKeys[provider.id]}
                    onChange={(e) => setApiKeys((p) => ({ ...p, [provider.id]: e.target.value }))}
                    className="input-glass w-full px-4 py-2.5 rounded-xl text-sm pr-10"
                  />
                  <button
                    onClick={() => setShowKeys((p) => ({ ...p, [provider.id]: !p[provider.id] }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer transition-colors"
                  >
                    {showKeys[provider.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button variant="glass" size="md" onClick={() => handleSaveApiKey(provider.label)} icon={<Save className="w-4 h-4" />}>
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Notifications */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-[var(--color-text)]">Notifications</h3>
        </div>
        <div className="space-y-4">
          {([
            { id: "email", label: "Email Notifications", sub: "Receive updates via email" },
            { id: "browser", label: "Browser Notifications", sub: "Desktop push alerts" },
            { id: "weekly", label: "Weekly Digest", sub: "Summary of your activity" },
          ] as const).map((notif) => (
            <div key={notif.id} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-semibold text-[var(--color-text)]">{notif.label}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{notif.sub}</div>
              </div>
              <button
                onClick={() => setNotifications((p) => ({ ...p, [notif.id]: !p[notif.id] }))}
                className={cn(
                  "relative w-12 h-6 rounded-full transition-all duration-300 cursor-pointer flex-shrink-0",
                  notifications[notif.id]
                    ? "bg-gradient-to-r from-cyan-400 to-violet-500 dark:from-pink-500 dark:to-violet-500"
                    : "bg-white/10"
                )}
              >
                <span className={cn(
                  "absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300",
                  notifications[notif.id] ? "translate-x-7" : "translate-x-1"
                )} />
              </button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default Settings;
