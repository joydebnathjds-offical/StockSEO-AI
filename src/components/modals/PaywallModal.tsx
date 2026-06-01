import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";
import { X, Zap, Star, Crown, Building2, Check, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://wa.me/8801540595258";

const PLANS = [
  {
    id: "pro",
    name: "PRO",
    price: "$19",
    period: "/month",
    credits: "500 Credits",
    icon: <Zap className="w-5 h-5" />,
    color: "from-cyan-400 to-blue-500",
    borderColor: "border-cyan-400/30",
    features: [
      "500 AI generations/month",
      "All 6 platform optimizations",
      "Title + Description + Tags",
      "Real-time SEO scoring",
      "CSV bulk export",
      "Priority queue access",
    ],
    popular: false,
  },
  {
    id: "premium",
    name: "PREMIUM",
    price: "$49",
    period: "/month",
    credits: "1,000 Credits",
    icon: <Star className="w-5 h-5" />,
    color: "from-violet-500 to-pink-500",
    borderColor: "border-violet-400/40",
    features: [
      "1,000 AI generations/month",
      "All PRO features included",
      "GPT-5 & Gemini 2.5 Pro access",
      "Bulk image processing (50x)",
      "API key integration",
      "Advanced analytics dashboard",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "ENTERPRISE",
    price: "$99",
    period: "/month",
    credits: "5,000 Credits",
    icon: <Crown className="w-5 h-5" />,
    color: "from-amber-400 to-orange-500",
    borderColor: "border-amber-400/30",
    features: [
      "5,000 AI generations/month",
      "All PREMIUM features",
      "Custom AI model tuning",
      "White-label exports",
      "Dedicated account manager",
      "SLA uptime guarantee",
    ],
    popular: false,
  },
  {
    id: "agency",
    name: "AGENCY",
    price: "Custom",
    period: "",
    credits: "Unlimited",
    icon: <Building2 className="w-5 h-5" />,
    color: "from-slate-400 to-slate-600",
    borderColor: "border-slate-400/30",
    features: [
      "Unlimited AI generations",
      "Multi-seat team accounts",
      "Custom integrations & APIs",
      "On-premise deployment option",
      "24/7 priority support",
      "Custom billing arrangements",
    ],
    popular: false,
  },
];

export const PaywallModal: React.FC = () => {
  const { showPaywall, setShowPaywall } = useAppStore();

  if (!showPaywall) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-lg" onClick={() => setShowPaywall(false)} />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Glow orbs */}
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 glow-orb-violet opacity-30 pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 glow-orb-pink opacity-25 pointer-events-none" />

          <div className="glass-card p-8 relative overflow-hidden">
            {/* Top gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500" />

            {/* Close button */}
            <button
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full glass-surface hover:bg-white/20 transition-all text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-surface border border-pink-400/30 text-pink-400 text-xs font-semibold mb-4">
                <Zap className="w-3 h-3" />
                CREDITS EXHAUSTED
              </div>
              <h2 className="text-3xl font-bold gradient-text-primary mb-2">
                Upgrade to Continue
              </h2>
              <p className="text-[var(--color-text-muted)] max-w-lg mx-auto">
                You've used all your free credits. Choose a plan to unlock unlimited AI-powered stock media optimization.
              </p>
            </div>

            {/* Plans Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative glass-card p-5 border ${plan.borderColor} flex flex-col ${
                    plan.popular ? "ring-2 ring-violet-500/50 dark:ring-pink-500/50" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-xs font-bold whitespace-nowrap">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-4">
                    <div className={`inline-flex w-10 h-10 rounded-xl items-center justify-center bg-gradient-to-br ${plan.color} text-white mb-3 shadow-lg`}>
                      {plan.icon}
                    </div>
                    <div className="font-bold text-sm text-[var(--color-text-muted)] mb-1">{plan.name}</div>
                    <div className="flex items-end gap-1">
                      <span className="text-2xl font-black text-[var(--color-text)]">{plan.price}</span>
                      <span className="text-xs text-[var(--color-text-muted)] mb-1">{plan.period}</span>
                    </div>
                    <div className={`text-xs font-semibold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                      {plan.credits}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 flex-1 mb-5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[var(--color-text-muted)]">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold text-white bg-gradient-to-r ${plan.color} hover:opacity-90 transition-all duration-200 shadow-lg flex items-center justify-center gap-2`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Get {plan.name}
                  </a>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA Banner */}
            <div className="glass-surface rounded-2xl p-6 border border-green-400/30 bg-green-400/5">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-[var(--color-text)] text-sm">Instant Credit Activation via WhatsApp</div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      To activate your premium credits tier immediately, contact manual billing confirmation via WhatsApp at{" "}
                      <span className="text-green-400 font-semibold">+880 1540-595258</span>
                    </div>
                    <div className="text-xs text-[var(--color-text-muted)] mt-1">
                      Fast response • Instant activation • Secure payment handling
                    </div>
                  </div>
                </div>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500 hover:bg-green-400 text-white font-semibold text-sm transition-all duration-200 shadow-lg hover:shadow-green-500/30 whitespace-nowrap"
                >
                  <MessageCircle className="w-5 h-5" />
                  Contact on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaywallModal;
