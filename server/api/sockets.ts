import { io } from "../";
import db from "../config/databases";

import { User, Contact } from "../types";

io.sockets.on("connection", (socket: any) => {
    socket.on("join-home-page-listener", (userID: string) => {
        socket.join(`notification listener ${userID}`);
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
        const roomName = [user.userID, contact.userID].sort().join("&");
        const room: any = io.sockets.adapter.rooms.get(roomName);

        // Checks
        if (room && Array.from(room.entries()).length > 2) return;
        return socket.join([roomName, `notification listener ${user.userID}`]);
    });

    socket.on("message", async (data: any) => {
        if (!data.recipient || !data.author || !data.timestamp) return;

        const users = await db.get("users");
        const author: User | undefined = users.find((user: User) => user.username == data.author);
        const recipient: User | undefined = users.find((user: User) => user.username == data.recipient);

        if (!author || !recipient) return;

        // Check if the user is blocked
        if (recipient.blockedContacts.find((listUser: Contact) => listUser.userID == author?.userID) !== undefined) return;

        // If the other user isn't in the chat room
        const roomName = [author.userID, recipient.userID].sort().join("&");
        const room: any = io.sockets.adapter.rooms.get(roomName);

        // If the recipient isn't in the room
        if (Array.from(room.entries()).length == 1) {
            const messageNotifications: any = {
                es: "Tienes un nuevo mensaje de",
                en: "You have a new message from",
                pr: "Você recebeu uma nova mensagem de",
                de: "Du hast eine neue Nachricht von",
                fr: "Vous avez un nouveau message de",
            };

            let pendingMessages = await db.get(`${author.userID}_${recipient.userID}_pending`);
            if (!pendingMessages) pendingMessages = [];

            // Save to pending messages
            data.new = true;
            pendingMessages.push(data);
            await db.set(`${roomName}_pending`, pendingMessages);

            // Check if the user is muted
            const recipientContact = recipient.contacts.find((listUser: Contact) => listUser.userID == author?.userID);
            if (recipientContact?.muted) return;

            socket.to(`notification listener ${recipient.userID}`).emit("notification", {
                content: `${messageNotifications[recipient.preferredLanguage]} ${author.username}`,
                url: `/chat/${author.username}?id=${author.userID}`,
            });
        }
        socket.to(roomName).emit("message", data);
    });
});

export {};
