import React from "react";
import { Earth, AlignJustify } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "../utils/contants";
import { removeUser } from "../utils/userSlice";

// Interfaces
interface User {
  firstName: string;
  lastName: string;
  image: string;
  email?: string;
  id?: string;
}

interface RootState {
  user: User | null;
}

interface HeaderProps {
  toggleSidebar: () => void;
}

interface LogoutResponse {
  message?: string;
  success?: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const user = useSelector((store: RootState) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutUser = async (): Promise<void> => {
    try {
      const res = await axios.post<LogoutResponse>(
        `${BASE_URL}/logout`,
        {},
        { withCredentials: true }
      );
      console.log(res.data);
      dispatch(removeUser(null));
      navigate("/");
    } catch (err) {
      const error = err as AxiosError;
      console.error("Logout error:", error.message);
    }
  };

  return (
    <>
      <div className="navbar sticky mt-4 px-5 text-black top-0 z-50">
        <div className="flex-1">
          {user ? (
            <>
              {location.pathname !== "/" && (
                <div className="hover:bg-gray-100 p-2 rounded-full">
                  <AlignJustify
                    className="mt-1 size-6 cursor-pointer z-10 rounded-full"
                    onClick={toggleSidebar}
                  />
                </div>
              )}
              <Link to={"/feed"} className="btn btn-ghost text-4xl font-bold">
                <Earth className="size-7 mt-1" />
                Trawell
              </Link>
            </>
          ) : (
            <Link to={"/"} className="btn btn-ghost text-4xl font-bold">
              <Earth className="size-7 mt-1" />
              Trawell
            </Link>
          )}
          {!user && (
            <ul className="flex gap-3 ml-2 text-xl font-semibold cursor-pointer">
              <li>
                <a>Products</a>
              </li>
              <li>
                <a>About Us</a>
              </li>
              <li>
                <a>Blog</a>
              </li>
              <li>
                <a>Trips</a>
              </li>
              <li>
                <a>Download</a>
              </li>
            </ul>
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
                <div className="w-10 rounded-full">
                  <img
                    alt={`${user.firstName} ${user.lastName}`}
                    src={user.image}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    {user.firstName + " " + user.lastName}
                    <span className="badge">Profile</span>
                  </Link>
                </li>
                <li>
                  <a>Settings</a>
                </li>
                <li>
                  <a onClick={logoutUser}>Logout</a>
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