
// socket
import { Server as SocketIOServer, Socket } from "socket.io";

export const socketHandler = (io: SocketIOServer) => {
  io.on("connection", (socket: Socket) => {
    console.log("New client connected");
    socket.on("joinRoom", (id: string) => {
      console.log(`User joined room: ${id}`);
      socket.join(id);
    });

    socket.on("message", (messageData) => {
      if (!messageData.chatId || !messageData.text) {
        console.error("Invalid message data:", messageData);
        return;
      }
      console.log('gointg to emit');

      io.to(messageData.chatId).emit("message", messageData);
    });


    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });
};
