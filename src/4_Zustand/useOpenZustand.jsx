import { create } from "zustand";

export const useOpenZustand = create((set) => ({
  showConnections: false,
  showEmojiPicker1: false,
  showEmojiPicker2: false,
  searchTerm1: "",
  userChatId: 0, 
  all_user: [],
  setShowConnections: (value) => set({ showConnections: value }),
  setShowEmojiPicker1: (value) => set({ showEmojiPicker1: value }),
  setShowEmojiPicker2: (value) => set({ showEmojiPicker2: value }),
  setSearchTerm1: (value) => set({ searchTerm1: value }),
  setUserChatId: (value) => set({ userChatId: value }),
  setAllUsers: (value) => set({ all_user: value }),
}));
