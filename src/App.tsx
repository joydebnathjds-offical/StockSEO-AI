import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";

import { useAppStore } from "./store/useAppStore";
import { LandingPage } from "./pages/LandingPage";
import { Workspace } from "./pages/Workspace";
import { Dashboard } from "./pages/Dashboard";
import { Analytics } from "./pages/Analytics";
import { AdminPanel } from "./pages/AdminPanel";
import { Settings } from "./pages/Settings";
import { Billing } from "./pages/Billing";
import { Sidebar } from "./components/layout/Sidebar";
import { Topbar } from "./components/layout/Topbar";
import { AuthModal } from "./components/auth/AuthModal";
import { PaywallModal } from "./components/modals/PaywallModal";
import { CreditWarning } from "./components/ui/CreditWarning";

const HelpPage: React.FC = () => (
  <div className="p-6 flex items-center justify-center h-full">
    <div className="glass-card p-10 text-center max-w-lg">
      <div className="text-5xl mb-4">📚</div>
      <h2 className="text-2xl font-black gradient-text-primary mb-2">Help & Documentation</h2>
      <p className="text-[var(--color-text-muted)] text-sm">
        Full documentation is coming soon. For immediate help, contact us via WhatsApp at{" "}
        <a href="https://wa.me/8801540595258" target="_blank" rel="noopener noreferrer" className="text-cyan-400 dark:text-pink-400 font-semibold hover:underline">
          +880 1540-595258
        </a>
      </p>
    </div>
  </div>
);

function AppLayout() {
  const { activeTab, isAdmin } = useAppStore();

  const renderPage = () => {
    if (activeTab === "workspace") return <Workspace />;
    if (activeTab === "dashboard") return <Dashboard />;
    if (activeTab === "analytics") return <Analytics />;
    if (activeTab === "billing") return <Billing />;
    if (activeTab === "settings") return <Settings />;
    if (activeTab === "help") return <HelpPage />;
    if (isAdmin && (activeTab === "admin-users" || activeTab === "admin-analytics" || activeTab === "admin-credits")) {
      return <AdminPanel tab={activeTab} />;
    }
    return <Workspace />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-surface)] relative">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-60" />
      <div className="fixed top-0 right-0 w-96 h-96 glow-orb-cyan opacity-10 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 glow-orb-pink opacity-8 pointer-events-none" />

      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative z-0">
        <Topbar />
        <main className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              className="h-full"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function App() {
  const { theme, isAuthenticated } = useAppStore();

  // Sync theme on mount
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <>
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "rgba(15, 23, 42, 0.95)",
            color: "#f1f5f9",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px",
            backdropFilter: "blur(20px)",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "13px",
            fontWeight: "500",
          },
          success: {
            iconTheme: { primary: "#00C4CC", secondary: "#f1f5f9" },
          },
          error: {
            iconTheme: { primary: "#FF4EAD", secondary: "#f1f5f9" },
          },
        }}
      />

      {/* Auth Modal - always available */}
      <AuthModal />

      {/* Paywall Modal */}
      <PaywallModal />

      {/* Credit Warning Banner */}
      <CreditWarning />

      {/* Main content: Landing or App */}
      <AnimatePresence mode="wait">
        {isAuthenticated ? (
          <motion.div
            key="app"
            className="h-screen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <AppLayout />
          </motion.div>
        ) : (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <LandingPage />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
