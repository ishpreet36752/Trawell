import { createSlice ,PayloadAction } from "@reduxjs/toolkit";
import type {Request} from "../types/request";
type RequestState = Request[] ;
const initialState:RequestState = [];
const requestSlice = createSlice({
    name: "request",
    initialState,
    reducers : {
        addRequest : (state, action:PayloadAction<Request[]>) => {return action.payload},
        removeRequest : (state, action:PayloadAction<string>) => {
            return state.filter((req)=>req._id!==action.payload)
        }
    }
})
export const { addRequest ,removeRequest} = requestSlice.actions;
export default requestSlice.reducer;