import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, KeyRound, User } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router";
import { BASE_URL } from "../utils/contants";
import { useForm } from "react-hook-form"; // 1. Import the library

const CreateAccountComponent = ({ onClose }) => {
  // 2. Initialize the hook
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm();

  const [apiError, setApiError] = useState(""); // Renamed for clarity
  const modalRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signUpToggle, setSignUpToggle] = useState(false);

  // Close modal when clicking outside
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

  // Clear form and errors when switching between Login and Signup
  useEffect(() => {
    reset();
    setApiError("");
  }, [signUpToggle, reset]);

  // 3. Unified Submit Handler
  const onSubmit = async (data) => {
    setApiError(""); // Clear previous API errors

    try {
      if (!signUpToggle) {
        // --- LOGIN LOGIC ---
        const res = await axios.post(
          `${BASE_URL}/login`,
          {
            emailId: data.emailId,
            password: data.password,
          },
          { withCredentials: true }
        );
        console.log("login data", res.data.user);
        dispatch(addUser(res.data.user));
        return navigate("/feed");
      } else {
        // --- SIGNUP LOGIC ---
        const res = await axios.post(
          `${BASE_URL}/signup`,
          {
            firstName: data.firstName,
            lastName: data.lastName,
            emailId: data.emailId,
            password: data.password,
            age: 25, // Default age
            gender: "male", // Default gender
            about: "I am a new user", // Default about
          },
          { withCredentials: true }
        );
        dispatch(addUser(res.data.user));
        return navigate("/profile");
      }
    } catch (err) {
      setApiError(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "An error occurred"
      );
    }
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-auto mt-5"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
      >
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-xl font-bold flex justify-center">
            {signUpToggle ? "Create Account" : "Welcome Back"}
          </h2>
        </div>

        {/* 4. Wrap inputs in a generic Form tag */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            
            {/* --- First Name & Last Name (Only for Sign Up) --- */}
            {signUpToggle && (
              <>
                <div>
                  <label className="text-black font-semibold mx-3">First Name</label>
                  <div className={`w-auto flex items-center space-x-2 border rounded-lg px-4 py-2 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}>
                    <User className="w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Tyler"
                      className="flex-1 outline-none"
                      {...register("firstName", { 
                        required: "First name is required" 
                      })}
                    />
                  </div>
                  {errors.firstName && <span className="text-red-500 text-xs ml-3">{errors.firstName.message}</span>}
                </div>

                <div>
                  <label className="text-black font-semibold mx-3">Last Name</label>
                  <div className={`flex items-center space-x-2 border rounded-lg px-4 py-2 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}>
                    <User className="w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Durden"
                      className="flex-1 outline-none"
                      {...register("lastName", { 
                        required: "Last name is required" 
                      })}
                    />
                  </div>
                  {errors.lastName && <span className="text-red-500 text-xs ml-3">{errors.lastName.message}</span>}
                </div>
              </>
            )}

            {/* --- Email Address --- */}
            <div>
              <label className="text-black font-semibold mx-3">Email Address</label>
              <div className={`flex items-center space-x-2 border rounded-lg px-4 py-2 ${errors.emailId ? 'border-red-500' : 'border-gray-300'}`}>
                <Mail className="w-5 h-5 text-gray-500" />
                <input
                  type="email" // Changed from tel to email
                  placeholder="name@example.com"
                  className="flex-1 outline-none"
                  {...register("emailId", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
              </div>
              {errors.emailId && <span className="text-red-500 text-xs ml-3">{errors.emailId.message}</span>}
            </div>

            {/* --- Password --- */}
            <div>
              <label className="text-black font-semibold mx-3">Password</label>
              <div className={`flex items-center space-x-2 border rounded-lg px-4 py-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}>
                <KeyRound className="w-5 h-5 text-gray-500" />
                <input
                  type="password" // Changed from tel to password
                  placeholder="••••••"
                  className="flex-1 outline-none"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                />
              </div>
              {errors.password && <span className="text-red-500 text-xs ml-3">{errors.password.message}</span>}
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="text-red-500 font-bold text-sm ml-2">
                <span>{apiError}</span>
              </div>
            )}
          </div>

          <button
            type="submit" // Changed to submit type
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {signUpToggle ? "Sign Up" : "Log In"}
          </button>
        </form>

        {/* Toggle between Login/Signup */}
        <div className="mt-4">
          {!signUpToggle ? (
            <h1 className="text-black text-sm ml-3">
              Don't have an account?
              <span
                className="mx-1 cursor-pointer underline text-blue-500"
                onClick={() => setSignUpToggle(true)}
              >
                Sign up
              </span>
            </h1>
          ) : (
            <h1 className="text-black text-sm ml-3">
              Already have an account?
              <span
                className="mx-1 cursor-pointer underline text-blue-500"
                onClick={() => setSignUpToggle(false)}
              >
                Login
              </span>
            </h1>
          )}
        </div>

        <div className="flex items-center mt-4 mb-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        <div className="flex justify-center gap-3">
          <button className="text-2xl text-black">
            <FaGithub />
          </button>
          <button className="text-black text-2xl">
            <FaGoogle />
          </button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-4">
          By continuing, you agree to our Terms, Privacy Policy, and Cookie Policy.
        </p>
        {!signUpToggle && (
          <div className="text-center mt-2">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Trouble Logging In? Forget password
            </a>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CreateAccountComponent;