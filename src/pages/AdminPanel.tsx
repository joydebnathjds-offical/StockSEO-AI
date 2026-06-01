import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAppStore, type AdminUser, type UserTier } from "../store/useAppStore";
import { GlassCard } from "../components/ui/GlassCard";
import {
  Users, Shield, Zap, TrendingUp, Star, Crown, Search, Filter,
  Edit3, Check, X, Plus, Minus, RotateCcw, BarChart3,
  Activity, Database, ChevronDown,
} from "lucide-react";
import { cn } from "../utils/cn";
import toast from "react-hot-toast";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const TIER_CONFIG: Record<UserTier, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  BASIC: { label: "BASIC", color: "text-slate-400", bg: "bg-slate-400/10", icon: <span className="text-[10px] font-bold">FREE</span> },
  PRO: { label: "PRO", color: "text-cyan-400", bg: "bg-cyan-400/10", icon: <Star className="w-3 h-3" /> },
  PREMIUM: { label: "PREMIUM", color: "text-violet-400", bg: "bg-violet-400/10", icon: <Zap className="w-3 h-3" /> },
  ENTERPRISE: { label: "ENTERPRISE", color: "text-amber-400", bg: "bg-amber-400/10", icon: <Crown className="w-3 h-3" /> },
};

const SYSTEM_STATS = [
  { label: "Images Processed", value: "2.4M+", icon: <BarChart3 className="w-5 h-5" />, gradient: "from-cyan-400 to-blue-500", sub: "+18K this week" },
  { label: "Active Contributors", value: "12K+", icon: <Users className="w-5 h-5" />, gradient: "from-violet-400 to-purple-500", sub: "+340 this month" },
  { label: "Avg SEO Score", value: "88.4", icon: <TrendingUp className="w-5 h-5" />, gradient: "from-emerald-400 to-teal-500", sub: "+2.1 pts this week" },
  { label: "Product Rating", value: "4.9/5", icon: <Star className="w-5 h-5" />, gradient: "from-amber-400 to-orange-500", sub: "Based on 3.2K reviews" },
];

const MOCK_ACTIVITY = [
  { time: "00:00", users: 120 }, { time: "04:00", users: 80 },
  { time: "08:00", users: 340 }, { time: "12:00", users: 890 },
  { time: "16:00", users: 1100 }, { time: "20:00", users: 760 },
];

const TIER_PIE_DATA = [
  { name: "BASIC", value: 6200, color: "#64748b" },
  { name: "PRO", value: 3400, color: "#00C4CC" },
  { name: "PREMIUM", value: 1900, color: "#a855f7" },
  { name: "ENTERPRISE", value: 500, color: "#f59e0b" },
];

export const AdminPanel: React.FC<{ tab: string }> = ({ tab }) => {
  const { adminUsers, updateAdminUser } = useAppStore();
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<UserTier | "ALL">("ALL");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [creditInput, setCreditInput] = useState<Record<string, number>>({});
  const [showTierMenu, setShowTierMenu] = useState<string | null>(null);

  const filtered = adminUsers.filter((u) => {
    const matchSearch = !search || u.email.includes(search) || u.displayName.toLowerCase().includes(search.toLowerCase());
    const matchTier = filterTier === "ALL" || u.tier === filterTier;
    return matchSearch && matchTier;
  });

  const handleTierChange = (uid: string, tier: UserTier) => {
    updateAdminUser(uid, { tier });
    setShowTierMenu(null);
    toast.success(`Tier updated to ${tier}`);
  };

  const handleCreditAction = (uid: string, action: "add" | "subtract" | "reset", user: AdminUser) => {
    const amount = creditInput[uid] || 0;
    let newCredits = user.credits;
    if (action === "add") newCredits = user.credits + amount;
    else if (action === "subtract") newCredits = Math.max(0, user.credits - amount);
    else newCredits = 0;

    updateAdminUser(uid, { credits: newCredits });
    setCreditInput((p) => ({ ...p, [uid]: 0 }));
    toast.success(`Credits ${action === "reset" ? "reset" : action === "add" ? "added" : "deducted"} successfully`);
  };

  const handleStatusToggle = (uid: string, currentStatus: "active" | "suspended") => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    updateAdminUser(uid, { status: newStatus });
    toast.success(`User ${newStatus}`);
  };

  if (tab === "admin-analytics") {
    return (
      <div className="p-6 space-y-6 overflow-y-auto h-full">
        <div>
          <h2 className="text-2xl font-black gradient-text-primary mb-1">System Analytics</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Platform-wide performance metrics and insights</p>
        </div>

        {/* System stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {SYSTEM_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="p-5 relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-3 shadow-xl animate-float`}>
                  {stat.icon}
                </div>
                <div className="text-3xl font-black text-[var(--color-text)]">{stat.value}</div>
                <div className="text-xs text-[var(--color-text-muted)] mt-0.5 font-medium">{stat.label}</div>
                <div className="text-xs text-emerald-400 font-semibold mt-2">{stat.sub}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity chart */}
          <GlassCard className="lg:col-span-2 p-5">
            <div className="flex items-center gap-2 mb-4 font-semibold text-[var(--color-text)]">
              <Activity className="w-4 h-4 text-pink-400" />
              Live User Activity (24h)
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MOCK_ACTIVITY}>
                <defs>
                  <linearGradient id="activityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF4EAD" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#FF4EAD" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(148,163,184,0.7)" }} />
                <Tooltip contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#f1f5f9", fontSize: "12px" }} />
                <Area type="monotone" dataKey="users" stroke="#FF4EAD" strokeWidth={2.5} fill="url(#activityGrad)" name="Active Users" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Tier distribution */}
          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-4 font-semibold text-[var(--color-text)]">
              <Database className="w-4 h-4 text-violet-400" />
              Tier Distribution
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={TIER_PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {TIER_PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#f1f5f9", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {TIER_PIE_DATA.map((t) => (
                <div key={t.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                    <span className="text-[var(--color-text-muted)]">{t.name}</span>
                  </div>
                  <span className="font-semibold text-[var(--color-text)]">{t.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (tab === "admin-credits") {
    return (
      <div className="p-6 space-y-6 overflow-y-auto h-full">
        <div>
          <h2 className="text-2xl font-black gradient-text-primary mb-1">Credit Manager</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Allocate, adjust, and monitor user credit balances</p>
        </div>

        <GlassCard>
          <div className="p-4 border-b border-[var(--color-glass-border)] flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-glass w-full pl-9 pr-4 py-2 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-glass-border)]">
                  {["User", "Tier", "Credits", "Adjust Credits", "Cap", "Total Generated"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr key={user.uid} className="table-row-hover border-b border-[var(--color-glass-border)] last:border-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full btn-gradient flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                          {user.displayName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[var(--color-text)]">{user.displayName}</div>
                          <div className="text-xs text-[var(--color-text-muted)]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold", TIER_CONFIG[user.tier].color, TIER_CONFIG[user.tier].bg)}>
                        {TIER_CONFIG[user.tier].icon}
                        {user.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-bold text-[var(--color-text)]">{user.credits.toLocaleString()}</div>
                          <div className="w-20 h-1 bg-white/10 rounded-full mt-1">
                            <div
                              className="progress-bar-fill h-full"
                              style={{ width: `${Math.min(100, (user.credits / user.usageCap) * 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          value={creditInput[user.uid] || ""}
                          onChange={(e) => setCreditInput((p) => ({ ...p, [user.uid]: parseInt(e.target.value) || 0 }))}
                          placeholder="Amount"
                          className="input-glass w-20 px-2 py-1.5 rounded-lg text-xs"
                        />
                        <button onClick={() => handleCreditAction(user.uid, "add", user)} title="Add" className="w-7 h-7 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 flex items-center justify-center cursor-pointer transition-all">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleCreditAction(user.uid, "subtract", user)} title="Subtract" className="w-7 h-7 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 flex items-center justify-center cursor-pointer transition-all">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleCreditAction(user.uid, "reset", user)} title="Reset" className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 hover:bg-amber-400/20 flex items-center justify-center cursor-pointer transition-all">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[var(--color-text)]">{user.usageCap.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-[var(--color-text)]">{user.totalGenerated.toLocaleString()}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    );
  }

  // Default: User Management
  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black gradient-text-primary mb-1">User Management</h2>
          <p className="text-sm text-[var(--color-text-muted)]">{adminUsers.length} total registered accounts</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl glass-surface border border-pink-400/30 text-pink-400 text-xs font-bold">
          <Shield className="w-3.5 h-3.5" />
          Admin Console
        </div>
      </div>

      <GlassCard>
        {/* Filters */}
        <div className="p-4 border-b border-[var(--color-glass-border)] flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-glass w-full pl-9 pr-4 py-2 rounded-xl text-sm"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-[var(--color-text-muted)]" />
            {(["ALL", "BASIC", "PRO", "PREMIUM", "ENTERPRISE"] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setFilterTier(tier)}
                className={cn(
                  "px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border",
                  filterTier === tier
                    ? "btn-gradient text-white border-transparent"
                    : "border-[var(--color-glass-border)] text-[var(--color-text-muted)] hover:border-cyan-400/40"
                )}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-glass-border)]">
                {["User", "Tier Override", "Credits", "Total Generated", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.uid} className="table-row-hover border-b border-[var(--color-glass-border)] last:border-0 transition-all">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center text-white text-sm font-bold flex-shrink-0 shadow-md">
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[var(--color-text)]">{user.displayName}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Tier override */}
                  <td className="px-5 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setShowTierMenu(showTierMenu === user.uid ? null : user.uid)}
                        className={cn(
                          "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer transition-all",
                          TIER_CONFIG[user.tier].color,
                          TIER_CONFIG[user.tier].bg,
                          "border-current/20 hover:border-current/40"
                        )}
                      >
                        {TIER_CONFIG[user.tier].icon}
                        {user.tier}
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      {showTierMenu === user.uid && (
                        <div className="absolute top-full mt-1 left-0 glass-card border border-[var(--color-glass-border)] rounded-xl p-1 z-30 min-w-[130px] shadow-xl">
                          {(["BASIC", "PRO", "PREMIUM", "ENTERPRISE"] as UserTier[]).map((tier) => (
                            <button
                              key={tier}
                              onClick={() => handleTierChange(user.uid, tier)}
                              className={cn(
                                "w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-all cursor-pointer",
                                user.tier === tier
                                  ? `${TIER_CONFIG[tier].color} ${TIER_CONFIG[tier].bg} font-bold`
                                  : "text-[var(--color-text-muted)] hover:bg-white/5 hover:text-[var(--color-text)]"
                              )}
                            >
                              {TIER_CONFIG[tier].icon}
                              {tier}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="text-sm font-bold text-[var(--color-text)]">{user.credits.toLocaleString()}</div>
                    <div className="text-xs text-[var(--color-text-muted)]">/{user.usageCap.toLocaleString()} cap</div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-[var(--color-text)]">{user.totalGenerated.toLocaleString()}</span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleStatusToggle(user.uid, user.status)}
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-all border",
                        user.status === "active"
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20"
                          : "text-red-400 bg-red-400/10 border-red-400/30 hover:bg-red-400/20"
                      )}
                    >
                      {user.status}
                    </button>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-xs text-[var(--color-text-muted)]">{user.createdAt}</span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      {editingUser === user.uid ? (
                        <>
                          <button onClick={() => setEditingUser(null)} className="w-7 h-7 rounded-lg bg-emerald-400/10 text-emerald-400 flex items-center justify-center cursor-pointer hover:bg-emerald-400/20 transition-all">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setEditingUser(null)} className="w-7 h-7 rounded-lg bg-red-400/10 text-red-400 flex items-center justify-center cursor-pointer hover:bg-red-400/20 transition-all">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button onClick={() => setEditingUser(user.uid)} className="w-7 h-7 rounded-lg glass-surface text-[var(--color-text-muted)] flex items-center justify-center cursor-pointer hover:text-[var(--color-text)] hover:bg-white/10 transition-all">
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-[var(--color-glass-border)]">
          <span className="text-xs text-[var(--color-text-muted)]">Showing {filtered.length} of {adminUsers.length} users</span>
          <div className="flex items-center gap-1">
            {[1, 2, 3].map((p) => (
              <button key={p} className={cn("w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer transition-all", p === 1 ? "btn-gradient text-white" : "glass-surface text-[var(--color-text-muted)] hover:text-[var(--color-text)]")}>
                {p}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Click outside for tier menu */}
      {showTierMenu && <div className="fixed inset-0 z-20" onClick={() => setShowTierMenu(null)} />}
    </div>
  );
};

export default AdminPanel;
