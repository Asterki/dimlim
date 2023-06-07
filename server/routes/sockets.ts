// File under refactoring

import { Socket } from "socket.io";
import { io } from "../";

import UserModel from "../models/user";

io.sockets.on("connection", (socket: Socket) => {
    socket.on("join-chat", async (data: { userID: string, contactID: string }) => {
        const { userID, contactID } = data
        if (!userID || !contactID) return;

        const user = await UserModel.findOne({ userID: userID })
        const contact = await UserModel.findOne({ userID: contactID })
        if (!user || !contact) return;

        // Find the room using the secrets
        const roomName = [user.userID, contact.userID].sort().join("&");
        const room: any = io.sockets.adapter.rooms.get(roomName);

        // Checks
        if (room && Array.from(room.entries()).length > 2) return;
        return socket.join([roomName, `notification listener ${user.userID}`]);
    });

    socket.on("message", async (data: { content: string, timestamp: number, authorID: string, contactID: string }) => {
        const roomName = [data.authorID, data.contactID].sort().join("&")

        // TODO: if there's only 1 person in the room, save it and send it later

        socket.to(roomName).emit("message", data);
    })
});

export { };
