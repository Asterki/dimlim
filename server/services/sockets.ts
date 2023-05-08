// File under refactoring

import { io } from "../";

import UserModel from "../models/user";

io.sockets.on("connection", (socket: any) => {
    socket.on("join-home-page-listener", (userID: string) => {
        socket.join(`notification listener ${userID}`);
    });

    socket.on("join-chat", async (data: any) => {
        const contactUsername = data.contact;
        const userUsername = data.user;

        if (!contactUsername || !userUsername) return;

        const user = await UserModel.findOne({ username: data.user })
        const contact = await UserModel.findOne({ username: data.contact })

        if (!user || !contact) return;

        // Find the room using the secrets
        const roomName = [user.userID, contact.userID].sort().join("&");
        const room: any = io.sockets.adapter.rooms.get(roomName);

        // Checks
        if (room && Array.from(room.entries()).length > 2) return;
        return socket.join([roomName, `notification listener ${user.userID}`]);
    });

    socket.on("message", async (data: any) => {
        if (!data.recipient || !data.author || !data.timestamp || !data.message) return;

        const author = await UserModel.findOne({ username: data.author })
        const recipient = await UserModel.findOne({ username: data.recipient })

        if (!author || !recipient) return;

        const roomName = [author.userID, recipient.userID].sort().join("&");
        socket.to(roomName).emit("message", data);
    });
});

export {};
