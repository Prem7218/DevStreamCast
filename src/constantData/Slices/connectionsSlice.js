import { createSlice } from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name: "connection",
    initialState: {
        connections: []
    },
    reducers: {
        addConn: (state, action) => {
            state.connections = action.payload
        }
    }
})

export const { addConn } = connectionsSlice.actions;
export default connectionsSlice.reducer;