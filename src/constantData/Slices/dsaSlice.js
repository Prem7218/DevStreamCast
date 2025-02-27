import { createSlice } from "@reduxjs/toolkit";

const dsaSlice = createSlice({
    name: "dsaSheet",
    initialState: {
        topic: null,
        question: null
    },
    reducers: {
        addQnsTop: (state, action) => {
            state.topic = action.payload.topic;
            state.question = action.payload.question;
        }
    }
})

export const { addQnsTop } = dsaSlice.actions;
export default dsaSlice.reducer;