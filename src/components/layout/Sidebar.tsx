import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import {
  Sparkles, LayoutDashboard, ImagePlus, BarChart3, Settings,
  ChevronLeft, ChevronRight, Users, Shield, Zap, Crown, Star,
  CreditCard, HelpCircle,
} from "lucide-react";
import { cn } from "../../utils/cn";

const NAV_ITEMS = [
  { id: "workspace", label: "AI Workspace", icon: <ImagePlus className="w-5 h-5" />, section: "main" },
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, section: "main" },
  { id: "analytics", label: "SEO Analytics", icon: <BarChart3 className="w-5 h-5" />, section: "main" },
  { id: "billing", label: "Credits & Plans", icon: <CreditCard className="w-5 h-5" />, section: "account" },
  { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" />, section: "account" },
  { id: "help", label: "Help & Docs", icon: <HelpCircle className="w-5 h-5" />, section: "account" },
];

const ADMIN_ITEMS = [
  { id: "admin-users", label: "User Management", icon: <Users className="w-5 h-5" /> },
  { id: "admin-analytics", label: "System Analytics", icon: <BarChart3 className="w-5 h-5" /> },
  { id: "admin-credits", label: "Credit Manager", icon: <Zap className="w-5 h-5" /> },
];

const TIER_ICONS = {
  BASIC: <span className="text-slate-400 text-xs font-bold">FREE</span>,
  PRO: <Star className="w-3.5 h-3.5 text-cyan-400" />,
  PREMIUM: <Zap className="w-3.5 h-3.5 text-violet-400" />,
  ENTERPRISE: <Crown className="w-3.5 h-3.5 text-amber-400" />,
};

const TIER_COLORS = {
  BASIC: "text-slate-400 bg-slate-400/10",
  PRO: "text-cyan-400 bg-cyan-400/10",
  PREMIUM: "text-violet-400 bg-violet-400/10",
  ENTERPRISE: "text-amber-400 bg-amber-400/10",
};

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed, activeTab, setActiveTab, currentUser, isAdmin } = useAppStore();

  const mainItems = NAV_ITEMS.filter((i) => i.section === "main");
  const accountItems = NAV_ITEMS.filter((i) => i.section === "account");

  return (
    <motion.aside
      className="flex-shrink-0 h-full glass-surface border-r border-[var(--color-glass-border)] flex flex-col relative z-10"
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 p-4 border-b border-[var(--color-glass-border)]">
        <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center flex-shrink-0 shadow-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="font-black text-sm gradient-text-primary leading-tight">StockSEO</div>
            <div className="text-xs text-[var(--color-text-muted)] font-medium">AI Platform</div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {/* Main section */}
        {!sidebarCollapsed && (
          <div className="px-2 mb-2">
            <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">Main</span>
          </div>
        )}
        {mainItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeTab === item.id}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab(item.id)}
          />
        ))}

        {/* Account section */}
        {!sidebarCollapsed && (
          <div className="px-2 mt-4 mb-2">
            <span className="text-[10px] font-bold tracking-widest text-[var(--color-text-muted)] uppercase">Account</span>
          </div>
        )}
        {sidebarCollapsed && <div className="h-4" />}
        {accountItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            active={activeTab === item.id}
            collapsed={sidebarCollapsed}
            onClick={() => setActiveTab(item.id)}
          />
        ))}

        {/* Admin section */}
        {isAdmin && (
          <>
            {!sidebarCollapsed && (
              <div className="px-2 mt-4 mb-2">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-pink-400" />
                  <span className="text-[10px] font-bold tracking-widest text-pink-400 uppercase">Admin Controls</span>
                </div>
              </div>
            )}
            {sidebarCollapsed && <div className="h-4" />}
            {ADMIN_ITEMS.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                active={activeTab === item.id}
                collapsed={sidebarCollapsed}
                onClick={() => setActiveTab(item.id)}
                isAdmin
              />
            ))}
          </>
        )}
      </div>

      {/* User info */}
      {currentUser && (
        <div className="p-3 border-t border-[var(--color-glass-border)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center flex-shrink-0 text-white text-xs font-bold shadow-md">
              {currentUser.displayName.charAt(0).toUpperCase()}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-[var(--color-text)] truncate">{currentUser.displayName}</div>
                <div className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold mt-0.5", TIER_COLORS[currentUser.tier])}>
                  {TIER_ICONS[currentUser.tier]}
                  {currentUser.tier}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full glass-surface border border-[var(--color-glass-border)] flex items-center justify-center hover:border-cyan-400/50 dark:hover:border-pink-400/50 transition-all cursor-pointer shadow-md z-10"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3 text-[var(--color-text-muted)]" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-[var(--color-text-muted)]" />
        )}
      </button>
    </motion.aside>
  );
};

interface NavItemProps {
  item: { id: string; label: string; icon: React.ReactNode };
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  isAdmin?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ item, active, collapsed, onClick, isAdmin }) => {
  return (
    <button
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer group",
        active
          ? isAdmin
            ? "bg-gradient-to-r from-pink-500/15 to-violet-500/10 border-l-3 border-pink-500 text-pink-400"
            : "sidebar-active text-[var(--color-text)]"
          : isAdmin
          ? "text-[var(--color-text-muted)] hover:text-pink-400 hover:bg-pink-500/5"
          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-white/5 dark:hover:bg-white/3"
      )}
    >
      <span className={cn(
        "flex-shrink-0 transition-colors",
        active && !isAdmin && "text-cyan-400 dark:text-pink-400",
        active && isAdmin && "text-pink-400",
      )}>
        {item.icon}
      </span>
      {!collapsed && (
        <span className="truncate">{item.label}</span>
      )}
    </button>
  );
};

export default Sidebar;
