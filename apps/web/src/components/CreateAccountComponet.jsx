import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, KeyRound, User } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/contants";

const CreateAccountComponent = ({ onClose }) => {
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const modalRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signUpToggle, setSignUpToggle] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/login`,
        {
          emailId,
          password,
        },
        { withCredentials: true }
      );
      // console.log(res.data);
      dispatch(addUser(res.data));
      return navigate("/feed");
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  const handleSignup = async () => {
    try {
      const res = await axios.post(
        `${BASE_URL}/signup`,
        { firstName, lastName, emailId, password },
        { withCredentials: true }
      );
      // console.log(res.data);
      dispatch(addUser(res.data.data));
      return navigate("/profile")
    } catch (err) {
      setError(err?.response?.data);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-auto mt-5 "
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-xl font-bold flex justify-center">
            Welcome to Trawell
          </h2>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            {signUpToggle && (
              <>
                <div>
                  <label className="text-black font-semibold mx-3">
                    First Name
                  </label>
                  <div className="w-auto flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="Tyler"
                      className="flex-1 outline-none"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-black font-semibold mx-3">
                    Last Name
                  </label>
                  <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
                    <User className="w-5 h-5 text-gray-500" />
                    <input
                      type="tel"
                      placeholder="Durden"
                      className="flex-1 outline-none"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            <div>
              <label className="text-black font-semibold mx-3">
                Email Address
              </label>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
                <Mail className="w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  placeholder="Hellskitchen25@gmail.com"
                  className="flex-1 outline-none"
                  value={emailId}
                  onChange={(e) => setEmailId(e.target.value)}
                />
              </div>
            </div>
            {/* <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
              <Smartphone className="w-5 h-5 text-gray-500" />
              <input type="tel" placeholder="Phone number" className="flex-1 outline-none" />
            </div> */}
            <div>
              <label className="text-black font-semibold mx-3">Password</label>
              <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-4 py-2">
                <KeyRound className="w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  placeholder="Password"
                  className="flex-1 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="text-red-500 font-bold text-sm ml-2">
              <span>{error}</span>
            </div>
          </div>
          <button
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={!signUpToggle ? handleLogin : handleSignup}
          >
            Continue
          </button>
          <div>
            {!signUpToggle ? (
              <>
                <h1 className="text-black text-sm ml-3 -mt-2">
                  Don't have an account?
                  <span
                    className="mx-1 cursor-pointer underline text-blue-500"
                    onClick={() => setSignUpToggle((value) => !value)}
                  >
                    Sign up
                  </span>{" "}
                </h1>
              </>
            ) : (
              <>
                <h1 className="text-black text-sm ml-3 -mt-2">
                  Have Account
                  <span
                    className=" mx-1 cursor-pointer underline text-blue-500"
                    onClick={() => setSignUpToggle((value) => !value)}
                  >
                    Login
                  </span>{" "}
                </h1>{" "}
              </>
            )}
          </div>
          <div className="flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          <div className=" flex justify-center gap-3">
            <button className="text-2xl text-black ">
              <FaGithub />
            </button>
            <button className="text-black text-2xl">
              <FaGoogle />
            </button>
          </div>
          <p className="text-center text-sm text-gray-600">
            By tapping{!signUpToggle ? " Log in" : " Sign Up"} or Continue, you
            agree to our Terms. Learn how we process your data in our Privacy
            Policy, and Cookie Policy.
          </p>
          {!signUpToggle && (
            <>
              <div className="text-center">
                <a href="#" className="text-sm text-blue-500 hover:underline">
                  Trouble Logging In? Forget password
                </a>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreateAccountComponent;
