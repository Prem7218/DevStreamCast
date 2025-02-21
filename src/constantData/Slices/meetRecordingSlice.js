import { createSlice } from "@reduxjs/toolkit";

const meetRecordingSlice = createSlice({
    name: "meetRecording",
    initialState: [],
    reducers: {
        uploadVideo: (state, action) => {
            console.log("action: ", action.payload);
            return [...state, action.payload];
        }
    }
})

export const { uploadVideo } = meetRecordingSlice.actions;
export default meetRecordingSlice.reducer;