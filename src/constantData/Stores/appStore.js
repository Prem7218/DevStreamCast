import { configureStore } from "@reduxjs/toolkit";
import searchDataReducre from "../Slices/searchDataSlice";
import meetRecordingReducer from "../Slices/meetRecordingSlice";

const appStore = configureStore({
    reducer: {
        search: searchDataReducre,
        meetRecording: meetRecordingReducer,
    }
});
export default appStore;