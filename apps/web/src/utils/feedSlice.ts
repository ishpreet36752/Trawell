import { createSlice , PayloadAction} from "@reduxjs/toolkit";
import type { User } from "../types/user";
type FeedState = User[];
const initialState: FeedState = [];
const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeed: (state, action:PayloadAction<User[]>) => action.payload,
    removeFeedCard: (state, action:PayloadAction<string>) => {
      return state.filter((user) => user._id !== action.payload);
    },
  },
});

export const { setFeed, removeFeedCard } = feedSlice.actions;
export default feedSlice.reducer;