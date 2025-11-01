import { createContext, useMemo ,useContext} from "react";
import { BASE_URL } from "../utils/contants.js";
import { io } from "socket.io-client";

const SocketContext=createContext();
const getSocket=()=>useContext(SocketContext)

const SocketProvider=({children})=>{
 
	const socket =useMemo(()=>io(BASE_URL, {withCredentials: true,transports:["websocket"],}),[])
	return (
		<SocketContext.Provider value={socket}>
			{children}
		</SocketContext.Provider>
	)
}

export{SocketProvider,getSocket}