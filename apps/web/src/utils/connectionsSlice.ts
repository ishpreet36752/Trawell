import { createSlice  ,PayloadAction} from "@reduxjs/toolkit";
import { Connection } from "../types/connection";
type ConnectionState = Connection[] ;
const initialState: ConnectionState = [];
const connectionSlice = createSlice({
    name: "connection",
    initialState, // Changed from null to array since you're filtering it
    reducers: {
        addConnection: (state, action:PayloadAction<Connection[]>) => {
            return action.payload; // Replace state with new data
        },
        removeConnection: () => {
            return []; // Clear all connections
        },
    }
});

export const { addConnection, removeConnection } = connectionSlice.actions;
export default connectionSlice.reducer;