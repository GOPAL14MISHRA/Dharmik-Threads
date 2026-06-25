import { create } from "zustand";

interface UIState {
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (v: boolean) => void;
}

export const useUI = create<UIState>((set) => ({
  cartOpen: false,
  setCartOpen: (v) => set({ cartOpen: v }),
  searchOpen: false,
  setSearchOpen: (v) => set({ searchOpen: v }),
  notificationsOpen: false,
  setNotificationsOpen: (v) => set({ notificationsOpen: v }),
}));
