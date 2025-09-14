import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router";
import MainBackground from "./MainBackground";
import CreateAccount from "./CreateAccount";
import axios from "axios";
import { BASE_URL } from "../utils/contants";
import { addUser } from "../utils/userSlice";
import Sidebar from "./Sidebar";

const Body = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const location = useLocation();

  // Fetch user data only if not available
  const fetchUser = async () => {
    if (user) return; // Prevents unnecessary API calls if user is already loaded
    try {
      const res = await axios.get(`${BASE_URL}/user/1`, {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch (err) {
      if (err.response?.status === 401) navigate("/");
      console.error(err);
    }
  };

  // Call fetchUser when the component mounts
  useEffect(() => {
    fetchUser();
  }, []); // Runs only once when Body is mounted

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  // Hide MainBackground & Footer only on /feed or /profile
  const hideBackgroundAndFooter =
    location.pathname === "/feed" || location.pathname === "/profile" || location.pathname === "/connections" || location.pathname === "/requests";

  return (
    <div >
      <Header toggleSidebar={toggleSidebar} />
      {!hideBackgroundAndFooter && <MainBackground />}
      {!hideBackgroundAndFooter && <CreateAccount />}
      <div className="flex w-full">
  {location.pathname !== "/" && <Sidebar isOpen={isOpen} />}
  <div className="flex-grow flex justify-center items-center">
    <Outlet />
  </div>
</div>

      {!hideBackgroundAndFooter && <Footer />}
    </div>
  );
};

export default Body;
