import React from "react";
import { useParams } from "react-router";
import { BASE_URL } from "../utils/contants.js";
import { usePagination } from "../hooks/usePagination.js";

function MemberList({ adminId, onClose }) {
  const { groupId } = useParams();

  const {
    items: members,
    loadMore,
    hasMore,
    loading,
  } = usePagination(`${BASE_URL}/group/${groupId}/members`, {
    limit: 10,
  });

  return (
    <div className=" w-[85%] absolute top-16 left-10 right-0 bg-white shadow-lg border rounded-lg p-4 z-20 max-h-96 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-800">Members</h3>
        <button
          onClick={onClose}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Close
        </button>
      </div>

      {members.length === 0 && !loading && (
        <p className="text-gray-500 text-center">No members found</p>
      )}

      {members.map((m) => (
        <div
          key={m._id}
          className="flex items-center  border-b py-2 w-[70%] p-2 mb-2"
        >
          <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img src={m.profileImage} alt="user profile image"
             />
          </div>
          <div >
            <p className="font-medium">
              {m.firstName} {m.lastName}
            </p>
            <p className="text-sm text-gray-500">{m.email}</p>
          </div>
          {m._id === adminId && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Admin
            </span>
          )}
        </div>
      ))}

      {loading && <p className="text-center text-gray-500 mt-2">Loading...</p>}

      {!loading && hasMore && (
        <button
          onClick={loadMore}
          className="w-full mt-3 text-sm text-blue-600 hover:underline"
        >
          Load More
        </button>
      )}
    </div>
  );
}

export default MemberList;

