import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: [],
  reducers: {
    setFeed: (state, action) => action.payload,
    removeFeedCard: (state, action) => {
      return state.filter((user) => user._id !== action.payload);
    },
  },
});

export const { setFeed, removeFeedCard } = feedSlice.actions;
export default feedSlice.reducer;