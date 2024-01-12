import { v4 as uuidv4 } from 'uuid';
import { Server } from "socket.io";

function createMessage(content, id) {
    if (typeof content !== "string") {
        throw new Error("Content must be a string");
    }

    if (content.length === 0) {
        throw new Error("Content cannot be empty");
    }

    return {
        content,
        userid: id,
        id: uuidv4(),
    };
}


export async function createSocket(app) {
    let messages = [];

    const io = new Server(app);
    

    io.on("connection", (socket) => {
        socket.emit("messages", messages);

        socket.on("message", (content, id) => {
            console.log("Message received", content, id);
            try {
                const message = createMessage(content, id);
                messages = [message, ...messages];

                io.sockets.emit("messages", messages);

                return {
                    message: "success",
                };
            } catch (error) {
                return {
                    error: error.message || "Error occured when sending a message",
                };
            }
        });
    });
}
