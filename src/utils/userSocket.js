import { io } from "socket.io-client";

const SOCKET_URL = "https://fishselling-backend.onrender.com";

export const newUserSocket = (token) => {
  return io(SOCKET_URL, {
    auth: { token },
  
  });
};
