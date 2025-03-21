import { createSlice } from "@reduxjs/toolkit";

const dsaSlice = createSlice({
    name: "dsaSheet",
    initialState: {
        topic: null,
        question: null,
        code: null,
    },
    reducers: {
        addQnsTop: (state, action) => {
            state.topic = action.payload.topic;
            state.question = action.payload.question;
            state.code = action.payload.code;
        }
    }
})

export const { addQnsTop } = dsaSlice.actions;
export default dsaSlice.reducer;