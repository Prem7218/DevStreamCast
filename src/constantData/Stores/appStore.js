import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk"; // ✅ Correct way to import
import searchDataReducer from "../Slices/searchDataSlice";
import meetRecordingReducer from "../Slices/meetRecordingSlice";
import dsaReducer from "../Slices/dsaSlice";
import profileReducer from "../Slices/profileSlice";
import meetSessionReducer from "../Slices/meetSessionSlice";
import quizDataReducer from "../Slices/quizDataSlice";
import connectionsReducer from "../Slices/connectionsSlice";

const appStore = configureStore({
    reducer: {
        search: searchDataReducer,
        meetRecording: meetRecordingReducer,
        dsaSheet: dsaReducer,
        profile: profileReducer,
        meetNow: meetSessionReducer,
        quizData: quizDataReducer,
        connection: connectionsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});

export default appStore;
