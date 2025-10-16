import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/contants";
import { useDispatch, useSelector } from "react-redux";
import { setFeed } from "../utils/feedSlice";
import Card from "./Card";
import type { RootState, AppDispatch } from "../utils/appStore"; 
interface User {
  id?: string;
  name?: string;
  [key: string]: any;
}

const Feed:React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const feed = useSelector((store:RootState) => store.feed);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getFeed = async ():Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/user/feed`, { withCredentials: true });
      console.log("API Response:", res.data);
      
      // Extract the actual feed data from the response
      if (res.data && res.data.feed) {
        dispatch(setFeed(res.data.feed));
        console.log("Feed data dispatched:", res.data.feed);
      } else {
        console.error("Invalid feed data structure:", res.data);
        setError("Invalid feed data structure");
      }
    } catch (err:any) {
      console.error("Fetch Error:", err);
      setError(err.message || "Failed to fetch feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg">Loading feed...</div>
    </div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-red-500">Error: {error}</div>
    </div>;
  }

  if (!feed || feed.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-lg">No users available</div>
    </div>;
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-4">
      <h2 className="text-2xl font-bold text-gray-800">Discover People</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        {feed.map((user:User, index:number) => (
          <Card key={user.id || index} user={user} />
        ))}
      </div>
    </div>
  );
};

export default Feed;