import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Body from "./components/Body";
import Onboarding from "./components/Onboarding";
import Feed from "./components/Feed";
import Profile from "./components/Profile";
import Connections from "./components/Connections";
import Requests from "./components/Requests";
import { SocketProvider } from "./utils/socket";

const Group = React.lazy(() => import("./components/Group"));
const GroupChat = React.lazy(() => import("./components/GroupChat"));

const App = () => (
  <Provider store={appStore}>
    <SocketProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Main layout routes */}
            <Route path="/" element={<Body />}>
              <Route path="feed" element={<Feed />} />
              <Route path="profile" element={<Profile />} />
              <Route path="connections" element={<Connections />} />
              <Route path="requests" element={<Requests />} />
            </Route>

            {/* Onboarding */}
            <Route path="/onboarding/*" element={<Onboarding />} />

            {/* Groups */}
            <Route path="/groups" element={<Group />} />
            <Route path="/group/:groupId" element={<GroupChat />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SocketProvider>
  </Provider>
);

export default App;
