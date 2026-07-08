import { io, Socket } from "socket.io-client";

import { SOCKET_URL } from "./hackathon-api";

let socket: Socket | null = null;

export function getHackathonSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      withCredentials: false,
    });
  }

  return socket;
}
