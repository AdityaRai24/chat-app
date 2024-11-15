import { useAppStore } from "@/store";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
} from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const { userInfo } = useAppStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io("http://localhost:8000", {
        withCredentials: true,
        query: {
          userId: userInfo.id,
        },
      });

      socket.current.on("connect",()=>{
        console.log("Connected to socket server")
      })

      return ()=>{
        socket.current.disconnect();
      }
    }
  }, []);


  return(
    <SocketContext.Provider value={socket.current}>
        {children}
    </SocketContext.Provider>
  )

};
