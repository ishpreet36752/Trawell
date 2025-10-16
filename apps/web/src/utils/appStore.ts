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
// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
export default appStore;
