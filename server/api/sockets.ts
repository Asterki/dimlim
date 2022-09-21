import { io } from "../";
import db from "../config/databases";

import { User } from "../types";

io.sockets.on("connection", (socket: any) => {
    socket.on("join-home-page-listener", (userID: string) => {
        socket.join(userID);
    });

    socket.on("join-chat", async (data: any) => {
        const contactUsername = data.contact;
        const userUsername = data.user;

        if (!contactUsername || !userUsername) return;

        // Get the users from the database to do checks
        const users = await db.get("users");
        const user: User | undefined = users.find((user: User) => user.username == userUsername);
        const contact: User | undefined = users.find((user: User) => user.username == contactUsername);

        if (!user || !contact) return;

        // Find the room using the secrets
        const roomName = [user.chatSecret, contact.chatSecret].sort().join("&");
        const room: any = io.sockets.adapter.rooms.get(roomName);

        // Checks
        if (room && Array.from(room.entries()).length > 2) return;
        return socket.join(roomName);
    });

    socket.on("message", async (data: any) => {
        if (!data.recipient || !data.author || !data.timestamp) return;

        const users = await db.get("users");
        const author: User | undefined = users.find((user: User) => user.username == data.author);
        const recipient: User | undefined = users.find((user: User) => user.username == data.recipient);

        if (!author || !recipient) return;

        // Check if the user is blocked
        if (recipient.blockedContacts.find((listUser: User) => listUser.userID == author?.userID) !== undefined) return;

        // If the other user isn't in the chat room
        const roomName = [author.chatSecret, recipient.chatSecret].sort().join("&");
        const room: any = io.sockets.adapter.rooms.get(roomName);

        if (Array.from(room.entries()).length == 1) {
            let pendingMessages = await db.get(`${recipient.userID}_pending`);
            if (!pendingMessages) pendingMessages = [];

            data.new = true;
            pendingMessages.push(data);
            await db.set(`${recipient.userID}_pending`, pendingMessages);
        }
        socket.to(roomName).emit("message", data);
    });
});

export {};
