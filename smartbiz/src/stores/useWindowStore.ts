import { create } from 'zustand';

export type AppWindow = {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  component: string; // The identifier for what to render inside
};

type WindowState = {
  windows: AppWindow[];
  activeWindowId: string | null;
  openWindow: (id: string, title: string, component: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
  updateWindowSize: (id: string, size: { width: number; height: number }) => void;
};

let nextZIndex = 100;

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  activeWindowId: null,

  openWindow: (id, title, component) => {
    const { windows } = get();
    const existing = windows.find((w) => w.id === id);
    
    nextZIndex++;

    if (existing) {
      set({
        windows: windows.map((w) =>
          w.id === id ? { ...w, isOpen: true, isMinimized: false, zIndex: nextZIndex } : w
        ),
        activeWindowId: id,
      });
    } else {
      // Default position slightly offset so multiple windows stagger
      const offset = (windows.length * 30) % 150;
      set({
        windows: [
          ...windows,
          {
            id,
            title,
            isOpen: true,
            isMinimized: false,
            isMaximized: false,
            zIndex: nextZIndex,
            position: { x: 100 + offset, y: 100 + offset },
            size: { width: 900, height: 600 }, // Default size for CRUD modules
            component,
          },
        ],
        activeWindowId: id,
      });
    }
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  maximizeWindow: (id) => {
    nextZIndex++;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: true, zIndex: nextZIndex } : w
      ),
      activeWindowId: id,
    }));
  },

  restoreWindow: (id) => {
    nextZIndex++;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: false, isMinimized: false, zIndex: nextZIndex } : w
      ),
      activeWindowId: id,
    }));
  },

  focusWindow: (id) => {
    const { activeWindowId, windows } = get();
    if (activeWindowId === id) return; // already focused

    const windowToFocus = windows.find(w => w.id === id);
    if (!windowToFocus || !windowToFocus.isOpen || windowToFocus.isMinimized) return;

    nextZIndex++;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: nextZIndex } : w
      ),
      activeWindowId: id,
    }));
  },

  updateWindowPosition: (id, position) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, position } : w
      ),
    }));
  },

  updateWindowSize: (id, size) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, size } : w
      ),
    }));
  },
}));
