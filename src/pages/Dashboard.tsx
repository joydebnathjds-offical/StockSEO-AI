import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { GlassCard } from "../components/ui/GlassCard";
import { Button } from "../components/ui/Button";
import { SEOScoreRing } from "../components/ui/SEOScoreRing";
import {
  ImagePlus, Zap, BarChart3, Star, TrendingUp, Clock, ArrowRight,
  Sparkles, Tag, FileText, Target,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const MOCK_CHART_DATA = [
  { day: "Mon", images: 4, score: 78 },
  { day: "Tue", images: 7, score: 82 },
  { day: "Wed", images: 3, score: 75 },
  { day: "Thu", images: 9, score: 88 },
  { day: "Fri", images: 6, score: 84 },
  { day: "Sat", images: 11, score: 91 },
  { day: "Sun", images: 8, score: 86 },
];

const PLATFORM_LOGOS: Record<string, string> = {
  shutterstock: "SS",
  "adobe-stock": "AS",
  freepik: "FP",
  istock: "iS",
  dreamstime: "DT",
  alamy: "AL",
};

const PLATFORM_COLORS: Record<string, string> = {
  shutterstock: "from-red-500 to-orange-500",
  "adobe-stock": "from-red-600 to-red-400",
  freepik: "from-blue-500 to-cyan-500",
  istock: "from-green-500 to-emerald-500",
  dreamstime: "from-violet-500 to-purple-500",
  alamy: "from-orange-500 to-amber-500",
};

export const Dashboard: React.FC = () => {
  const { currentUser, generatedAssets, setActiveTab } = useAppStore();

  const avgScore = generatedAssets.length
    ? Math.round(generatedAssets.reduce((s, a) => s + a.seoScore, 0) / generatedAssets.length)
    : 0;

  const creditPct = currentUser ? Math.round((currentUser.credits / currentUser.usageCap) * 100) : 0;

  const STATS = [
    {
      label: "Images Processed",
      value: generatedAssets.length.toString(),
      icon: <ImagePlus className="w-5 h-5" />,
      gradient: "from-cyan-400 to-blue-500",
      change: "+12%",
    },
    {
      label: "Avg SEO Score",
      value: avgScore > 0 ? avgScore.toString() : "—",
      icon: <Target className="w-5 h-5" />,
      gradient: "from-emerald-400 to-teal-500",
      change: "+5 pts",
    },
    {
      label: "Credits Remaining",
      value: currentUser?.credits.toLocaleString() ?? "0",
      icon: <Zap className="w-5 h-5" />,
      gradient: "from-violet-400 to-purple-500",
      change: `${creditPct}% left`,
    },
    {
      label: "Tags Generated",
      value: generatedAssets.reduce((s, a) => s + a.tags.length, 0).toLocaleString(),
      icon: <Tag className="w-5 h-5" />,
      gradient: "from-pink-400 to-rose-500",
      change: "Keywords",
    },
  ];

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      {/* Welcome banner */}
      <motion.div
        className="glass-card p-6 overflow-hidden relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute -right-16 -top-16 w-64 h-64 glow-orb-cyan opacity-20 pointer-events-none" />
        <div className="absolute -right-8 -bottom-8 w-48 h-48 glow-orb-pink opacity-15 pointer-events-none" />

        <div className="flex items-center justify-between relative z-10">
          <div>
            <h2 className="text-2xl font-black text-[var(--color-text)] mb-1">
              Welcome back, {currentUser?.displayName?.split(" ")[0] || "Contributor"} 👋
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm">
              You're on the <span className="font-bold text-cyan-400 dark:text-pink-400">{currentUser?.tier || "BASIC"}</span> plan.
              {currentUser?.tier === "BASIC" && " Upgrade for unlimited AI generations."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {currentUser?.tier === "BASIC" && (
              <Button
                variant="gradient"
                onClick={() => useAppStore.getState().setShowPaywall(true)}
                icon={<Sparkles className="w-4 h-4" />}
              >
                Upgrade Plan
              </Button>
            )}
            <Button
              variant="glass"
              onClick={() => setActiveTab("workspace")}
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              Go to Workspace
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <GlassCard className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white mb-3 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-black text-[var(--color-text)]">{stat.value}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{stat.label}</div>
              <div className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stat.change}
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
              <BarChart3 className="w-4 h-4 text-cyan-400 dark:text-pink-400" />
              Weekly Activity
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">Last 7 days</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MOCK_CHART_DATA}>
              <defs>
                <linearGradient id="gradImages" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C4CC" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#00C4CC" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="gradScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4EAD" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#FF4EAD" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "rgba(148,163,184,0.8)" }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  background: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#f1f5f9",
                }}
              />
              <Area type="monotone" dataKey="images" stroke="#00C4CC" strokeWidth={2} fill="url(#gradImages)" name="Images" />
              <Area type="monotone" dataKey="score" stroke="#FF4EAD" strokeWidth={2} fill="url(#gradScore)" name="SEO Score" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* SEO Score summary */}
        <GlassCard className="p-5">
          <div className="flex items-center gap-2 font-semibold text-[var(--color-text)] mb-4">
            <Star className="w-4 h-4 text-amber-400" />
            SEO Performance
          </div>
          <div className="flex justify-center mb-4">
            <SEOScoreRing score={avgScore || 84} size={130} />
          </div>
          <div className="space-y-2">
            {[
              { label: "Title Optimization", pct: 88 },
              { label: "Tag Density", pct: 92 },
              { label: "Description Quality", pct: 79 },
            ].map(({ label, pct }) => (
              <div key={label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[var(--color-text-muted)]">{label}</span>
                  <span className="font-semibold text-[var(--color-text)]">{pct}%</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div className="progress-bar-fill h-full" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent assets */}
      <GlassCard>
        <div className="flex items-center justify-between p-5 border-b border-[var(--color-glass-border)]">
          <div className="flex items-center gap-2 font-semibold text-[var(--color-text)]">
            <Clock className="w-4 h-4 text-cyan-400 dark:text-pink-400" />
            Recent Generations
          </div>
          {generatedAssets.length > 0 && (
            <button onClick={() => setActiveTab("analytics")} className="text-xs text-cyan-400 dark:text-pink-400 font-semibold hover:underline cursor-pointer flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {generatedAssets.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl glass-surface flex items-center justify-center mx-auto mb-4">
              <ImagePlus className="w-8 h-8 text-[var(--color-text-muted)]" />
            </div>
            <p className="text-[var(--color-text-muted)] text-sm font-medium">No images processed yet</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Go to workspace to get started</p>
            <Button className="mt-4" onClick={() => setActiveTab("workspace")} icon={<Zap className="w-4 h-4" />}>
              Start Generating
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-glass-border)]">
                  {["Image", "Title", "Platform", "Tags", "SEO Score", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {generatedAssets.slice(0, 8).map((asset) => (
                  <tr key={asset.id} className="table-row-hover border-b border-[var(--color-glass-border)] last:border-0 transition-all">
                    <td className="px-5 py-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/10 flex-shrink-0">
                        {asset.previewUrl ? (
                          <img src={asset.previewUrl} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FileText className="w-4 h-4 text-[var(--color-text-muted)]" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm font-medium text-[var(--color-text)] max-w-[200px] truncate">{asset.title}</div>
                      <div className="text-xs text-[var(--color-text-muted)]">{asset.filename}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${PLATFORM_COLORS[asset.platform] || "from-slate-500 to-slate-600"} text-white text-xs font-bold`}>
                        {PLATFORM_LOGOS[asset.platform] || "??"}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm text-[var(--color-text)]">{asset.tags.length}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="progress-bar-fill h-full" style={{ width: `${asset.seoScore}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-[var(--color-text)]">{asset.seoScore}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-xs text-[var(--color-text-muted)]">
                        {new Date(asset.generatedAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default Dashboard;
