import { createSlice } from "@reduxjs/toolkit";

const searchDataSlice = createSlice({
    name: "search",
    initialState: { hits: [] },
    reducers: {
        updateData: (state, actions) => {
            console.log("ac: ", actions);
            state.initialState = actions.payload.hits;
        }
    }
})

export const { updateData } = searchDataSlice.actions;
export default searchDataSlice.reducer;