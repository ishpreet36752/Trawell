import axios from "axios";
import React, { useEffect } from "react";
import { BASE_URL } from "../utils/contants";
import { useDispatch, useSelector } from "react-redux";
import { addConnection } from "../utils/connectionsSlice";
import  CardDemo  from "./ConnectionCard";
import type { AppDispatch,RootState } from "../utils/appStore";
import { Connection } from "../types/connection";
const Connections:React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const connections = useSelector((store:RootState) => store.connections);

  const fetchConnection = async ():Promise<void> => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      // console.log(res?.data?.data);
      dispatch(addConnection(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnection();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) return <h1>NO Connections Found</h1>;

  return (
    <div className="text-center">
      <h1 className="text-black text-3xl font-bold">Connections</h1>
      <div className="grid grid-cols-4 gap-6 mt-3">
        {connections.map((connection:Connection) => (
          <div key={connection._id} className="">
            <CardDemo connection={connection} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Connections;
