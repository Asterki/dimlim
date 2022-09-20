"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../");
const databases_1 = __importDefault(require("../config/databases"));
__1.io.sockets.on("connection", (socket) => {
    socket.on("join-home-page-listener", (userID) => {
        socket.join(userID);
    });
    socket.on("join-chat", (data) => __awaiter(void 0, void 0, void 0, function* () {
        const contactUsername = data.contact;
        const userUsername = data.user;
        if (!contactUsername || !userUsername)
            return;
        // Get the users from the database to do checks
        const users = yield databases_1.default.get("users");
        const user = users.find((user) => user.username == userUsername);
        const contact = users.find((user) => user.username == contactUsername);
        if (!user || !contact)
            return;
        // Find the room using the secrets
        const roomName = [user.chatSecret, contact.chatSecret].sort().join("&");
        const room = __1.io.sockets.adapter.rooms.get(roomName);
        // Checks
        if (room && Array.from(room.entries()).length > 2)
            return;
        return socket.join(roomName);
    }));
    socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        if (!data.recipient || !data.author || !data.timestamp)
            return;
        const users = yield databases_1.default.get("users");
        const author = users.find((user) => user.username == data.author);
        const recipient = users.find((user) => user.username == data.recipient);
        if (!author || !recipient)
            return;
        // Check if the user is blocked
        if (recipient.blockedContacts.find((listUser) => listUser.userID == (author === null || author === void 0 ? void 0 : author.userID)) !== undefined)
            return;
        const roomName = [author.chatSecret, recipient.chatSecret].sort().join("&");
        socket.to(roomName).emit("message", data);
    }));
});
