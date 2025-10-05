import React from "react";
import { Earth } from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AlignJustify } from "lucide-react";
import { BASE_URL } from "../utils/contants";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";

const Header = ({ toggleSidebar }) => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutUser = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      dispatch(removeUser());
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="navbar sticky mt-4 px-5 text-black top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm rounded-full max-w-7xl mx-auto">
        <div className="flex-1">
          {user ? (
            <>
              {location.pathname !== "/" && (
                <div className="hover:bg-gray-100 p-2 rounded-full transition-colors">
                  <AlignJustify
                    className="mt-1 size-6 cursor-pointer z-10 rounded-full"
                    onClick={toggleSidebar}
                  />
                </div>
              )}
              <Link to={"/feed"} className="btn btn-ghost text-3xl md:text-4xl font-bold hover:bg-transparent">
                <Earth className="size-6 md:size-7 mt-1 text-ocean-600" />
                <span className="bg-gradient-to-r from-ocean-600 to-coral-500 bg-clip-text text-transparent">
                  Trawell
                </span>
              </Link>
            </>
          ) : (
            <>
              <Link to={"/"} className="btn btn-ghost text-3xl md:text-4xl font-bold hover:bg-transparent">
                <Earth className="size-6 md:size-7 mt-1 text-ocean-600" />
                <span className="bg-gradient-to-r from-ocean-600 to-coral-500 bg-clip-text text-transparent">
                  Trawell
                </span>
              </Link>
              <ul className="hidden md:flex gap-6 ml-6 text-base font-medium cursor-pointer">
                <li className="hover:text-ocean-600 transition-colors">
                  <a>Products</a>
                </li>
                <li className="hover:text-ocean-600 transition-colors">
                  <a>About Us</a>
                </li>
                <li className="hover:text-ocean-600 transition-colors">
                  <a>Blog</a>
                </li>
                <li className="hover:text-ocean-600 transition-colors">
                  <a>Trips</a>
                </li>
                <li className="hover:text-ocean-600 transition-colors">
                  <a>Download</a>
                </li>
              </ul>
            </>
          )}
        </div>
        {user && (
          <div className="flex-none gap-2">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full ring-2 ring-ocean-400 ring-offset-2">
                  <img alt="Tailwind CSS Navbar component" src={user.image} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-white rounded-box z-[1] mt-3 w-52 p-2 shadow-lg border border-gray-100"
              >
                <li>
                  <Link to="/profile" className="justify-between hover:bg-ocean-50 hover:text-ocean-700">
                    {user.firstName + " " + user.lastName}
                    <span className="badge bg-ocean-100 text-ocean-700 border-0">Profile</span>
                  </Link>
                </li>
                <li>
                  <a className="hover:bg-ocean-50 hover:text-ocean-700">Settings</a>
                </li>
                <li>
                  <a onClick={logoutUser} className="hover:bg-coral-50 hover:text-coral-700">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
