import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { GlassCard } from "../components/ui/GlassCard";
import { SEOScoreRing } from "../components/ui/SEOScoreRing";
import { BarChart3, TrendingUp, Target, Tag, FileText, Zap, Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend,
} from "recharts";
import toast from "react-hot-toast";

const PLATFORM_DATA = [
  { platform: "Shutterstock", count: 45, score: 87 },
  { platform: "Adobe Stock", count: 32, score: 91 },
  { platform: "Freepik", count: 28, score: 79 },
  { platform: "iStock", count: 19, score: 85 },
  { platform: "Dreamstime", count: 14, score: 82 },
  { platform: "Alamy", count: 11, score: 88 },
];

const RADAR_DATA = [
  { metric: "Keyword Density", current: 88, benchmark: 75 },
  { metric: "Title Length", current: 92, benchmark: 80 },
  { metric: "Description", current: 79, benchmark: 70 },
  { metric: "Tag Count", current: 95, benchmark: 85 },
  { metric: "Readability", current: 83, benchmark: 75 },
  { metric: "Uniqueness", current: 76, benchmark: 70 },
];

export const Analytics: React.FC = () => {
  const { generatedAssets } = useAppStore();

  const avgScore = generatedAssets.length
    ? Math.round(generatedAssets.reduce((s, a) => s + a.seoScore, 0) / generatedAssets.length)
    : 84;

  const totalTags = generatedAssets.reduce((s, a) => s + a.tags.length, 0);
  const avgTags = generatedAssets.length ? Math.round(totalTags / generatedAssets.length) : 38;
  const avgTitleLen = generatedAssets.length
    ? Math.round(generatedAssets.reduce((s, a) => s + a.title.length, 0) / generatedAssets.length)
    : 96;

  const handleExportCSV = () => {
    if (!generatedAssets.length) { toast.error("No data to export"); return; }
    const headers = ["Filename", "Title", "Description", "Tags", "Category", "SEO Score", "Platform", "Date"];
    const rows = generatedAssets.map((a) => [
      a.filename, `"${a.title}"`, `"${a.description}"`, `"${a.tags.join("; ")}"`,
      a.category, a.seoScore, a.platform, new Date(a.generatedAt).toLocaleDateString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "stockseo-ai-export.csv"; a.click();
    toast.success("CSV exported successfully!");
  };

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black gradient-text-primary mb-1">SEO Analytics</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Performance insights across all your generated metadata</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl glass-surface border border-[var(--color-glass-border)] hover:border-cyan-400/50 dark:hover:border-pink-400/50 text-sm font-semibold text-[var(--color-text)] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4 text-cyan-400 dark:text-pink-400" />
          Export CSV
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg SEO Score", value: `${avgScore}`, icon: <Target className="w-5 h-5" />, grad: "from-emerald-400 to-teal-500", sub: "Overall quality" },
          { label: "Avg Tag Count", value: `${avgTags}`, icon: <Tag className="w-5 h-5" />, grad: "from-cyan-400 to-blue-500", sub: "Per image" },
          { label: "Avg Title Length", value: `${avgTitleLen}`, icon: <FileText className="w-5 h-5" />, grad: "from-violet-400 to-purple-500", sub: "Characters" },
          { label: "Total Keywords", value: totalTags.toLocaleString(), icon: <Zap className="w-5 h-5" />, grad: "from-pink-400 to-rose-500", sub: "Generated" },
        ].map((k, i) => (
          <motion.div key={k.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <GlassCard className="p-5">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${k.grad} flex items-center justify-center text-white mb-3 shadow-lg`}>{k.icon}</div>
              <div className="text-2xl font-black text-[var(--color-text)]">{k.value}</div>
              <div className="text-xs text-[var(--color-text-muted)] mt-0.5">{k.label}</div>
              <div className="text-xs text-[var(--color-text-muted)] font-medium mt-1">{k.sub}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform breakdown */}
        <GlassCard className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4 font-semibold text-[var(--color-text)]">
            <BarChart3 className="w-4 h-4 text-cyan-400 dark:text-pink-400" />
            Platform Performance
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={PLATFORM_DATA} barGap={4}>
              <defs>
                <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00C4CC" />
                  <stop offset="100%" stopColor="#007BFF" />
                </linearGradient>
                <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF4EAD" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <XAxis dataKey="platform" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "rgba(148,163,184,0.8)" }} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#f1f5f9", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(148,163,184,0.8)" }} />
              <Bar dataKey="count" name="Images" fill="url(#barGrad1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="score" name="SEO Score" fill="url(#barGrad2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        {/* Score ring */}
        <GlassCard className="p-5 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 mb-4 font-semibold text-[var(--color-text)] self-start">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Overall Score
          </div>
          <SEOScoreRing score={avgScore} size={160} />
          <div className="mt-4 space-y-2 w-full">
            {[
              { label: "vs last week", value: "+5.2", positive: true },
              { label: "vs benchmark", value: "+13.4", positive: true },
              { label: "platform best", value: "Adobe Stock", positive: null },
            ].map(({ label, value, positive }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-[var(--color-text-muted)]">{label}</span>
                <span className={positive === true ? "text-emerald-400 font-semibold" : positive === false ? "text-red-400 font-semibold" : "text-[var(--color-text)] font-semibold"}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Radar chart */}
      <GlassCard className="p-5">
        <div className="flex items-center gap-2 mb-4 font-semibold text-[var(--color-text)]">
          <Target className="w-4 h-4 text-violet-400" />
          SEO Quality Metrics vs Industry Benchmark
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={RADAR_DATA} cx="50%" cy="50%">
            <PolarGrid stroke="rgba(255,255,255,0.06)" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "rgba(148,163,184,0.8)" }} />
            <Radar name="Your Score" dataKey="current" stroke="#00C4CC" fill="#00C4CC" fillOpacity={0.2} strokeWidth={2} />
            <Radar name="Benchmark" dataKey="benchmark" stroke="#FF4EAD" fill="#FF4EAD" fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 4" />
            <Legend wrapperStyle={{ fontSize: "12px", color: "rgba(148,163,184,0.8)" }} />
            <Tooltip contentStyle={{ background: "rgba(15,23,42,0.9)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#f1f5f9", fontSize: "12px" }} />
          </RadarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );
};

export default Analytics;
