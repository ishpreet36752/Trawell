import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionRedcuer from "./connectionsSlice"
import requestReducer from "./requestSlice"
const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connections: connectionRedcuer,
    requests : requestReducer,
  },
});

export default appStore;
