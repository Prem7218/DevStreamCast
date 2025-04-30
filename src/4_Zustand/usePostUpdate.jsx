import { create } from "zustand";

export const usePostUpdate = create((set) => ({
  text1: "",
  privacy: "public",
  mentions1: [],
  puids: null,
  setPuid: (value) => set({puids: value}),
  setText: (value) => set({ text1: String(value || '') }),
  setPrivacy: (value) => set({ privacy: value }),
  setMentions1: (value) => set({ mentions1: value }),
}));
