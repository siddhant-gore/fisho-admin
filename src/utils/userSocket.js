import { io } from "socket.io-client";
import { SOCKET_BASE_URL } from "../redux/slices/apiSlice";

const SOCKET_URL = `${SOCKET_BASE_URL}`;

export const newUserSocket = (token) => {
  return io(SOCKET_URL, {
    auth: { token },
  
  });
};
