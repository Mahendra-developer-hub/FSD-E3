import { create } from 'zustand';
import { UserProfile, EventDoc, ToastMessage } from '../types';

interface AppState {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  events: EventDoc[];
  setEvents: (events: EventDoc[]) => void;
  adminEmail: string;
  
  // Toast notifications
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
  events: [],
  setEvents: (events) => set({ events }),
  adminEmail: 'mahendra04165@gmail.com', // Bootstrapped admin

  // Toast system
  toasts: [],
  addToast: (toast) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2);
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id }],
    }));
    // Auto-remove after duration
    const duration = toast.duration ?? 4000;
    setTimeout(() => get().removeToast(id), duration);
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  // Search
  searchQuery: '',
  setSearchQuery: (q) => set({ searchQuery: q }),
}));
