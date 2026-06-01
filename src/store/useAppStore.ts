import { create } from "zustand";
import { persist } from "zustand/middleware";

// ─── Types ──────────────────────────────────────────────────────────────────

export type UserTier = "BASIC" | "PRO" | "PREMIUM" | "ENTERPRISE";
export type AIEngine = "gemini-2.5-pro" | "gemini-2.5-flash" | "gpt-4o" | "gpt-5" | "grok-4" | "grok-fast";
export type Platform = "shutterstock" | "adobe-stock" | "freepik" | "istock" | "dreamstime" | "alamy";

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  tier: UserTier;
  credits: number;
  usageCap: number;
  isAdmin: boolean;
  createdAt: string;
  totalGenerated: number;
  apiKeys: {
    gemini?: string;
    openai?: string;
    grok?: string;
  };
  preferredEngine: AIEngine;
}

export interface GeneratedAsset {
  id: string;
  filename: string;
  size: number;
  resolution: string;
  previewUrl: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  subcategory: string;
  seoScore: number;
  platform: Platform;
  generatedAt: string;
  titleLength: number;
  descriptionLength: number;
  tagCount: number;
}

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  tier: UserTier;
  credits: number;
  usageCap: number;
  totalGenerated: number;
  createdAt: string;
  status: "active" | "suspended";
}

// ─── Store Interface ─────────────────────────────────────────────────────────

interface AppState {
  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Auth
  currentUser: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setCurrentUser: (user: UserProfile | null) => void;
  logout: () => void;

  // UI State
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  showPaywall: boolean;
  setShowPaywall: (v: boolean) => void;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;

  // Workspace
  uploadedFiles: File[];
  setUploadedFiles: (files: File[]) => void;
  currentAsset: GeneratedAsset | null;
  setCurrentAsset: (asset: GeneratedAsset | null) => void;
  generatedAssets: GeneratedAsset[];
  addGeneratedAsset: (asset: GeneratedAsset) => void;
  clearAssets: () => void;

  // Generation Settings
  titleLength: number;
  setTitleLength: (v: number) => void;
  descriptionLength: number;
  setDescriptionLength: (v: number) => void;
  tagCount: number;
  setTagCount: (v: number) => void;
  selectedPlatform: Platform;
  setSelectedPlatform: (p: Platform) => void;
  selectedEngine: AIEngine;
  setSelectedEngine: (e: AIEngine) => void;

  // Generation State
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  generatingField: "title" | "description" | "tags" | "all" | null;
  setGeneratingField: (f: "title" | "description" | "tags" | "all" | null) => void;

  // Admin
  adminUsers: AdminUser[];
  setAdminUsers: (users: AdminUser[]) => void;
  updateAdminUser: (uid: string, updates: Partial<AdminUser>) => void;

  // Credits
  deductCredit: () => boolean;
  addCredits: (uid: string, amount: number) => void;
}

// ─── Mock Admin Users Data ───────────────────────────────────────────────────

const MOCK_ADMIN_USERS: AdminUser[] = [
  { uid: "usr_001", email: "alice@creator.com", displayName: "Alice Johnson", tier: "PRO", credits: 450, usageCap: 500, totalGenerated: 1240, createdAt: "2024-01-15", status: "active" },
  { uid: "usr_002", email: "bob@photography.io", displayName: "Bob Martinez", tier: "PREMIUM", credits: 980, usageCap: 1000, totalGenerated: 3810, createdAt: "2024-02-03", status: "active" },
  { uid: "usr_003", email: "carol@stockpro.net", displayName: "Carol Davis", tier: "BASIC", credits: 3, usageCap: 10, totalGenerated: 47, createdAt: "2024-03-22", status: "active" },
  { uid: "usr_004", email: "dave@visualarts.com", displayName: "Dave Wilson", tier: "ENTERPRISE", credits: 4800, usageCap: 5000, totalGenerated: 12050, createdAt: "2023-11-08", status: "active" },
  { uid: "usr_005", email: "eve@freelance.studio", displayName: "Eve Thompson", tier: "PRO", credits: 210, usageCap: 500, totalGenerated: 890, createdAt: "2024-04-10", status: "suspended" },
  { uid: "usr_006", email: "frank@mediavault.co", displayName: "Frank Brown", tier: "BASIC", credits: 0, usageCap: 10, totalGenerated: 10, createdAt: "2024-05-18", status: "active" },
  { uid: "usr_007", email: "grace@artistry.net", displayName: "Grace Lee", tier: "PREMIUM", credits: 730, usageCap: 1000, totalGenerated: 2680, createdAt: "2024-01-29", status: "active" },
  { uid: "usr_008", email: "henry@stockmaster.io", displayName: "Henry Clark", tier: "PRO", credits: 320, usageCap: 500, totalGenerated: 1560, createdAt: "2024-03-05", status: "active" },
];

// ─── Store ───────────────────────────────────────────────────────────────────

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: "dark",
      toggleTheme: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        if (next === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      },

      // Auth
      currentUser: null,
      isAuthenticated: false,
      isAdmin: false,
      setCurrentUser: (user) => {
        set({
          currentUser: user,
          isAuthenticated: !!user,
          isAdmin: user?.isAdmin ?? false,
        });
      },
      logout: () => {
        set({
          currentUser: null,
          isAuthenticated: false,
          isAdmin: false,
          currentAsset: null,
          uploadedFiles: [],
          generatedAssets: [],
          activeTab: "workspace",
        });
      },

      // UI State
      activeTab: "workspace",
      setActiveTab: (tab) => set({ activeTab: tab }),
      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
      showPaywall: false,
      setShowPaywall: (v) => set({ showPaywall: v }),
      showAuthModal: false,
      setShowAuthModal: (v) => set({ showAuthModal: v }),

      // Workspace
      uploadedFiles: [],
      setUploadedFiles: (files) => set({ uploadedFiles: files }),
      currentAsset: null,
      setCurrentAsset: (asset) => set({ currentAsset: asset }),
      generatedAssets: [],
      addGeneratedAsset: (asset) =>
        set((state) => ({ generatedAssets: [asset, ...state.generatedAssets] })),
      clearAssets: () => set({ generatedAssets: [], currentAsset: null }),

      // Generation Settings
      titleLength: 100,
      setTitleLength: (v) => set({ titleLength: v }),
      descriptionLength: 200,
      setDescriptionLength: (v) => set({ descriptionLength: v }),
      tagCount: 40,
      setTagCount: (v) => set({ tagCount: v }),
      selectedPlatform: "shutterstock",
      setSelectedPlatform: (p) => set({ selectedPlatform: p }),
      selectedEngine: "gemini-2.5-flash",
      setSelectedEngine: (e) => set({ selectedEngine: e }),

      // Generation State
      isGenerating: false,
      setIsGenerating: (v) => set({ isGenerating: v }),
      generatingField: null,
      setGeneratingField: (f) => set({ generatingField: f }),

      // Admin
      adminUsers: MOCK_ADMIN_USERS,
      setAdminUsers: (users) => set({ adminUsers: users }),
      updateAdminUser: (uid, updates) =>
        set((state) => ({
          adminUsers: state.adminUsers.map((u) =>
            u.uid === uid ? { ...u, ...updates } : u
          ),
        })),

      // Credits
      deductCredit: () => {
        const { currentUser, setShowPaywall } = get();
        if (!currentUser) return false;
        if (currentUser.credits <= 0) {
          setShowPaywall(true);
          return false;
        }
        set((state) => ({
          currentUser: state.currentUser
            ? { ...state.currentUser, credits: state.currentUser.credits - 1 }
            : null,
        }));
        return true;
      },
      addCredits: (uid, amount) => {
        set((state) => {
          if (state.currentUser?.uid === uid) {
            return {
              currentUser: { ...state.currentUser, credits: state.currentUser.credits + amount },
            };
          }
          return {};
        });
      },
    }),
    {
      name: "stockseo-app-store",
      partialize: (state) => ({
        theme: state.theme,
        selectedEngine: state.selectedEngine,
        selectedPlatform: state.selectedPlatform,
        titleLength: state.titleLength,
        descriptionLength: state.descriptionLength,
        tagCount: state.tagCount,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
