import React, { useState ,useEffect} from "react";
import MemberList from "./MemberList";
import { useParams } from "react-router";
import axios from "axios";
import { BASE_URL } from "../utils/contants";
import { useNavigate } from "react-router-dom";
function ChatHeader() {
  const [showMembers, setShowMembers] = useState(false);
  	const {groupId}=useParams()
   const navigate = useNavigate();
	const [group,setGroup]=useState(null)
  
   useEffect(() =>{
	  const fetchGroupInfo = async () => {
		try {
		  const res = await axios.get(`${BASE_URL}/group/${groupId}`, {
			withCredentials: true,
		  });
		  setGroup(res.data.group);
		} catch (error) {
		  console.error('Error fetching group info:', error.message);
		}
	  };
	   if (groupId) fetchGroupInfo();
   },[groupId])
	 
	console
   
  return (
    <>
     <button
        onClick={() => navigate(-1)}
        className="absolute space-y-2 left-2 top-0 flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200"
      >    
        <span className="text-xl">←</span>Back 
       </button>
    <div className="bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
       
      <div>
        <h2
          className="text-xl font-semibold cursor-pointer hover:text-blue-600"
          onClick={() => setShowMembers(!showMembers)}
        >
          {group?.groupName}
        </h2>
        <p className="text-sm text-gray-500">{group?.description}</p>
      </div>

      {showMembers && (
        <MemberList
          members={group.groupMembers}
          adminId={group.groupAdmin?._id}
          onClose={() => setShowMembers(false)}
        />
      )}
    </div>
    </>
  );
}

export default ChatHeader;
