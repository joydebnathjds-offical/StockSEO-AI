import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { GlassCard } from "../components/ui/GlassCard";
import { Zap, Star, Crown, Building2, Check, MessageCircle, CreditCard, Clock, Shield } from "lucide-react";
import { cn } from "../utils/cn";

const WHATSAPP_URL = "https://wa.me/8801540595258";

const PLANS = [
  {
    id: "basic",
    name: "BASIC",
    price: "Free",
    period: "",
    credits: "10 Credits",
    icon: <Zap className="w-5 h-5" />,
    color: "from-slate-400 to-slate-500",
    features: ["10 AI generations total", "3 platform optimizations", "Basic SEO scoring", "Standard support"],
    cta: "Current Plan",
    disabled: true,
  },
  {
    id: "pro",
    name: "PRO",
    price: "$19",
    period: "/mo",
    credits: "500 Credits/mo",
    icon: <Star className="w-5 h-5" />,
    color: "from-cyan-400 to-blue-500",
    features: ["500 AI generations/month", "All 6 platforms", "Real-time SEO scoring", "CSV bulk export", "Priority support"],
    cta: "Upgrade to PRO",
    disabled: false,
    popular: false,
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "$49",
    period: "/mo",
    credits: "1,000 Credits/mo",
    icon: <Crown className="w-5 h-5" />,
    color: "from-violet-500 to-pink-500",
    features: ["1,000 AI generations/month", "GPT-5 & Gemini 2.5 Pro", "Bulk processing 50x", "API key integration", "Analytics dashboard", "Priority queue"],
    cta: "Upgrade to PREMIUM",
    disabled: false,
    popular: true,
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    price: "$99",
    period: "/mo",
    credits: "5,000 Credits/mo",
    icon: <Building2 className="w-5 h-5" />,
    color: "from-amber-400 to-orange-500",
    features: ["5,000 AI generations/month", "All PREMIUM features", "Custom AI tuning", "White-label exports", "Dedicated manager", "SLA guarantee"],
    cta: "Contact Sales",
    disabled: false,
    popular: false,
  },
];

export const Billing: React.FC = () => {
  const { currentUser } = useAppStore();

  const creditPct = currentUser
    ? Math.round((currentUser.credits / currentUser.usageCap) * 100)
    : 0;

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full">
      <div>
        <h2 className="text-2xl font-black gradient-text-primary mb-1">Credits & Plans</h2>
        <p className="text-sm text-[var(--color-text-muted)]">Manage your subscription and credit balance</p>
      </div>

      {/* Credit status card */}
      <GlassCard className="p-6 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 glow-orb-cyan opacity-20 pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-5 h-5 text-cyan-400 dark:text-pink-400" />
              <span className="font-bold text-[var(--color-text)]">Current Plan: <span className="gradient-text-primary">{currentUser?.tier || "BASIC"}</span></span>
            </div>
            <div className="text-4xl font-black text-[var(--color-text)] mb-2">
              {currentUser?.credits.toLocaleString() ?? 0}
              <span className="text-lg font-medium text-[var(--color-text-muted)] ml-2">credits remaining</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 max-w-xs h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div className="progress-bar-fill h-full" style={{ width: `${creditPct}%` }} />
              </div>
              <span className="text-xs text-[var(--color-text-muted)] font-semibold">{creditPct}% remaining</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
              <Clock className="w-4 h-4" />
              Resets monthly
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn("relative", plan.popular && "md:scale-105 md:z-10")}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[10px] font-bold whitespace-nowrap shadow-lg">
                MOST POPULAR
              </div>
            )}

            <GlassCard className={cn(
              "h-full flex flex-col p-5",
              currentUser?.tier === plan.name && "ring-2 ring-cyan-400/60 dark:ring-pink-400/60",
              plan.popular && "ring-2 ring-violet-400/50 dark:ring-pink-500/50"
            )}>
              <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                {plan.icon}
              </div>

              <div className="font-bold text-xs text-[var(--color-text-muted)] mb-1">{plan.name}</div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-black text-[var(--color-text)]">{plan.price}</span>
                {plan.period && <span className="text-sm text-[var(--color-text-muted)] mb-1">{plan.period}</span>}
              </div>
              <div className={`text-xs font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent mb-4`}>
                {plan.credits}
              </div>

              <ul className="space-y-2 flex-1 mb-5">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              {currentUser?.tier === plan.name.toUpperCase() ? (
                <div className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold glass-surface text-[var(--color-text-muted)] border border-[var(--color-glass-border)]">
                  ✓ Current Plan
                </div>
              ) : plan.disabled ? (
                <div className="w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold glass-surface text-[var(--color-text-muted)] border border-[var(--color-glass-border)]">
                  {plan.cta}
                </div>
              ) : (
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-all duration-200 shadow-lg flex items-center justify-center gap-2`}
                >
                  <MessageCircle className="w-4 h-4" />
                  {plan.cta}
                </a>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* WhatsApp billing info */}
      <GlassCard className="p-6 border border-green-400/20 bg-green-400/3">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-xl">
            <MessageCircle className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-[var(--color-text)] mb-1 flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-400" />
              Secure Manual Billing via WhatsApp
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">
              To activate your premium credits tier immediately, contact manual billing confirmation via WhatsApp at{" "}
              <span className="text-green-400 font-bold">+880 1540-595258</span>.
              Our team processes payments within minutes and activates your account instantly.
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              {["⚡ Instant Activation", "🔒 Secure Payments", "💬 24/7 Support", "🔄 Cancel Anytime"].map((f) => (
                <span key={f} className="text-xs text-green-400 font-semibold">{f}</span>
              ))}
            </div>
          </div>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-bold text-sm transition-all shadow-xl hover:shadow-green-500/30 whitespace-nowrap"
          >
            <MessageCircle className="w-5 h-5" />
            Open WhatsApp
          </a>
        </div>
      </GlassCard>
    </div>
  );
};

export default Billing;
