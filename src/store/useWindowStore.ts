import { create } from 'zustand';

export type WindowData = {
  id: string;
  title: string;
  component: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
};

type WindowState = {
  windows: WindowData[];
  activeWindowId: string | null;
  highestZIndex: number;
  openWindow: (id: string, title: string, component: React.ReactNode, options?: Partial<WindowData>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
};

export const useWindowStore = create<WindowState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  highestZIndex: 10,

  openWindow: (id, title, component, options = {}) => {
    const { windows, highestZIndex } = get();
    const existing = windows.find((w) => w.id === id);

    const newZIndex = highestZIndex + 1;

    if (existing) {
      // If it exists, just focus it and un-minimize it
      set({
        windows: windows.map((w) =>
          w.id === id ? { ...w, minimized: false, zIndex: newZIndex } : w
        ),
        activeWindowId: id,
        highestZIndex: newZIndex,
      });
      return;
    }

    // Default dimensions
    const width = options.width || 800;
    const height = options.height || 600;
    
    // Default position (center of a 1080p screen roughly, we'll let CSS center it ideally, but hardcoding works for Framer Motion)
    const x = options.x || Math.max(0, (typeof window !== 'undefined' ? window.innerWidth : 1200) / 2 - width / 2);
    const y = options.y || Math.max(0, (typeof window !== 'undefined' ? window.innerHeight : 800) / 2 - height / 2);

    const newWindow: WindowData = {
      id,
      title,
      component,
      x,
      y,
      width,
      height,
      minimized: false,
      maximized: false,
      zIndex: newZIndex,
      ...options,
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: id,
      highestZIndex: newZIndex,
    });
  },

  closeWindow: (id) => {
    set((state) => {
      const remaining = state.windows.filter((w) => w.id !== id);
      const nextActive = remaining.length > 0 
        ? remaining.reduce((prev, current) => (prev.zIndex > current.zIndex ? prev : current)).id
        : null;

      return {
        windows: remaining,
        activeWindowId: nextActive,
      };
    });
  },

  minimizeWindow: (id) => {
    set((state) => {
      const windows = state.windows.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      );
      const remainingUnminimized = windows.filter(w => !w.minimized && w.id !== id);
      
      const nextActive = remainingUnminimized.length > 0 
        ? remainingUnminimized.reduce((prev, current) => (prev.zIndex > current.zIndex ? prev : current)).id
        : null;

      return {
        windows,
        activeWindowId: nextActive,
      };
    });
  },

  maximizeWindow: (id) => {
    set((state) => {
      const newZIndex = state.highestZIndex + 1;
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, maximized: !w.maximized, zIndex: newZIndex } : w
        ),
        activeWindowId: id,
        highestZIndex: newZIndex,
      };
    });
  },

  focusWindow: (id) => {
    set((state) => {
      if (state.activeWindowId === id) return state; // Already focused
      
      const newZIndex = state.highestZIndex + 1;
      return {
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: newZIndex, minimized: false } : w
        ),
        activeWindowId: id,
        highestZIndex: newZIndex,
      };
    });
  },

  updatePosition: (id, x, y) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id && !w.maximized ? { ...w, x, y } : w
      ),
    }));
  },

  updateSize: (id, width, height) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id && !w.maximized ? { ...w, width, height } : w
      ),
    }));
  },
}));
