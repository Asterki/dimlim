import { Server } from "socket.io";
import { createServer } from "http";

import { Express } from "express";

class SocketServer {
    private static instance: SocketServer | null = null;

    io: Server = new Server();

    loadToServer(server: ReturnType<typeof createServer>) {
        this.io.attach(server, {
            cors: {
                origin: "*",
            },
        });

        this.io.on("connection", (socket) => {
            console.log("Socket connected");
        });

        // Once the server is ready
        this.io.on("listening", () => {
            console.log("Socket server ready");
        });
    }

    public static getInstance() {
        if (!SocketServer.instance) SocketServer.instance = new SocketServer();
        return SocketServer.instance;
    }
}

export default SocketServer;

