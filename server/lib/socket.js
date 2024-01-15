import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";

let io;

export async function initializeSocket(app) {
  io = new Server(app, {
    cors: {
      origin: ["http://localhost:5173", "https://admin.socket.io"],
      credentials: true,
    },
  });
  instrument(io, {
    auth: false,
  });

  io.on("connection", (socket) => {
    //console.log("Client connected", socket.id);
    socket.on("join-room", (roomKey) => {
      console.log("join-room", roomKey, socket.id);
    });
    socket.on("disconnect", () => {
      //console.log("Client disconnected", socket.id);
    });
  });
}

export function getIO() {
  if (!io) {
    throw new Error("Socket not initialized. Call initializeSocket first.");
  }
  return io;
}

export async function createOrJoinRoom(user, roomKey) {
  const io = getIO();
  const socket = io.sockets.sockets.get(user.socketId);

  if (!socket) {
    console.log("Socket not found");
    return;
  }
  console.log("createOrJoinRoom", user.socketId, roomKey, socket.id);
  socket.join(roomKey);

  const message = {
    display_name: user.display_name,
    key: roomKey,
  };

  io.to(roomKey).emit("user-join", message);

  return true;
}

export function LeaveRoom(user, roomKey) {
  const socket = io.sockets.sockets.get(user.socket_id);
  if (!socket) {
    console.log(
      `Socket Leave Room :: Unable to find socket with ID: ${user.socket_id}`
    );
    return false;
  }
  socket.leave(roomKey);

  const message = {
    display_name: user.display_name,
    key: roomKey,
  };

  socket.to(roomKey).emit("user-leave", message);
  return true;
}
export function disconnectSocket(socketID) {
  if (!socketID) return;

  io.in(socketID).disconnectSockets(true);
}
