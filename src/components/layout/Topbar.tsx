import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/Button";
import {
  Bell, Zap, LogOut, User, Shield, Settings, ChevronDown,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import toast from "react-hot-toast";
import { cn } from "../../utils/cn";

const PLATFORM_LABELS: Record<string, string> = {
  shutterstock: "Shutterstock",
  "adobe-stock": "Adobe Stock",
  freepik: "Freepik",
  istock: "iStock",
  dreamstime: "Dreamstime",
  alamy: "Alamy",
};

const ENGINE_LABELS: Record<string, string> = {
  "gemini-2.5-pro": "Gemini 2.5 Pro",
  "gemini-2.5-flash": "Gemini 2.5 Flash",
  "gpt-4o": "GPT-4o",
  "gpt-5": "GPT-5",
  "grok-4": "Grok 4",
  "grok-fast": "Grok Fast",
};

const CREDIT_THRESHOLDS = {
  critical: 2,
  low: 5,
};

export const Topbar: React.FC = () => {
  const {
    currentUser, logout, setShowAuthModal, isAdmin,
    selectedPlatform, setSelectedPlatform,
    selectedEngine, setSelectedEngine,
    activeTab,
  } = useAppStore();

  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [showEngineMenu, setShowEngineMenu] = React.useState(false);
  const [showPlatformMenu, setShowPlatformMenu] = React.useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch {}
    logout();
    toast.success("Signed out successfully");
    setShowUserMenu(false);
  };

  const creditColor = currentUser
    ? currentUser.credits <= CREDIT_THRESHOLDS.critical
      ? "text-red-400 bg-red-400/10 border-red-400/30"
      : currentUser.credits <= CREDIT_THRESHOLDS.low
      ? "text-amber-400 bg-amber-400/10 border-amber-400/30"
      : "text-emerald-400 bg-emerald-400/10 border-emerald-400/30"
    : "";

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      workspace: "AI Workspace",
      dashboard: "Dashboard",
      analytics: "SEO Analytics",
      billing: "Credits & Plans",
      settings: "Settings",
      help: "Help & Documentation",
      "admin-users": "User Management",
      "admin-analytics": "System Analytics",
      "admin-credits": "Credit Manager",
    };
    return titles[activeTab] || "StockSEO AI";
  };

  return (
    <header className="flex-shrink-0 glass-surface border-b border-[var(--color-glass-border)] px-4 py-3 flex items-center justify-between gap-4 relative z-10">
      {/* Left: Page title */}
      <div className="flex items-center gap-3">
        <h1 className="text-base font-bold text-[var(--color-text)]">{getPageTitle()}</h1>
        {isAdmin && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-400 text-xs font-bold">
            <Shield className="w-3 h-3" />
            ADMIN
          </div>
        )}
      </div>

      {/* Center: Engine & Platform selectors */}
      {(activeTab === "workspace") && (
        <div className="flex items-center gap-2 flex-1 justify-center">
          {/* Engine selector */}
          <div className="relative">
            <button
              onClick={() => { setShowEngineMenu((v) => !v); setShowPlatformMenu(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-surface border border-[var(--color-glass-border)] hover:border-cyan-400/50 dark:hover:border-pink-400/50 text-xs font-semibold text-[var(--color-text)] transition-all cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400 dark:text-pink-400" />
              {ENGINE_LABELS[selectedEngine]}
              <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)]" />
            </button>
            {showEngineMenu && (
              <div className="absolute top-full mt-1 left-0 glass-card border border-[var(--color-glass-border)] rounded-xl p-1 min-w-[160px] z-50 shadow-xl">
                {Object.entries(ENGINE_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedEngine(key as import("../../store/useAppStore").AIEngine); setShowEngineMenu(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs rounded-lg transition-all cursor-pointer",
                      selectedEngine === key
                        ? "bg-cyan-400/10 dark:bg-pink-400/10 text-cyan-400 dark:text-pink-400 font-semibold"
                        : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Platform selector */}
          <div className="relative">
            <button
              onClick={() => { setShowPlatformMenu((v) => !v); setShowEngineMenu(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-surface border border-[var(--color-glass-border)] hover:border-cyan-400/50 dark:hover:border-pink-400/50 text-xs font-semibold text-[var(--color-text)] transition-all cursor-pointer"
            >
              <span className="text-violet-400">●</span>
              {PLATFORM_LABELS[selectedPlatform]}
              <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)]" />
            </button>
            {showPlatformMenu && (
              <div className="absolute top-full mt-1 left-0 glass-card border border-[var(--color-glass-border)] rounded-xl p-1 min-w-[150px] z-50 shadow-xl">
                {Object.entries(PLATFORM_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSelectedPlatform(key as import("../../store/useAppStore").Platform); setShowPlatformMenu(false); }}
                    className={cn(
                      "w-full text-left px-3 py-2 text-xs rounded-lg transition-all cursor-pointer",
                      selectedPlatform === key
                        ? "bg-violet-400/10 text-violet-400 font-semibold"
                        : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right: Actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Credits badge */}
        {currentUser && (
          <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold", creditColor)}>
            <Zap className="w-3.5 h-3.5" />
            {currentUser.credits.toLocaleString()} credits
          </div>
        )}

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-xl glass-surface hover:bg-white/10 transition-all cursor-pointer">
          <Bell className="w-4 h-4 text-[var(--color-text-muted)]" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-pink-400" />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User menu */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-surface hover:bg-white/10 transition-all cursor-pointer border border-[var(--color-glass-border)] hover:border-cyan-400/40 dark:hover:border-pink-400/40"
            >
              <div className="w-6 h-6 rounded-full btn-gradient flex items-center justify-center text-white text-xs font-bold">
                {currentUser.displayName.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-[var(--color-text)] max-w-[80px] truncate">
                {currentUser.displayName}
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--color-text-muted)]" />
            </button>

            {showUserMenu && (
              <div className="absolute top-full mt-2 right-0 glass-card border border-[var(--color-glass-border)] rounded-xl p-1 min-w-[180px] z-50 shadow-xl">
                <div className="px-3 py-2 border-b border-[var(--color-glass-border)] mb-1">
                  <div className="text-xs font-semibold text-[var(--color-text)] truncate">{currentUser.displayName}</div>
                  <div className="text-[10px] text-[var(--color-text-muted)] truncate">{currentUser.email}</div>
                </div>
                <MenuBtn icon={<User className="w-4 h-4" />} label="Profile" onClick={() => setShowUserMenu(false)} />
                <MenuBtn icon={<Settings className="w-4 h-4" />} label="Settings" onClick={() => setShowUserMenu(false)} />
                <div className="border-t border-[var(--color-glass-border)] mt-1 pt-1">
                  <MenuBtn icon={<LogOut className="w-4 h-4" />} label="Sign Out" onClick={handleLogout} danger />
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="gradient"
            size="sm"
            onClick={() => setShowAuthModal(true)}
          >
            Sign In
          </Button>
        )}
      </div>

      {/* Click outside overlay */}
      {(showUserMenu || showEngineMenu || showPlatformMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowUserMenu(false); setShowEngineMenu(false); setShowPlatformMenu(false); }}
        />
      )}
    </header>
  );
};

const MenuBtn: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }> = ({
  icon, label, onClick, danger,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg transition-all cursor-pointer",
      danger
        ? "text-red-400 hover:bg-red-400/10"
        : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5"
    )}
  >
    {icon}
    {label}
  </button>
);

export default Topbar;
