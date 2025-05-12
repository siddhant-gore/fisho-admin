import { io } from "socket.io-client";

const SOCKET_URL = "https://fishselling-backend.onrender.com/admin";

export const newSocket = (token) => {
  return io(SOCKET_URL, {
    auth: { token },
  
  });
};
