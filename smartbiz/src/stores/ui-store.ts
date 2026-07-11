import { create } from "zustand";

interface UIState {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;

  // Modals
  globalSearchOpen: boolean;
  notificationsOpen: boolean;

  // Active filters/state
  dateRange: { from: Date | null; to: Date | null };

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebarCollapsed: () => void;
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;
  openNotifications: () => void;
  closeNotifications: () => void;
  setDateRange: (range: { from: Date | null; to: Date | null }) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  sidebarCollapsed: false,
  globalSearchOpen: false,
  notificationsOpen: false,
  dateRange: { from: null, to: null },

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebarCollapsed: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  openGlobalSearch: () => set({ globalSearchOpen: true }),
  closeGlobalSearch: () => set({ globalSearchOpen: false }),
  openNotifications: () => set({ notificationsOpen: true }),
  closeNotifications: () => set({ notificationsOpen: false }),
  setDateRange: (range) => set({ dateRange: range }),
}));
