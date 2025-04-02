import { createSlice } from "@reduxjs/toolkit";

const meetSessionSlice = createSlice({
  name: "meetNow",
  initialState: { meetingLink: "", participants: [], sendInvitation: [] }, 
  reducers: {
    addMeetLink: (state, action) => {
      state.meetingLink = action.payload;
    },
    remMeetLink: (state) => {
      state.meetingLink = "";
    },
    addParticipant: (state, action) => {
      state.participants.push(action.payload);
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addMeetLink, remMeetLink, addParticipant, removeParticipant } = meetSessionSlice.actions;
export default meetSessionSlice.reducer;
