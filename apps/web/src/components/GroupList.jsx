import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/contants";
import { useNavigate } from "react-router-dom";

function GroupList() {
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef();
  const navigate = useNavigate();

  const fetchGroups = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
	  const res = await axios.get(`${BASE_URL}/groups?page=${page}&limit=6`, {
        withCredentials: true,
      });
      const data = res.data || [];
      setGroups((prev) => [
        ...prev,
        ...data.filter((g) => !prev.find((x) => x._id === g._id)),
      ]);
      if (data.length < 6) setHasMore(false);
    } catch (err) {
      console.error("Error fetching groups:", err.message);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  const lastGroupRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups, page]);

  const handleGroupClick = (groupId) => {
    navigate(`/group/${groupId}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 relative">
		  <button
        onClick={() => navigate(-1)}
        className="absolute left-4 top-6 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200"
      >
        <span className="text-xl">←</span> Back
      </button>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-10 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
        Explore Travel Groups 🌍
      </h2>

      <div className="border-gray-50 shadow-slate-50">
        {groups.map((group, index) => (
          <div
            key={group._id}
            ref={groups.length === index + 1 ? lastGroupRef : null}
            onClick={() => handleGroupClick(group._id)}
            className="group relative bg-white/30 cursor-pointer backdrop-blur-lg border border-gray-200 shadow-lg rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-900 truncate">
              {group.groupName}
            </h3>
            <div className="flex  space-x-2">
			<p className="text-gray-600 mb-2 line-clamp-2">
              {group.description}
            </p>
            <p className="text-sm text-gray-700 ">
              <span className="text-blue-400">Destination:</span> {Array.isArray(group.destination) ? group.destination.join(", ") : group.destination}
            </p>
            <p className="text-sm text-gray-700">
             <span className="text-blue-400"> Members:</span> {group.groupMembers?.length || 0}/{group.maxMembers}
            </p>
			</div>
          </div>
        ))}
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-8 animate-pulse">
          Loading more groups...
        </p>
      )}
    </div>
  );
}

export default GroupList;
