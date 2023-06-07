import { io } from 'socket.io-client';

export const socket = io();

socket.on("connect", () => {
    console.log("Websocket connected!");
})