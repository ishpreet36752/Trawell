import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {User} from "../types/user";

const initialState:User|null = null;
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        addUser : (state, action:PayloadAction<User>) =>{
             action.payload;
        },
        removeUser : () => {
             null;
        },
    }
})

export const {addUser, removeUser} = userSlice.actions;
export default userSlice.reducer;