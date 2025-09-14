import React, { useCallback } from "react";
import { CardContainer, CardBody, CardItem } from "./ui/ThreeDCard";
import axios from "axios";
import { BASE_URL } from "../utils/contants";
import { Heart, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { removeFeedCard } from "../utils/feedSlice";
import { useLocation } from "react-router";

const Card = ({ user }) => {
  if (!user) {
    return null;
  }

  const location = useLocation();
  const { _id, firstName, lastName, image, about, age, gender } = user;

  
  const capitalize = (str) => {
    if (typeof str !== 'string' || !str) {
      return '';  // Return an empty string or handle the case as needed
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  
  const dispatch = useDispatch();

  const sendRequest = useCallback(
    async (status, userId) => {
      try {
        // console.log(`Sending ${status} request for user ID: ${userId}`);
        const res = await axios.post(
          `${BASE_URL}/request/send/${status}/${userId}`,
          {},
          { withCredentials: true }
        );
        // console.log("API Response:", res.status, res.data);
        if (res.status === 201) {
          // Changed from 200 to 201
          // console.log(`Dispatching removeFeedCard for user ID: ${userId}`);
          dispatch(removeFeedCard(userId));
        }
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
      }
    },
    [dispatch]
  );

  const hideButtons = location.pathname === "/profile";

  return (
    <div className="flex justify-center items-center max-h-full rounded-xl bg-[#4586ff]">
      <CardContainer>
        <CardBody className="bg-gray-50 border border-gray-300 px-6 pb-80 rounded-lg shadow-lg">
          <CardItem translateZ={100} className="w-full mt-5">
            <img
              src={image}
              alt="Floating Card"
              className="h-[24rem] w-full object-cover rounded-lg shadow-lg"
            />
          </CardItem>
          <CardItem
            translateZ={50}
            className="text-xl font-bold text-gray-800 mt-8"
          >
            {capitalize(firstName) + " " +capitalize(lastName) }
          </CardItem>
          <div className="flex">
            <CardItem translateZ={60} className="text-gray-700 text-md mr-2">
              {age}
            </CardItem>
            <CardItem translateZ={60} className="text-gray-700 text-md">
              {capitalize(gender)}
            </CardItem>
          </div>
          <CardItem translateZ={60} className="text-gray-600 text-sm">
            {about}
          </CardItem>
          {!hideButtons && (
            <div className="flex justify-between items-center mt-8 relative z-10">
              <CardItem
                as="button"
                translateZ={20}
                className="cursor-pointer pointer-events-auto px-4 py-2 bg-black text-white font-bold rounded-lg"
              >
                <button
                  className="flex gap-1"
                  onClick={() => sendRequest("like", _id)}
                >
                  <Heart className="" />
                  Like
                </button>
              </CardItem>
              <CardItem
                as="button"
                translateZ={20}
                className="cursor-pointer pointer-events-auto px-4 py-2 bg-black text-white font-bold rounded-lg"
              >
                <button
                  className="flex gap-1"
                  onClick={() => sendRequest("pass", _id)}
                >
                  <X />
                  Pass
                </button>
              </CardItem>
            </div>
          )}
        </CardBody>
      </CardContainer>
    </div>
  );
};

export default Card;
