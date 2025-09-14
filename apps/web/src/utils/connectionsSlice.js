import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
    name: "connection",
    initialState: null, // Changed from null to array since you're filtering it
    reducers: {
        addConnection: (state, action) => {
            return action.payload; // Replace state with new data
        },
        removeConnection: (state, action) => {
            return null;
        },
    }
});

export const { addConnection, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;