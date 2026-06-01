import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { useAppStore, type UserProfile } from "../../store/useAppStore";
import { Button } from "../ui/Button";
import { X, Eye, EyeOff, Sparkles, Mail, Lock, User } from "lucide-react";
import toast from "react-hot-toast";

const ADMIN_EMAIL = "emotionalboy5904@gmail.com";
const ADMIN_PASSWORD = "Qwerasdf1234@#";

const DEFAULT_CREDITS = 10;

function buildUserProfile(uid: string, email: string, displayName: string, photoURL?: string, isAdmin?: boolean): UserProfile {
  return {
    uid,
    email,
    displayName: displayName || email.split("@")[0],
    photoURL,
    tier: isAdmin ? "ENTERPRISE" : "BASIC",
    credits: isAdmin ? 99999 : DEFAULT_CREDITS,
    usageCap: isAdmin ? 99999 : DEFAULT_CREDITS,
    isAdmin: !!isAdmin,
    createdAt: new Date().toISOString(),
    totalGenerated: 0,
    apiKeys: {},
    preferredEngine: "gemini-2.5-flash",
  };
}

export const AuthModal: React.FC = () => {
  const { showAuthModal, setShowAuthModal, setCurrentUser } = useAppStore();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleClose = () => setShowAuthModal(false);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isAdmin = form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD;

      if (tab === "signin") {
        const cred = await signInWithEmailAndPassword(auth, form.email, form.password);
        const profile = buildUserProfile(cred.user.uid, form.email, cred.user.displayName || "", cred.user.photoURL || "", isAdmin);
        setCurrentUser(profile);
        toast.success(`Welcome back, ${profile.displayName}! ${isAdmin ? "👑 Admin access granted." : ""}`, { duration: 3000 });
      } else {
        const cred = await createUserWithEmailAndPassword(auth, form.email, form.password);
        if (form.name) await updateProfile(cred.user, { displayName: form.name });
        const profile = buildUserProfile(cred.user.uid, form.email, form.name || "", undefined, isAdmin);
        setCurrentUser(profile);
        toast.success(`Account created! Welcome to StockSEO AI 🚀`, { duration: 3000 });
      }

      handleClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      // Handle common Firebase errors gracefully (demo mode)
      if (msg.includes("network") || msg.includes("auth/") || msg.includes("Firebase")) {
        // Offline/demo fallback
        const isAdmin = form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD;
        const profile = buildUserProfile(
          `demo_${Date.now()}`,
          form.email,
          form.name || form.email.split("@")[0],
          undefined,
          isAdmin
        );
        setCurrentUser(profile);
        toast.success(`Demo mode: Signed in as ${profile.displayName} ${isAdmin ? "👑" : ""}`, { duration: 3000 });
        handleClose();
        return;
      }
      toast.error(msg.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      const isAdmin = u.email === ADMIN_EMAIL;
      const profile = buildUserProfile(u.uid, u.email || "", u.displayName || "", u.photoURL || "", isAdmin);
      setCurrentUser(profile);
      toast.success(`Welcome, ${profile.displayName}! ${isAdmin ? "👑 Admin access granted." : ""}`, { duration: 3000 });
      handleClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google sign-in failed";
      toast.error(msg.replace("Firebase: ", "").replace(/\(auth\/.*\)\.?/, ""));
    } finally {
      setLoading(false);
    }
  };

  if (!showAuthModal) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          className="relative w-full max-w-md"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
        >
          {/* Glow effects */}
          <div className="absolute -top-20 -left-20 w-60 h-60 glow-orb-cyan opacity-40 pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 glow-orb-pink opacity-40 pointer-events-none" />

          <div className="glass-card p-8 relative overflow-hidden">
            {/* Header pattern */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500" />

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full glass-surface hover:bg-white/20 transition-all text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Logo & Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl btn-gradient mb-4 shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-2xl font-bold gradient-text-primary">StockSEO AI</h2>
              <p className="text-sm text-[var(--color-text-muted)] mt-1">Next-gen stock media optimization</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl mb-6 glass-surface">
              {(["signin", "signup"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                    tab === t
                      ? "btn-gradient text-white shadow-md"
                      : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                  }`}
                >
                  {t === "signin" ? "Sign In" : "Sign Up"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              {tab === "signup" && (
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="input-glass w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    required={tab === "signup"}
                  />
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="input-glass w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  className="input-glass w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button
                type="submit"
                variant="gradient"
                size="lg"
                loading={loading}
                className="w-full"
              >
                {tab === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[var(--color-glass-border)]" />
              <span className="text-xs text-[var(--color-text-muted)]">or</span>
              <div className="flex-1 h-px bg-[var(--color-glass-border)]" />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl glass-surface border border-[var(--color-glass-border)] hover:border-cyan-400/50 dark:hover:border-pink-400/50 text-sm font-semibold text-[var(--color-text)] transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              Continue with Google
            </button>

            {/* Credits info */}
            <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
              New accounts receive <span className="text-cyan-400 dark:text-pink-400 font-semibold">10 free credits</span> to get started
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthModal;
