import React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "../store/useAppStore";
import { ThemeToggle } from "../components/ui/ThemeToggle";
import { Button } from "../components/ui/Button";
import {
  Sparkles, Zap, Target, Tag, BarChart3, Shield,
  ArrowRight, Star, Check, ChevronRight,
  ImagePlus, RefreshCw, Copy,
} from "lucide-react";

const PLATFORMS = [
  { name: "Shutterstock", abbr: "SS", color: "from-red-500 to-orange-400" },
  { name: "Adobe Stock", abbr: "AS", color: "from-red-600 to-red-400" },
  { name: "Freepik", abbr: "FP", color: "from-blue-500 to-cyan-400" },
  { name: "iStock", abbr: "iS", color: "from-green-500 to-emerald-400" },
  { name: "Dreamstime", abbr: "DT", color: "from-violet-500 to-purple-400" },
  { name: "Alamy", abbr: "AL", color: "from-orange-500 to-amber-400" },
];

const FEATURES = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Multi-Engine AI",
    desc: "Powered by Gemini 2.5 Pro, GPT-5, GPT-4o, and Grok 4 for maximum quality output.",
    grad: "from-cyan-400 to-blue-500",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Real-time SEO Scoring",
    desc: "Instant 0-100 SEO analysis with readability checks and marketplace compliance feedback.",
    grad: "from-emerald-400 to-teal-500",
  },
  {
    icon: <Tag className="w-6 h-6" />,
    title: "Smart Tag Generation",
    desc: "Generate 30, 40, or 50 hyper-relevant keywords optimized for each stock marketplace algorithm.",
    grad: "from-violet-400 to-purple-500",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Isolated Regeneration",
    desc: "Regenerate only what you need — title, description, or tags independently without extra API calls.",
    grad: "from-pink-400 to-rose-500",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Deep Analytics",
    desc: "Track SEO performance trends across all 6 platforms with detailed visual dashboards.",
    grad: "from-amber-400 to-orange-500",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Platform Compliance",
    desc: "Auto-enforced metadata rules for each platform's specific character limits and tag guidelines.",
    grad: "from-indigo-400 to-violet-500",
  },
];

const STATS = [
  { value: "2.4M+", label: "Images Processed" },
  { value: "12K+", label: "Active Contributors" },
  { value: "88.4", label: "Avg SEO Score" },
  { value: "4.9★", label: "Product Rating" },
];

export const LandingPage: React.FC = () => {
  const { setShowAuthModal, setCurrentUser, setActiveTab } = useAppStore();

  const handleDemoLogin = () => {
    setCurrentUser({
      uid: "demo_user",
      email: "demo@stockseo.ai",
      displayName: "Demo User",
      tier: "PRO",
      credits: 8,
      usageCap: 500,
      isAdmin: false,
      createdAt: new Date().toISOString(),
      totalGenerated: 47,
      apiKeys: {},
      preferredEngine: "gemini-2.5-flash",
    });
    setActiveTab("workspace");
  };

  return (
    <div className="min-h-screen overflow-y-auto relative bg-[var(--color-surface)]">
      {/* Background */}
      <div className="fixed inset-0 bg-grid pointer-events-none" />
      <div className="fixed top-0 right-0 w-[600px] h-[600px] glow-orb-cyan opacity-20 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] glow-orb-pink opacity-15 pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] glow-orb-violet opacity-10 pointer-events-none" />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass-surface border-b border-[var(--color-glass-border)] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl btn-gradient flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-black text-lg gradient-text-primary">StockSEO</span>
              <span className="text-[var(--color-text)] font-black text-lg"> AI</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--color-text-muted)]">
            {["Features", "Platforms", "Pricing", "Analytics"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[var(--color-text)] transition-colors cursor-pointer">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => setShowAuthModal(true)}>Sign In</Button>
            <Button variant="gradient" size="sm" onClick={() => setShowAuthModal(true)}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative px-6 py-28 text-center">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface border border-cyan-400/30 dark:border-pink-400/30 text-sm font-semibold text-cyan-500 dark:text-pink-400 mb-8">
              <Sparkles className="w-4 h-4" />
              Powered by Gemini 2.5, GPT-5 & Grok 4
              <ChevronRight className="w-4 h-4" />
            </div>

            <h1 className="text-6xl md:text-8xl font-black leading-none mb-6 tracking-tight">
              <span className="gradient-text-primary">SEO-Optimize</span>
              <br />
              <span className="text-[var(--color-text)]">Your Stock</span>
              <br />
              <span className="gradient-text-alt">Media Assets</span>
            </h1>

            <p className="text-xl text-[var(--color-text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed">
              Generate AI-powered titles, descriptions, and 50 SEO-optimized tags for Shutterstock, Adobe Stock, Freepik, iStock, Dreamstime & Alamy — in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="gradient" size="xl" onClick={() => setShowAuthModal(true)} icon={<Zap className="w-5 h-5" />}>
                Start Free — 10 Credits
              </Button>
              <Button variant="glass" size="xl" onClick={handleDemoLogin} icon={<ArrowRight className="w-5 h-5" />} iconPosition="right">
                Try Demo
              </Button>
            </div>

            <p className="text-xs text-[var(--color-text-muted)] mt-4">No credit card required • 10 free generations</p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="bubble-glass p-6 text-center">
                  <div className="text-4xl font-black gradient-text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-[var(--color-text-muted)] font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms */}
      <section id="platforms" className="px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[var(--color-text)] mb-3">
            Optimized for <span className="gradient-text-primary">Every Platform</span>
          </h2>
          <p className="text-[var(--color-text-muted)] mb-10">Each platform has unique SEO rules. We handle them all automatically.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PLATFORMS.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-5 flex flex-col items-center gap-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${p.color} flex items-center justify-center text-white text-lg font-black shadow-xl`}>
                    {p.abbr}
                  </div>
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">{p.name}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-[var(--color-text)] mb-3">
              Everything You Need to <span className="gradient-text-primary">Rank Higher</span>
            </h2>
            <p className="text-[var(--color-text-muted)]">A complete AI-powered metadata optimization suite for stock media professionals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-6 h-full">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.grad} flex items-center justify-center text-white mb-4 shadow-lg`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold text-[var(--color-text)] mb-2">{f.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo preview */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-60 h-60 glow-orb-cyan opacity-20 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 glow-orb-pink opacity-15 pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
              <h2 className="text-3xl font-black text-[var(--color-text)] mb-2">
                See It In <span className="gradient-text-primary">Action</span>
              </h2>
              <p className="text-[var(--color-text-muted)]">Isolated field regeneration — update only what you need</p>
            </div>

            <div className="space-y-3 relative z-10">
              {/* Simulated output panels */}
              {[
                { label: "Title", icon: <ImagePlus className="w-4 h-4" />, content: "Professional Businessman Working on Laptop in Modern Office - Stock Photo", chars: "76/100" },
                { label: "Description", icon: <BarChart3 className="w-4 h-4" />, content: "High-resolution stock photo featuring a professional businessman working on a laptop in a modern office environment. Perfect for business websites, presentations, and marketing materials...", chars: "196/200" },
                { label: "SEO Tags", icon: <Tag className="w-4 h-4" />, tags: ["business", "professional", "office", "laptop", "technology", "corporate", "workspace", "modern", "entrepreneur", "success", "+30 more"] },
              ].map((panel, i) => (
                <motion.div
                  key={panel.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15 }}
                  viewport={{ once: true }}
                  className="glass-surface border border-[var(--color-glass-border)] rounded-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-glass-border)]">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
                      <span className="text-cyan-400 dark:text-pink-400">{panel.icon}</span>
                      {panel.label}
                      {"chars" in panel && <span className="text-xs text-emerald-400 ml-1">{panel.chars}</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      {[<Copy className="w-3.5 h-3.5" />, <Star className="w-3.5 h-3.5" />, <RefreshCw className="w-3.5 h-3.5" />].map((ico, j) => (
                        <div key={j} className="w-7 h-7 flex items-center justify-center rounded-lg glass-surface text-[var(--color-text-muted)]">{ico}</div>
                      ))}
                    </div>
                  </div>
                  <div className="p-4">
                    {"tags" in panel ? (
                      <div className="flex flex-wrap gap-1.5">
                        {panel.tags?.map((t) => <span key={t} className="tag-badge">{t}</span>)}
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--color-text)]">{panel.content}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-6 relative z-10">
              <Button variant="gradient" size="lg" onClick={() => setShowAuthModal(true)} icon={<Zap className="w-5 h-5" />}>
                Start Optimizing Free
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-black text-[var(--color-text)] mb-3">
            Simple, <span className="gradient-text-primary">Transparent Pricing</span>
          </h2>
          <p className="text-[var(--color-text-muted)] mb-10">Start free, scale when you're ready</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "PRO", price: "$19/mo", credits: "500 credits", grad: "from-cyan-400 to-blue-500",
                features: ["All 6 platforms", "Real-time SEO scoring", "CSV export", "Priority support"],
              },
              {
                name: "PREMIUM", price: "$49/mo", credits: "1,000 credits", grad: "from-violet-500 to-pink-500", popular: true,
                features: ["GPT-5 & Gemini 2.5 Pro", "Bulk processing", "API integration", "Analytics dashboard"],
              },
              {
                name: "ENTERPRISE", price: "$99/mo", credits: "5,000 credits", grad: "from-amber-400 to-orange-500",
                features: ["Custom AI tuning", "White-label exports", "Dedicated manager", "SLA guarantee"],
              },
            ].map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={plan.popular ? "md:scale-105 md:z-10 relative" : ""}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10 px-3 py-0.5 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white text-[10px] font-bold whitespace-nowrap">
                    MOST POPULAR
                  </div>
                )}
                <div className={`glass-card p-6 h-full ${plan.popular ? "ring-2 ring-violet-400/50" : ""}`}>
                  <div className={`text-2xl font-black bg-gradient-to-r ${plan.grad} bg-clip-text text-transparent mb-1`}>{plan.name}</div>
                  <div className="text-3xl font-black text-[var(--color-text)] mb-1">{plan.price}</div>
                  <div className={`text-sm font-bold bg-gradient-to-r ${plan.grad} bg-clip-text text-transparent mb-5`}>{plan.credits}</div>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className={`w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${plan.grad} hover:opacity-90 transition-all shadow-lg`}
                  >
                    Get {plan.name}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-black text-[var(--color-text)] mb-10">
            Loved by <span className="gradient-text-primary">Stock Contributors</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Alice Johnson", role: "Shutterstock Contributor", text: "StockSEO AI completely transformed my upload workflow. My images now consistently rank in the top results.", stars: 5 },
              { name: "Bob Martinez", role: "Adobe Stock Creator", text: "The isolated regeneration feature is genius. I can tweak just the tags without wasting credits.", stars: 5 },
              { name: "Carol Davis", role: "Multi-Platform Seller", text: "Finally a tool that understands each platform's specific requirements. My sales doubled in 3 months!", stars: 5 },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-6 text-left h-full">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4 leading-relaxed">"{t.text}"</p>
                  <div>
                    <div className="text-sm font-bold text-[var(--color-text)]">{t.name}</div>
                    <div className="text-xs text-cyan-400 dark:text-pink-400 font-medium">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="glass-card p-12 relative overflow-hidden">
              <div className="absolute inset-0 glow-orb-violet opacity-10 pointer-events-none" />
              <div className="relative z-10">
                <div className="text-5xl mb-4">🚀</div>
                <h2 className="text-4xl font-black gradient-text-primary mb-4">Ready to Rank Higher?</h2>
                <p className="text-[var(--color-text-muted)] mb-8">Join 12,000+ stock contributors already using StockSEO AI to maximize their earnings.</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button variant="gradient" size="xl" onClick={() => setShowAuthModal(true)} icon={<Zap className="w-5 h-5" />}>
                    Get Started Free
                  </Button>
                  <Button variant="glass" size="xl" onClick={handleDemoLogin}>
                    View Demo Dashboard
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-6 mt-6 text-xs text-[var(--color-text-muted)]">
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> No credit card</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> 10 free credits</span>
                  <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-emerald-400" /> Cancel anytime</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-surface border-t border-[var(--color-glass-border)] px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl btn-gradient flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-black gradient-text-primary">StockSEO AI</span>
          </div>
          <div className="flex items-center gap-6 text-xs text-[var(--color-text-muted)]">
            {["Privacy", "Terms", "Support", "Documentation"].map((item) => (
              <a key={item} href="#" className="hover:text-[var(--color-text)] transition-colors">{item}</a>
            ))}
          </div>
          <div className="text-xs text-[var(--color-text-muted)]">
            © 2025 StockSEO AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
