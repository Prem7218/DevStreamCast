import { configureStore } from "@reduxjs/toolkit";
import searchDataReducer from "../Slices/searchDataSlice";
import meetRecordingReducer from "../Slices/meetRecordingSlice";
import dsaReducer from "../Slices/dsaSlice";
import profileReducer from "../Slices/profileSlice";
import meetSessionReducer from "../Slices/meetSessionSlice";
import quizDataReducer from "../Slices/quizDataSlice";
import connectionsReducer from "../Slices/connectionsSlice";
import postReducer from "../Slices/postSlice";

const appStore = configureStore({
    reducer: {
        search: searchDataReducer,
        meetRecording: meetRecordingReducer,
        dsaSheet: dsaReducer,
        profile: profileReducer,
        meetNow: meetSessionReducer,
        quizData: quizDataReducer,
        connection: connectionsReducer,
        posts: postReducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default appStore;
