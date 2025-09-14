import React, { useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/contants";
import { useDispatch, useSelector } from "react-redux";
import { addRequest } from "../utils/requestSlice";
import CardDemo from "./ConnectionCard"; // same CardDemo, no buttons inside

const Requests = () => {
  const dispatch = useDispatch();
  const reqs = useSelector((store) => store.requests);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections/pending`, {
        withCredentials: true,
      });
      dispatch(addRequest(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  // The function to review each request
  const reviewRequest = async (status, requestId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        {
          withCredentials: true,
        }
      );
      // Optional: refresh the list or update state after reviewing
      fetchRequests();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!reqs) return null;
  if (reqs.length === 0) return <h1>No Requests Found</h1>;

  return (
    <div className="text-center">
      <h1 className="text-black text-3xl font-bold">Requests</h1>
      <div className="grid grid-cols-4 gap-6 mt-3">
        {reqs.filter(req => req?.fromUserId).map((req) => (
          <div key={req?.fromUserId?._id}>
            {/* Card */}
            <CardDemo connection={req?.fromUserId} />

            {/* Buttons (same classes as before) */}
            <div className="m-3 flex justify-between mx-4">
              <button
                onClick={() => reviewRequest("accept", req?._id)}
                className="px-4 py-2 rounded-md border font-semibold border-black bg-blue-500 text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              >
                Accept
              </button>
              <button
                onClick={() => reviewRequest("reject", req?._id)}
                className="px-4 py-2 rounded-md border font-semibold border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Requests;
