import { create } from "zustand";

export const usePostUpdate = create((set) => ({
  text: "",
  privacy: "public",
  mentions: [],
  puids: null,
  setPuid: (value) => set({puids: value}),
  setText: (value) => set({ text: value }),
  setPrivacy: (value) => set({ privacy: value }),
  setMentions: (value) => set({ mentions: value }),
}));
