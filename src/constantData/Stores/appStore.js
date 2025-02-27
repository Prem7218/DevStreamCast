import { configureStore } from "@reduxjs/toolkit";
import searchDataReducre from "../Slices/searchDataSlice";
import meetRecordingReducer from "../Slices/meetRecordingSlice";
import dsaReducer from "../Slices/dsaSlice";

const appStore = configureStore({
    reducer: {
        search: searchDataReducre,
        meetRecording: meetRecordingReducer,
        dsaSheet: dsaReducer,
    }
});
export default appStore;