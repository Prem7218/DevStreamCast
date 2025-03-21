import { configureStore } from "@reduxjs/toolkit";
import searchDataReducer from "../Slices/searchDataSlice";
import meetRecordingReducer from "../Slices/meetRecordingSlice";
import dsaReducer from "../Slices/dsaSlice";
import profileReducer from "../Slices/profileSlice";

const appStore = configureStore({
    reducer: {
        search: searchDataReducer,
        meetRecording: meetRecordingReducer,
        dsaSheet: dsaReducer,
        profile: profileReducer,
    }
});
export default appStore;