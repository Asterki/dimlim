import { io } from "../";

io.sockets.on("connection", (socket: any) => {
    socket.on("join-home-page-listener", (userID: string) => {
        socket.join(userID);
    });

    socket.on("join-chat", (data: any) => {});
});

export {};
